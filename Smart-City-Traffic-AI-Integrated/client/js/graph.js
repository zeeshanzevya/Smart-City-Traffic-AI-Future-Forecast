const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// Layout positions for the expanded demo city network.
const cities = {
    Patna: { x: 90, y: 105 },
    Vaishali: { x: 205, y: 190 },
    Hajipur: { x: 320, y: 80 },
    Ara: { x: 110, y: 280 },
    Gaya: { x: 270, y: 365 },
    Nalanda: { x: 430, y: 330 },
    Chhapra: { x: 475, y: 145 },
    Muzaffarpur: { x: 640, y: 95 },
    Samastipur: { x: 650, y: 245 },
    Darbhanga: { x: 820, y: 145 },
    Sitamarhi: { x: 1000, y: 80 },
    Begusarai: { x: 900, y: 325 },
    Motihari: { x: 1080, y: 270 }
};

const roads = [
    ["Patna", "Hajipur"],
    ["Patna", "Vaishali"],
    ["Vaishali", "Hajipur"],
    ["Patna", "Ara"],
    ["Patna", "Gaya"],
    ["Patna", "Samastipur"],
    ["Patna", "Nalanda"],
    ["Hajipur", "Muzaffarpur"],
    ["Hajipur", "Chhapra"],
    ["Hajipur", "Samastipur"],
    ["Ara", "Chhapra"],
    ["Ara", "Gaya"],
    ["Gaya", "Nalanda"],
    ["Chhapra", "Muzaffarpur"],
    ["Chhapra", "Motihari"],
    ["Muzaffarpur", "Samastipur"],
    ["Muzaffarpur", "Darbhanga"],
    ["Muzaffarpur", "Motihari"],
    ["Muzaffarpur", "Sitamarhi"],
    ["Samastipur", "Darbhanga"],
    ["Samastipur", "Begusarai"],
    ["Darbhanga", "Sitamarhi"],
    ["Darbhanga", "Begusarai"],
    ["Sitamarhi", "Motihari"],
    ["Motihari", "Begusarai"]
];

let highlightedPath = [];

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    roads.forEach(road => {
        const a = cities[road[0]];
        const b = cities[road[1]];

        const isHighlighted = highlightedPath.some((_, i) => {
            if (i === highlightedPath.length - 1) return false;

            return (
                (highlightedPath[i] === road[0] && highlightedPath[i + 1] === road[1]) ||
                (highlightedPath[i] === road[1] && highlightedPath[i + 1] === road[0])
            );
        });

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = isHighlighted ? 6 : 3;
        ctx.strokeStyle = isHighlighted ? "#28a745" : "#888";
        ctx.stroke();
    });

    for (const city in cities) {
        const c = cities[city];

        ctx.beginPath();
        ctx.arc(c.x, c.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = highlightedPath.includes(city) ? "#22c55e" : "#2563eb";
        ctx.shadowColor = "rgba(37,99,235,.35)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 13px Poppins";
        const labelOffset = city.length > 9 ? 34 : 28;
        ctx.fillText(city, c.x - labelOffset, c.y + 38);
    }
}

drawGraph();
