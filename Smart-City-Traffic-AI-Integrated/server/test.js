const Graph = require("./algorithms/graph");
const dijkstra = require("./algorithms/dijkstra");

const graph = new Graph();

graph.addRoad("Patna","Hajipur",20);
graph.addRoad("Hajipur","Muzaffarpur",52);
graph.addRoad("Patna","Samastipur",85);
graph.addRoad("Samastipur","Muzaffarpur",40);
graph.addRoad("Muzaffarpur","Motihari",60);

const result = dijkstra(graph,"Patna","Motihari");

console.log(result);