const express = require("express");
const { fetchAndSaveHotelImages } = require("../controllers/hotelController");

const router = express.Router();

router.get("/fetch-images", fetchAndSaveHotelImages);

module.exports = router;
