const Graph = require("../algorithms/graph");
const dijkstra = require("../algorithms/dijkstra");
const findAllSimplePaths = require("../algorithms/routeOptions");
const roads = require("../data/roads");
const calculateRoute = require("../services/routeService");
const { predictDelay } = require("../ai/trafficPredictor");

const graph = new Graph();

roads.forEach((road) => {
    graph.addRoad(
        road.from,
        road.to,
        road.distance,
        road.traffic
    );
});

const samePath = (a = [], b = []) =>
    a.length === b.length && a.every((city, index) => city === b[index]);

const findRoute = (req, res) => {
    const {
        source,
        destination,
        vehicle = "Car",
        departureHour = "8",
        isWeekend = "0"
    } = req.query;

    if (!source || !destination) {
        return res.status(400).json({
            message: "Source and Destination are required"
        });
    }

    const shortestResult = dijkstra(graph, source, destination);

    if (!shortestResult) {
        return res.status(404).json({
            message: "Route not found"
        });
    }

    const shortestRoute = calculateRoute(shortestResult, vehicle);

    // AI forecasts the traffic/delay 30 minutes after the selected departure time.
    // The current/static route traffic remains separate from this future forecast.
    const forecastHour = (Number(departureHour) + 0.5) % 24;

    const aiPrediction = predictDelay({
        hour: forecastHour,
        isWeekend,
        distanceKm: shortestRoute.distance,
        trafficScore: shortestRoute.trafficScore,
        vehicle
    });

    aiPrediction.forecastOffsetMinutes = 30;

    // Compare every available simple route using the same traffic-aware
    // travel-time calculation used by the main Route Summary.
    const allRoutes = findAllSimplePaths(graph, source, destination);
    const evaluatedRoutes = allRoutes
        .map((route) => calculateRoute(route, vehicle))
        .sort((a, b) => {
            if (a.estimatedMinutes !== b.estimatedMinutes) {
                return a.estimatedMinutes - b.estimatedMinutes;
            }
            return a.distance - b.distance;
        });

    // Only recommend an alternative when it is genuinely longer than the
    // shortest-distance route AND has a lower traffic level. This keeps the
    // recommendation aligned with the project's intended behavior: take the
    // longer road only when the traffic is meaningfully better.
    const trafficRank = {
        Low: 1,
        Medium: 2,
        High: 3
    };

    // Business rule for alternatives:
    // 1) If the original/shortest route has Low traffic, NEVER show an alternative.
    // 2) If the original route has Medium or High traffic, an alternative must:
    //    - be longer than the shortest-distance route,
    //    - have strictly lower traffic, and
    //    - actually take less time after traffic is considered.
    // This prevents recommending a longer low-traffic route when it would still be slower.
    const qualifyingAlternatives = shortestRoute.traffic === "Low"
        ? []
        : evaluatedRoutes
        .filter((route) => !samePath(route.path, shortestRoute.path))
        .filter((route) => route.distance > shortestRoute.distance)
        .filter((route) => (trafficRank[route.traffic] || 99) < (trafficRank[shortestRoute.traffic] || 99))
        .filter((route) => route.estimatedMinutes < shortestRoute.estimatedMinutes)
        .sort((a, b) => {
            if (a.estimatedMinutes !== b.estimatedMinutes) {
                return a.estimatedMinutes - b.estimatedMinutes;
            }
            return a.distance - b.distance;
        });

    const recommendedAlternative = qualifyingAlternatives[0] || null;
    const isAlternativeRecommended = Boolean(recommendedAlternative);
    const recommendedRoute = recommendedAlternative || shortestRoute;

    const timeDifference = recommendedAlternative
        ? recommendedAlternative.estimatedMinutes - shortestRoute.estimatedMinutes
        : 0;

    const alternativeRoutes = isAlternativeRecommended
        ? qualifyingAlternatives.slice(0, 2).map((route) => ({
            path: route.path,
            distance: route.distance,
            traffic: route.traffic,
            trafficScore: route.trafficScore,
            trafficDelay: route.trafficDelay,
            estimatedTime: route.estimatedTime,
            estimatedMinutes: route.estimatedMinutes,
            fuelCost: route.fuelCost
        }))
        : [];

    return res.json({
        // Keep the original shortest-distance route as the main Route Summary.
        // The lower-traffic alternative is shown separately when it qualifies.
        ...shortestRoute,
        shortestRoute,
        recommendedRoute,
        alternativeRoutes,
        isAlternativeRecommended,
        aiPrediction,
        timeDifference,
        recommendation: isAlternativeRecommended
            ? `A longer route with lower traffic and a faster ETA is available. The recommended alternative is ${recommendedRoute.path.join(" ➜ ")}.`
            : (shortestRoute.traffic === "Low"
                ? "No alternative shown because the shortest route already has Low traffic."
                : "No alternative route meets the rule: it must be longer, have lower traffic, and still take less time than the original route.")
    });
};

module.exports = { findRoute };
