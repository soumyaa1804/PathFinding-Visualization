"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aStar = undefined;

var _utility = require("/src/utility.js");

var _script = require("./script.js");

//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
/**
 * A* searching algorithm
 * 
 * Complete: A* algorithm is complete as long as branching factor (branches from 1 node) 
 * is finite and cost at every action is fixed.
 * Optimal: A* search algorithm is optimal if it follows below two conditions: Admissibility and consistency.
 * 
 * reference: https://www.javatpoint.com/ai-informed-search-algorithms
 */

function updateNeighbours(neighbours, currNode, algo, endNode) {
  if (algo === "aStar") {
    neighbours.forEach(function (neighbour) {
      var newGCost = currNode.g + neighbour.weight;

      //Whenever weights are involved f(n) = g(n) + W*h(n)
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
//Astar Algorithm
function getDistance(nodeA, nodeB) {
  var diagonal = document.getElementById("diagonal-flag").checked;
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (diagonal === false) {
    //Manhattan Distance
    return dx + dy;
  } else {
    if (dx > dy) {
      //Better results than using sqrt(2) and 1
      return 1.4 * dy + 1 * (dx - dy);
    }
    return 1.4 * dx + 1 * (dy - dx);
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
var aStar = function aStar(nodesToAnimate, pathFound) {
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];

  var openList = new _utility.minHeap();
  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode);
  startNode.f = startNode.g + startNode.h;

  openList.push([startNode.f, startNode]);

  var _loop = function _loop() {
    currNode = new _script.Node();

    var currArr = openList.getMin();
    currNode = currArr[1];

    if (currNode.status == endNode.status) {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      return "break";
    }
    if (currNode.isVisited) {
      return "continue";
    }
    currNode.isVisited = true;
    nodesToAnimate.push([currNode, "visited"]);

    neighboursIndex = (0, _utility.getNeighbours)(currNode.row, currNode.col);

    var neighbours = [];
    neighboursIndex.forEach(function (indices) {
      var m = indices[0];
      var n = indices[1];
      var neighbour = new _script.Node();
      neighbour = _script.gridArray[m][n];
      neighbours.push(neighbour);
    });
    updateNeighbours(neighbours, currNode, "aStar", endNode);
    console.log("astar neigh", neighbours);
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      nodesToAnimate.push([neighbour, "searching"]);
      openList.push([neighbour.f, neighbour]);
    }
  };

  _loop2: while (!openList.isEmpty()) {
    var currNode;
    var neighboursIndex;

    var _ret = _loop();

    switch (_ret) {
      case "break":
        break _loop2;

      case "continue":
        continue;}
  }

  while (!openList.isEmpty()) {
    var cell = new _script.Node();
    var arr = openList.getMin();
    cell = arr[1];
    if (cell.isVisited) {
      continue;
    }
    cell.isVisited = true;
    nodesToAnimate.push([cell, "visited"]);
  }
  openList.clear();
  return pathFound;
};
exports.aStar = aStar;