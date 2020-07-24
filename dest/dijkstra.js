"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dijkstra = undefined;

var _script = require("./script.js");

var _utility = require("./utility.js");

/**
 * @description Dijkstra Algorithm
 * 
 * @param {Array} nodesToAnimate array of type [node, "status"] 
 * @param {boolean} pathFound false in the beginning.
 * @returns true if path found or else return false.
 */
/**
 * Dijkstra Algorithm
 * Weighted search algorithm.
 * Invoked when Start Dijkstra is 'CLICKED'
 */

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

  var _loop = function _loop() {
    //Get the neighbours
    //nodesToAnimate.push([currNode, "visited"]);
    neighboursIndex = (0, _utility.getNeighbours)(currNode.row, currNode.col);

    var neighbours = [];
    neighboursIndex.forEach(function (indices) {
      var m = indices[0];
      var n = indices[1];
      var neighbour = new _script.Node();
      neighbour = _script.gridArray[m][n];
      neighbours.push(neighbour);
    });
    updateNeighbours(neighbours, currNode, "dijkstra");
    unvisitedNodes.sort(function (a, b) {
      return a.distance - b.distance;
    });
    var closestNode = unvisitedNodes.shift();
    //Check if distnace is infintiy---no path exists
    if (closestNode.distance === Infinity) {
      pathFound = false;
      return "break";
    }
    nodesToAnimate.push([closestNode, "searching"]);
    //Update the status of the closest node as visited
    if (closestNode.status === "end") {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      return "break";
    }
    nodesToAnimate.push([closestNode, "visited"]);
    closestNode.status = "visited";
    unvisitedNodes = getUnvisitedNodes();
    currNode = closestNode;
  };

  while (unvisitedNodes.length) {
    var neighboursIndex;

    var _ret = _loop();

    if (_ret === "break") break;
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
/**
 * @description update neighbour's distance
 * 
 * @param {Array} neighbours array of neighbouring nodes
 * @param {Node} currNode parent node of neighbours
 * @param {string} algo algorithm's HTML id
 */
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