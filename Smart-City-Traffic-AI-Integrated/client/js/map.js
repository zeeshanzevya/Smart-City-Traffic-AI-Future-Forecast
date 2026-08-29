let map = L.map('map').setView([25.9, 85.3], 7.5);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap contributors'
    }
).addTo(map);

const cityCoordinates = {
    Patna: [25.5941, 85.1376],
    Vaishali: [25.9782, 85.1268],
    Hajipur: [25.6850, 85.2090],
    Ara: [25.5560, 84.6633],
    Gaya: [24.7914, 85.0002],
    Nalanda: [25.1357, 85.4437],
    Chhapra: [25.7806, 84.7274],
    Muzaffarpur: [26.1225, 85.3906],
    Samastipur: [25.8629, 85.7810],
    Darbhanga: [26.1542, 85.8918],
    Sitamarhi: [26.5885, 85.5016],
    Motihari: [26.6496, 84.9166],
    Begusarai: [25.4182, 86.1272]
};

let routeLine = null;

Object.keys(cityCoordinates).forEach(city => {
    L.marker(cityCoordinates[city])
        .addTo(map)
        .bindPopup(city);
});

function drawRouteOnMap(path) {
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    const coordinates = path
        .map(city => cityCoordinates[city])
        .filter(Boolean);

    if (coordinates.length < 2) return;

    routeLine = L.polyline(coordinates, {
        color: "#22c55e",
        weight: 6,
        opacity: 0.9
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), {
        padding: [50, 50]
    });
}
