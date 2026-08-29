const bfsPlaces = require("../algorithms/bfs");
const places = require("../data/places");

const getNearbyPlaces = (req, res) => {

    const { city } = req.query;

    const result = bfsPlaces(city, places);

    res.json(result);

};

module.exports = { getNearbyPlaces };