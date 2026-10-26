const db = require("../db");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequest = 0;

async function throttle() {
  const delay = 1200 - (Date.now() - lastRequest);

  if (delay > 0) {
    await sleep(delay);
  }

  lastRequest = Date.now();
}

const aliases = {
  "Al Disah": "Wadi Al Disah, Tabuk, Saudi Arabia",
  "Dhee Ayn": "Dhee Ayn Village, Al Baha, Saudi Arabia",
  "Al Wathba": "Al Wathba, Abu Dhabi, United Arab Emirates",
  "Mleiha": "Mleiha Archaeological Centre, Sharjah, United Arab Emirates",
  "Umm Qais": "Umm Qais, Jordan",
  "Dana": "Dana Village, Jordan",
  "Ajloun": "Ajloun, Jordan",
  "Martvili Canyon": "Martvili Canyon, Georgia",
  "Omalo": "Omalo, Georgia",
  "Siwa Oasis": "Siwa Oasis, Egypt",
  "Dakhla Oasis": "Dakhla Oasis, Egypt",
  "Fayoum": "Fayoum, Egypt",
  "Tannourine": "Tannourine, Lebanon",
  "Barbara": "Barbara, Lebanon",
  "Kfar Matta": "Kfar Matta, Lebanon",
  "Zekreet": "Zekreet, Qatar",
  "Al Thakira": "Al Thakira, Qatar",
  "Purple Island": "Purple Island, Qatar",
  "Failaka Island": "Failaka Island, Kuwait",
  "Kubbar Island": "Kubbar Island, Kuwait",
  "Al Abdali": "Abdali, Kuwait",
  "Misfat Al Abriyeen": "Misfat Al Abriyeen, Oman",
  "Wadi Bani Habib": "Wadi Bani Habib, Oman",
  "Al Khaluf": "Al Khaluf, Oman",
  "Hawar Islands": "Hawar Islands, Bahrain",
  "Al Areen": "Al Areen, Bahrain",
  "A'ali": "A'ali, Bahrain",
  "Tafraoute": "Tafraoute, Morocco",
  "Akchour": "Akchour, Morocco",
  "Legzira": "Legzira, Morocco",
  "Ain Draham": "Ain Draham, Tunisia",
  "Tabarka": "Tabarka, Tunisia",
  "Chenini": "Chenini, Tataouine, Tunisia",
  "Kundasang": "Kundasang, Sabah, Malaysia",
  "Sekinchan": "Sekinchan, Selangor, Malaysia",
  "Belum": "Belum, Perak, Malaysia",
  "Khanom": "Khanom, Nakhon Si Thammarat, Thailand",
  "Koh Yao Noi": "Koh Yao Noi, Thailand",
  "Nan": "Nan, Thailand",
  "Wae Rebo": "Wae Rebo, Flores, Indonesia",
  "Belitung": "Belitung, Indonesia",
  "Sumba": "Sumba, Indonesia",
  "Khinaliq": "Khinaliq, Azerbaijan",
  "Lahic": "Lahic, Azerbaijan",
  "Ismayilli": "Ismayilli, Azerbaijan",
  "Pérouges": "Pérouges, France",
  "Moustiers-Sainte-Marie": "Moustiers-Sainte-Marie, France",
  "Saint-Cirq-Lapopie": "Saint-Cirq-Lapopie, France",
};

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function geocode(destination) {
  const searchText =
    aliases[destination.name] ||
    `${destination.name}, ${destination.country}`;

  await throttle();

  const url =
    "https://nominatim.openstreetmap.org/search" +
    `?format=jsonv2&limit=1&accept-language=en&q=${encodeURIComponent(searchText)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Triply/1.0 portfolio project",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim HTTP ${response.status}`);
  }

  const results = await response.json();

  if (!results.length) {
    return null;
  }

  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
    displayName: results[0].display_name,
  };
}

async function main() {
  console.log("=== TRIPLY COORDINATES ===");
  console.log("Getting real map coordinates from OpenStreetMap/Nominatim.");
  console.log("Only destinations with NULL coordinates will be updated.");
  console.log("");

  const destinations = await query(`
    SELECT
      destinations.id,
      destinations.name,
      countries.name AS country,
      destinations.latitude,
      destinations.longitude
    FROM destinations
    JOIN countries
      ON destinations.country_id = countries.id
    ORDER BY destinations.id ASC
  `);

  let saved = 0;
  let skipped = 0;
  let notFound = 0;

  for (const destination of destinations) {
    if (
      destination.latitude !== null &&
      destination.longitude !== null
    ) {
      skipped++;
      console.log(
        `SKIP ${destination.id} ${destination.name} - coordinates already exist`
      );
      continue;
    }

    try {
      const result = await geocode(destination);

      if (!result) {
        notFound++;
        console.log(
          `NOT FOUND ${destination.id} ${destination.name}`
        );
        continue;
      }

      await query(
        `
          UPDATE destinations
          SET latitude = ?, longitude = ?
          WHERE id = ?
        `,
        [result.latitude, result.longitude, destination.id]
      );

      saved++;

      console.log(
        `SAVED ${destination.id} ${destination.name} -> ` +
        `${result.latitude}, ${result.longitude}`
      );
    } catch (error) {
      console.log(
        `ERROR ${destination.id} ${destination.name}: ${error.message}`
      );
    }
  }

  console.log("");
  console.log("======================================");
  console.log(`Coordinates saved: ${saved}`);
  console.log(`Already existed: ${skipped}`);
  console.log(`Not found: ${notFound}`);
  console.log("======================================");

  process.exit(0);
}

main().catch((error) => {
  console.error("FAILED:", error);
  process.exit(1);
});
