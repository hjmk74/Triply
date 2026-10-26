const db = require("../db");
const { searchWikimediaImage, wait } = require("../services/imageService");

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

function updateActivityImage(imageUrl, activityId) {
  return queryDatabase(
    `
      UPDATE activities
      SET image = ?
      WHERE id = ?
    `,
    [imageUrl, activityId],
  );
}

async function fetchAndSaveActivityImages(req, res) {
  try {
    const activities = await queryDatabase(`
      SELECT
        activities.id,
        activities.name,
        activities.image,
        destinations.name AS destination,
        countries.name AS country
      FROM activities
      JOIN destinations
        ON activities.destination_id = destinations.id
      JOIN countries
        ON destinations.country_id = countries.id
      ORDER BY activities.id ASC
    `);

    const results = [];

    for (const activity of activities) {
      try {
        if (activity.image && activity.image.trim() !== "") {
          results.push({
            id: activity.id,
            name: activity.name,
            destination: activity.destination,
            country: activity.country,
            image: activity.image,
            status: "already_exists",
          });

          continue;
        }

        const queries = [
          `${activity.name} ${activity.destination} ${activity.country}`,
          `${activity.name} ${activity.country}`,
          `${activity.destination} ${activity.country}`,
        ];

        let imageUrl = null;

        for (const query of queries) {
          imageUrl = await searchWikimediaImage(query);

          if (imageUrl) {
            break;
          }

          await wait(4000);
        }

        if (!imageUrl) {
          results.push({
            id: activity.id,
            name: activity.name,
            destination: activity.destination,
            country: activity.country,
            image: null,
            status: "not_found",
          });

          await wait(4000);
          continue;
        }

        await updateActivityImage(imageUrl, activity.id);

        console.log(`✓ Activity image saved: ${activity.name}`);

        results.push({
          id: activity.id,
          name: activity.name,
          destination: activity.destination,
          country: activity.country,
          image: imageUrl,
          status: "saved",
        });

        await wait(5000);
      } catch (error) {
        console.error(
          `Error processing activity ${activity.name}:`,
          error.message,
        );

        results.push({
          id: activity.id,
          name: activity.name,
          destination: activity.destination,
          country: activity.country,
          image: null,
          status: "error",
          error: error.message,
        });

        await wait(5000);
      }
    }

    return res.json({
      success: true,
      message: "Activity images processed",
      summary: {
        total: results.length,
        saved: results.filter((item) => item.status === "saved").length,
        alreadyExists: results.filter(
          (item) => item.status === "already_exists",
        ).length,
        notFound: results.filter((item) => item.status === "not_found").length,
        errors: results.filter((item) => item.status === "error").length,
      },
      data: results,
    });
  } catch (error) {
    console.error("Error fetching activities:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process activity images",
      error: error.message,
    });
  }
}

module.exports = {
  fetchAndSaveActivityImages,
};
