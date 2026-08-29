const fs = require("fs");
const path = require("path");

const historyPath = path.join(__dirname, "traffic_history.json");
const history = JSON.parse(fs.readFileSync(historyPath, "utf8"));

const vehicleSpeed = {
    Car: 60,
    Bike: 45,
    Bus: 40
};

function normalizeFeatures(sample) {
    return [
        sample.hour / 23,
        sample.isWeekend,
        sample.distanceKm / 180,
        sample.trafficScore / 100,
        sample.vehicleSpeed / 60
    ];
}

function distance(a, b) {
    const x = normalizeFeatures(a);
    const y = normalizeFeatures(b);

    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        const delta = x[i] - y[i];
        sum += delta * delta;
    }

    return Math.sqrt(sum);
}

// K-nearest-neighbours regression: a small, dependency-free ML model.
function predictDelay({ hour, isWeekend, distanceKm, trafficScore, vehicle }) {
    const safeHour = Math.max(0, Math.min(23, Number(hour)));
    const safeWeekend = Number(isWeekend) ? 1 : 0;
    const safeDistance = Math.max(1, Number(distanceKm));
    const safeTrafficScore = Math.max(0, Math.min(100, Number(trafficScore)));
    const speed = vehicleSpeed[vehicle] || vehicleSpeed.Car;

    const input = {
        hour: safeHour,
        isWeekend: safeWeekend,
        distanceKm: safeDistance,
        trafficScore: safeTrafficScore,
        vehicleSpeed: speed
    };

    const neighbours = history
        .map(row => ({ row, distance: distance(row, input) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 9);

    let weightedDelay = 0;
    let totalWeight = 0;

    neighbours.forEach(({ row, distance: d }) => {
        const weight = 1 / (d + 0.01);
        weightedDelay += row.delayMinutes * weight;
        totalWeight += weight;
    });

    const predictedDelayMinutes = Math.max(
        0,
        Math.round(weightedDelay / totalWeight)
    );

    const baseMinutes = (safeDistance / speed) * 60;
    const delayRatio = baseMinutes > 0 ? predictedDelayMinutes / baseMinutes : 0;

    let predictedTraffic;
    if (delayRatio < 0.25) {
        predictedTraffic = "Low";
    } else if (delayRatio < 0.60) {
        predictedTraffic = "Medium";
    } else {
        predictedTraffic = "High";
    }

    return {
        model: "KNN Regression",
        predictedTraffic,
        predictedDelayMinutes,
        predictedTravelMinutes: Math.round(baseMinutes + predictedDelayMinutes),
        trainingSamples: history.length,
        input: {
            departureHour: safeHour,
            weekend: Boolean(safeWeekend)
        }
    };
}

module.exports = { predictDelay };
