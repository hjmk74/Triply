const db = require("../db");
const { findBestHotelImage, wait } = require("../services/imageService");

function queryDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function updateHotelImage(imageUrl, hotelId) {
  return queryDatabase(
    `
      UPDATE hotels
      SET image = ?
      WHERE id = ?
    `,
    [imageUrl, hotelId],
  );
}

function normalizeUrl(url) {
  return url ? url.split("?")[0] : null;
}

async function fetchAndSaveHotelImages(req, res) {
  try {
    const refresh =
      String(req.query.refresh || "").toLowerCase() === "true" ||
      req.query.refresh === "1";

    const hotels = await queryDatabase(`
      SELECT
        hotels.id,
        hotels.name,
        hotels.image,
        destinations.name AS destination,
        destinations.image AS destinationImage,
        countries.name AS country
      FROM hotels
      JOIN destinations
        ON hotels.destination_id = destinations.id
      JOIN countries
        ON destinations.country_id = countries.id
      ORDER BY hotels.id ASC
    `);

    const usedUrls = new Set();

    if (!refresh) {
      hotels.forEach((hotel) => {
        const normalizedUrl = normalizeUrl(hotel.image);

        if (normalizedUrl) {
          usedUrls.add(normalizedUrl);
        }
      });
    }

    const results = [];

    for (const hotel of hotels) {
      try {
        if (!refresh && hotel.image?.trim()) {
          results.push({
            id: hotel.id,
            name: hotel.name,
            destination: hotel.destination,
            country: hotel.country,
            image: hotel.image,
            status: "already_exists",
          });

          continue;
        }

        const image = await findBestHotelImage({
          hotelName: hotel.name,
          destination: hotel.destination,
          country: hotel.country,
          usedUrls,
          destinationImage: hotel.destinationImage,
        });

        if (!image?.url) {
          results.push({
            id: hotel.id,
            name: hotel.name,
            destination: hotel.destination,
            country: hotel.country,
            image: null,
            status: "not_found",
          });

          await wait(4000);
          continue;
        }

        await updateHotelImage(image.url, hotel.id);

        const normalizedImageUrl = normalizeUrl(image.url);

        if (normalizedImageUrl) {
          usedUrls.add(normalizedImageUrl);
        }

        console.log(
          `✓ Hotel image saved: ${hotel.name} | ${image.title} | score ${image.score}`,
        );

        results.push({
          id: hotel.id,
          name: hotel.name,
          destination: hotel.destination,
          country: hotel.country,
          image: image.url,
          sourceTitle: image.title,
          score: image.score,
          status: refresh && hotel.image ? "refreshed" : "saved",
        });

        await wait(5000);
      } catch (error) {
        console.error(`Error processing hotel ${hotel.name}:`, error.message);

        results.push({
          id: hotel.id,
          name: hotel.name,
          destination: hotel.destination,
          country: hotel.country,
          image: null,
          status: "error",
          error: error.message,
        });

        await wait(5000);
      }
    }

    return res.json({
      success: true,
      message: refresh
        ? "Hotel images refreshed with filtered unique Wikimedia results"
        : "Hotel images processed",
      summary: {
        total: results.length,
        saved: results.filter((item) => item.status === "saved").length,
        refreshed: results.filter((item) => item.status === "refreshed").length,
        alreadyExists: results.filter(
          (item) => item.status === "already_exists",
        ).length,
        notFound: results.filter((item) => item.status === "not_found").length,
        errors: results.filter((item) => item.status === "error").length,
      },
      data: results,
    });
  } catch (error) {
    console.error("Error fetching hotels:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process hotel images",
      error: error.message,
    });
  }
}

module.exports = {
  fetchAndSaveHotelImages,
};
