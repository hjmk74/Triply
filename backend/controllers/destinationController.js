const db = require("../db");
const { searchWikimediaImage, wait } = require("../services/imageService");

function queryDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });
}

function updateDestinationImage(imageUrl, destinationId) {
  return queryDatabase(
    `
      UPDATE destinations
      SET image = ?
      WHERE id = ?
    `,
    [imageUrl, destinationId],
  );
}

function getAllDestinations(req, res) {
  const sql = `
    SELECT
      destinations.id,
      destinations.name,
      destinations.description,
      destinations.image,
      destinations.rating,
      destinations.type,
      destinations.best_time,
      destinations.currency,
      destinations.language,
      destinations.latitude,
      destinations.longitude,
      destinations.review_count,
      destinations.is_popular,
      destinations.is_recommended,
      countries.name AS country
    FROM destinations
    JOIN countries
      ON destinations.country_id = countries.id
    ORDER BY countries.id DESC, destinations.id ASC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching destinations:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch destinations",
      });
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
}

function getDestinationById(req, res) {
  const destinationId = req.params.id;

  const sql = `
    SELECT
      destinations.id,
      destinations.name,
      destinations.description,
      destinations.image,
      destinations.rating,
      destinations.type,
      destinations.best_time,
      destinations.currency,
      destinations.language,
      destinations.latitude,
      destinations.longitude,
      destinations.review_count,
      destinations.is_popular,
      destinations.is_recommended,
      countries.name AS country,
      countries.code AS country_code
    FROM destinations
    JOIN countries
      ON destinations.country_id = countries.id
    WHERE destinations.id = ?
  `;

  db.query(sql, [destinationId], (error, results) => {
    if (error) {
      console.error("Error fetching destination:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch destination",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.json({
      success: true,
      data: results[0],
    });
  });
}

async function getDestinationImage(req, res) {
  const destinationId = req.params.id;

  const sql = `
    SELECT
      destinations.name,
      countries.name AS country
    FROM destinations
    JOIN countries
      ON destinations.country_id = countries.id
    WHERE destinations.id = ?
  `;

  try {
    const results = await queryDatabase(sql, [destinationId]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const destinationName = results[0].name;
    const countryName = results[0].country;

    const imageUrl = await searchWikimediaImage(destinationName, countryName);

    return res.json({
      success: true,
      data: {
        destination: destinationName,
        country: countryName,
        image: imageUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching destination image:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch image",
    });
  }
}

async function fetchAndSaveDestinationImages(req, res) {
  const sql = `
    SELECT
      destinations.id,
      destinations.name,
      countries.name AS country,
      destinations.image
    FROM destinations
    JOIN countries
      ON destinations.country_id = countries.id
    ORDER BY destinations.id ASC
  `;

  try {
    const destinations = await queryDatabase(sql);
    const results = [];

    for (const destination of destinations) {
      try {
        if (destination.image && destination.image.trim() !== "") {
          console.log(`Skipping ${destination.name} - image already exists`);

          results.push({
            id: destination.id,
            name: destination.name,
            country: destination.country,
            image: destination.image,
            status: "already_exists",
          });

          continue;
        }

        const imageUrl = await searchWikimediaImage(
          destination.name,
          destination.country,
          3,
        );

        if (!imageUrl) {
          results.push({
            id: destination.id,
            name: destination.name,
            country: destination.country,
            image: null,
            status: "not_found",
          });

          await wait(1000);
          continue;
        }

        await updateDestinationImage(imageUrl, destination.id);

        console.log(`Image saved: ${destination.name}`);

        results.push({
          id: destination.id,
          name: destination.name,
          country: destination.country,
          image: imageUrl,
          status: "saved",
        });

        await wait(1500);
      } catch (error) {
        console.error(`Error processing ${destination.name}:`, error.message);

        results.push({
          id: destination.id,
          name: destination.name,
          country: destination.country,
          image: null,
          status: "error",
          error: error.message,
        });

        await wait(1000);
      }
    }

    const saved = results.filter((item) => item.status === "saved").length;

    const alreadyExists = results.filter(
      (item) => item.status === "already_exists",
    ).length;

    const notFound = results.filter(
      (item) => item.status === "not_found",
    ).length;

    const errors = results.filter((item) => item.status === "error").length;

    return res.json({
      success: true,
      message: "Destination images processed",
      summary: {
        total: results.length,
        saved,
        alreadyExists,
        notFound,
        errors,
      },
      data: results,
    });
  } catch (error) {
    console.error("Error fetching destinations:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch destinations",
      error: error.message,
    });
  }
}

function getDestinationHotels(req, res) {
  const destinationId = req.params.id;

  const sql = `
    SELECT
      id,
      destination_id,
      name,
      image,
      rating,
      price_per_night,
      location
    FROM hotels
    WHERE destination_id = ?
    ORDER BY id ASC
  `;

  db.query(sql, [destinationId], (error, results) => {
    if (error) {
      console.error("Error fetching hotels:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch hotels",
      });
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
}

function getDestinationActivities(req, res) {
  const destinationId = req.params.id;

  const sql = `
    SELECT
      id,
      destination_id,
      name,
      description,
      image,
      price
    FROM activities
    WHERE destination_id = ?
    ORDER BY id ASC
  `;

  db.query(sql, [destinationId], (error, results) => {
    if (error) {
      console.error("Error fetching activities:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch activities",
      });
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
}

module.exports = {
  getAllDestinations,
  getDestinationById,
  getDestinationImage,
  getDestinationHotels,
  getDestinationActivities,
  fetchAndSaveDestinationImages,
};
