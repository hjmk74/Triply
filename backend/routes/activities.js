const express = require("express");
const {
  fetchAndSaveActivityImages,
} = require("../controllers/activityController");

const router = express.Router();

router.get("/fetch-images", fetchAndSaveActivityImages);

module.exports = router;
