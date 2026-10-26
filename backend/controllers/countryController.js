const db = require("../db");

function getCountries(req, res) {
  const sql = `
    SELECT
      id,
      name,
      code
    FROM countries
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching countries:", err.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch countries",
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
}

module.exports = {
  getCountries,
};
