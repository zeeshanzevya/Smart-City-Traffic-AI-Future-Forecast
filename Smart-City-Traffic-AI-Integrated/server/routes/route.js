const express = require("express");

const router = express.Router();

const { findRoute } = require("../controllers/routeController");

router.get("/route", findRoute);

module.exports = router;