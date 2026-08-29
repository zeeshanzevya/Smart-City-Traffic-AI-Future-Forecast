const trafficMultiplier = {
    Low: 1,
    Medium: 1.3,
    High: 2.0
};

const trafficScoreMap = {
    Low: 25,
    Medium: 60,
    High: 85
};

const vehicleSpeed = {
    Car: 60,
    Bike: 45,
    Bus: 40
};

function getRouteTraffic(edges = []) {
    if (!edges.length) {
        return {
            traffic: "Low",
            trafficScore: 25,
            trafficDelay: 0
        };
    }

    const totalDistance = edges.reduce((sum, edge) => sum + edge.distance, 0);

    const weightedScore = edges.reduce((sum, edge) => {
        const score = trafficScoreMap[edge.traffic] || trafficScoreMap.Medium;
        return sum + (score * edge.distance);
    }, 0) / totalDistance;

    const trafficScore = Math.round(weightedScore);

    let traffic;
    if (trafficScore < 45) {
        traffic = "Low";
    } else if (trafficScore < 73) {
        traffic = "Medium";
    } else {
        traffic = "High";
    }

    return {
        traffic,
        trafficScore,
        trafficDelay: 0
    };
}

function calculateRoute(result, vehicle = "Car") {
    const edges = result.edges || [];
    const trafficData = getRouteTraffic(edges);
    const speed = vehicleSpeed[vehicle] || 60;

    // Calculate travel time edge-by-edge so route comparison really
    // reflects the traffic on each road, instead of applying one traffic
    // multiplier to the whole route.
    let baseTimeInHours = 0;
    let timeInHours = 0;

    edges.forEach((edge) => {
        const distance = Number(edge.distance) || 0;
        const multiplier = trafficMultiplier[edge.traffic] || trafficMultiplier.Medium;

        baseTimeInHours += distance / speed;
        timeInHours += (distance / speed) * multiplier;
    });

    // Fallback for a route result without edge details.
    if (!edges.length) {
        const multiplier = trafficMultiplier[trafficData.traffic] || 1;
        baseTimeInHours = result.distance / speed;
        timeInHours = baseTimeInHours * multiplier;
    }

    const trafficDelay = Math.max(
        0,
        Math.round((timeInHours - baseTimeInHours) * 60)
    );

    let estimatedTime;

    if (timeInHours < 1) {
        estimatedTime = `${Math.round(timeInHours * 60)} Minutes`;
    } else {
        const totalMinutes = Math.round(timeInHours * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const hourText = hours === 1 ? "Hour" : "Hours";

        if (minutes === 0) {
            estimatedTime = `${hours} ${hourText}`;
        } else {
            estimatedTime = `${hours} ${hourText} ${minutes} Min`;
        }
    }

    const fuelCost = (result.distance * 5).toFixed(0);

    return {
        ...result,
        traffic: trafficData.traffic,
        trafficScore: trafficData.trafficScore,
        trafficDelay,
        estimatedTime,
        estimatedMinutes: Math.round(timeInHours * 60),
        fuelCost
    };
}

module.exports = calculateRoute;
