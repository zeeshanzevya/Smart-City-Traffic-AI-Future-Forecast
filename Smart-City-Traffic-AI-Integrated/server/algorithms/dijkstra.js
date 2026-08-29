const PriorityQueue = require("./priorityQueue");

function dijkstra(graph, start, end) {

    const distances = {};
    const previous = {};
    const previousEdge = {};
    const pq = new PriorityQueue();

    for (let city in graph.adjacencyList) {

        if (city === start) {

            distances[city] = 0;

            pq.enqueue(city, 0);

        }

        else {

            distances[city] = Infinity;

            pq.enqueue(city, Infinity);

        }

        previous[city] = null;
        previousEdge[city] = null;

    }

    while (pq.values.length) {

        const item = pq.dequeue();
        if (!item) break;

        const smallest = item.node;

        if (smallest === end) {

            const path = [];
            const edges = [];

            let current = end;

            while (current) {

                path.push(current);

                if (previousEdge[current]) {
                    edges.push(previousEdge[current]);
                }

                current = previous[current];

            }

            return {
                path: path.reverse(),
                distance: distances[end],
                edges: edges.reverse()
            };

        }

        for (let neighbor of graph.adjacencyList[smallest]) {

            let candidate = distances[smallest] + neighbor.weight;

            if (candidate < distances[neighbor.node]) {

                distances[neighbor.node] = candidate;

                previous[neighbor.node] = smallest;
                previousEdge[neighbor.node] = {
                    from: smallest,
                    to: neighbor.node,
                    distance: neighbor.weight,
                    traffic: neighbor.traffic || "Medium"
                };

                pq.enqueue(neighbor.node, candidate);

            }

        }

    }

}

module.exports = dijkstra;
