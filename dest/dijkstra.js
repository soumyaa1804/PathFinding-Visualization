"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dijkstra = undefined;

var _script = require("./script.js");

var _utility = require("./utility.js");

//Invoked when Start Dijkstra is 'CLICKED'
//Get the start and end node

function dijkstra(nodesToAnimate, pathFound) {
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  //Assign distance as 0 for startNode
  startNode.distance = 0;
  var currNode = new _script.Node();
  currNode = startNode;
  nodesToAnimate.push([startNode, "searching"]);
  startNode.isVisited = true;
  //Get the unvisited nodes
  var unvisitedNodes = getUnvisitedNodes();
  while (unvisitedNodes.length) {
    //Get the neighbours
    //nodesToAnimate.push([currNode, "visited"]);
    var neighbours = (0, _utility.getNeighbours)(currNode);
    updateNeighbours(neighbours, currNode, "dijkstra");
    unvisitedNodes.sort(function (a, b) {
      return a.distance - b.distance;
    });
    var closestNode = unvisitedNodes.shift();
    //Check if distnace is infintiy---no path exists
    if (closestNode.distance === Infinity) {
      pathFound = false;
      break;
    }
    nodesToAnimate.push([closestNode, "searching"]);
    //Update the status of the closest node as visited
    if (closestNode.status === "end") {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      break;
    }
    nodesToAnimate.push([closestNode, "visited"]);
    closestNode.status = "visited";
    unvisitedNodes = getUnvisitedNodes();
    currNode = closestNode;
  }
  return pathFound;
}

function getUnvisitedNodes() {
  var nodes = [];
  var relevantStatuses = ["start", "wall", "visited"];
  for (var i = 0; i < _script.totalRows; i++) {
    for (var j = 0; j < _script.totalCols; j++) {
      if (!relevantStatuses.includes(_script.gridArray[i][j].status)) {
        nodes.push(_script.gridArray[i][j]);
      }
    }
  }
  return nodes;
}
function updateNeighbours(neighbours, currNode, algo) {
  var row = currNode.row;
  var col = currNode.col;
  var DiagonalId = [row - 1 + "-" + (col - 1), row - 1 + "-" + (col + 1), row + 1 + "-" + (col - 1), row + 1 + "-" + (col + 1)];
  if (algo === "dijkstra") {
    neighbours.forEach(function (neighbour) {
      if (!DiagonalId.includes(neighbour.id)) {
        if (1 + neighbour.weight + currNode.distance < neighbour.distance) {
          neighbour.distance = 1 + neighbour.weight + currNode.distance;
          neighbour.parent = currNode;
        }
      } else {
        if (1.4 + neighbour.weight + currNode.distance < neighbour.distance) {
          neighbour.distance = 1.4 + neighbour.weight + currNode.distance;
          neighbour.parent = currNode;
        }
      }
    });
  } else if (algo === "aStar") {
    neighbours.forEach(function (neighbour) {
      var newGCost = 10 + currNode.g;
      // if (newGCost < neighbour.g) {
      //   neighbour.g = newGCost;
      //   neighbour.parent = currNode;
      // }
      var estimation_cost = getDistance(neighbour, endNode);
      var newCost = newGCost + estimation_cost;
      if (newCost < neighbour.f) {
        neighbour.g = newGCost;
        neighbour.f = newCost;
        neighbour.h = estimation_cost;
        neighbour.parent = currNode;
      }
    });
  }
}
function backtrack(endNode, nodesToAnimate) {
  nodesToAnimate.push([endNode, "shortest"]);
  var currNode = new _script.Node();
  currNode = endNode.parent;
  while (currNode !== null) {
    nodesToAnimate.push([currNode, "shortest"]);
    currNode = currNode.parent;
  }
}
exports.dijkstra = dijkstra;