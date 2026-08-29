const cities = require("../data/cities");

const getCities = (req, res) => {
    res.json(cities);
};

module.exports = { getCities };