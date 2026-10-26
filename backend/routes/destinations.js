const express = require("express");

const {
  getAllDestinations,
  getDestinationById,
  getDestinationImage,
  getDestinationHotels,
  getDestinationActivities,
  fetchAndSaveDestinationImages,
} = require("../controllers/destinationController");

const router = express.Router();

// IMPORTANT:
// Specific routes must come before /:id
// so Express does not treat "fetch-images",
// "image", "hotels", or "activities" as an ID.

router.get("/", getAllDestinations);
router.get("/fetch-images", fetchAndSaveDestinationImages);
router.get("/:id/image", getDestinationImage);
router.get("/:id/hotels", getDestinationHotels);
router.get("/:id/activities", getDestinationActivities);
router.get("/:id", getDestinationById);

module.exports = router;
