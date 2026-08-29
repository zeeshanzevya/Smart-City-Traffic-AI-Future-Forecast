class Graph {

    constructor() {
        this.adjacencyList = {};
    }

    addCity(city) {

        if (!this.adjacencyList[city]) {

            this.adjacencyList[city] = [];

        }

    }

    addRoad(city1, city2, distance, traffic) {

        this.addCity(city1);
        this.addCity(city2);

        this.adjacencyList[city1].push({

            node: city2,
            weight: distance,
            traffic: traffic

        });

        this.adjacencyList[city2].push({

            node: city1,
            weight: distance,
            traffic: traffic

        });

    }

}

module.exports = Graph;