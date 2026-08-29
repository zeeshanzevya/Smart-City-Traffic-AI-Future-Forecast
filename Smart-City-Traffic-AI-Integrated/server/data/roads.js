// City-to-city demo road network used by the routing algorithms.
// Distances are approximate demo weights (in KM), not live road distances.
const roads = [
    { from: "Patna", to: "Hajipur", distance: 20, traffic: "High" },
    { from: "Patna", to: "Vaishali", distance: 15, traffic: "Low" },
    { from: "Vaishali", to: "Hajipur", distance: 12, traffic: "Low" },
    { from: "Patna", to: "Ara", distance: 65, traffic: "Low" },
    { from: "Patna", to: "Gaya", distance: 100, traffic: "Medium" },
    { from: "Patna", to: "Samastipur", distance: 75, traffic: "Low" },
    { from: "Patna", to: "Nalanda", distance: 95, traffic: "Low" },

    { from: "Hajipur", to: "Muzaffarpur", distance: 52, traffic: "High" },
    { from: "Hajipur", to: "Chhapra", distance: 55, traffic: "Low" },
    { from: "Hajipur", to: "Samastipur", distance: 70, traffic: "Medium" },

    { from: "Ara", to: "Chhapra", distance: 115, traffic: "Medium" },
    { from: "Ara", to: "Gaya", distance: 85, traffic: "Low" },

    { from: "Gaya", to: "Nalanda", distance: 90, traffic: "Medium" },


    { from: "Chhapra", to: "Muzaffarpur", distance: 75, traffic: "High" },
    { from: "Chhapra", to: "Motihari", distance: 120, traffic: "Low" },

    { from: "Muzaffarpur", to: "Samastipur", distance: 40, traffic: "Low" },
    { from: "Muzaffarpur", to: "Darbhanga", distance: 70, traffic: "High" },
    { from: "Muzaffarpur", to: "Motihari", distance: 60, traffic: "Medium" },
    { from: "Muzaffarpur", to: "Sitamarhi", distance: 65, traffic: "Low" },

    { from: "Samastipur", to: "Darbhanga", distance: 40, traffic: "Medium" },
    { from: "Samastipur", to: "Begusarai", distance: 65, traffic: "Low" },

    { from: "Darbhanga", to: "Sitamarhi", distance: 55, traffic: "Low" },
    { from: "Darbhanga", to: "Begusarai", distance: 85, traffic: "Medium" },

    { from: "Sitamarhi", to: "Motihari", distance: 110, traffic: "Medium" },

    { from: "Motihari", to: "Begusarai", distance: 160, traffic: "High" }
];

module.exports = roads;
