/**
 * Find simple (cycle-free) routes between two cities.
 * The project currently contains a small city graph, so enumerating
 * simple paths is practical and lets us compare routes by travel time.
 */
function findAllSimplePaths(graph, start, end) {
    const routes = [];
    const visited = new Set();
    const maxDepth = Object.keys(graph.adjacencyList).length;

    if (!graph.adjacencyList[start] || !graph.adjacencyList[end]) {
        return routes;
    }

    function dfs(city, path, edges, distance) {
        if (city === end) {
            routes.push({
                path: [...path],
                edges: [...edges],
                distance
            });
            return;
        }

        if (path.length >= maxDepth) {
            return;
        }

        const neighbors = graph.adjacencyList[city] || [];

        for (const neighbor of neighbors) {
            if (visited.has(neighbor.node)) {
                continue;
            }

            visited.add(neighbor.node);
            path.push(neighbor.node);
            edges.push({
                from: city,
                to: neighbor.node,
                distance: neighbor.weight,
                traffic: neighbor.traffic || "Medium"
            });

            dfs(
                neighbor.node,
                path,
                edges,
                distance + neighbor.weight
            );

            edges.pop();
            path.pop();
            visited.delete(neighbor.node);
        }
    }

    visited.add(start);
    dfs(start, [start], [], 0);

    return routes;
}

module.exports = findAllSimplePaths;
