const express = require("express");

const router = express.Router();

const { getNearbyPlaces } = require("../controllers/placeController");

router.get("/places", getNearbyPlaces);

module.exports = router;