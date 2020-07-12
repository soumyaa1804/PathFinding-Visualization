"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dijkstra = undefined;

var _script = require("./script.js");

var getSpecialNodes = function getSpecialNodes() {
  var copy_end = null,
      copy_start = null;
  for (var r = 0; r < _script.totalRows; r++) {
    for (var c = 0; c < _script.totalCols; c++) {
      if (_script.gridArray[r][c].status === "start" && _script.gridArray[r][c].isClass === "start") {
        copy_start = _script.gridArray[r][c];
      } else if (_script.gridArray[r][c].status === "end" && _script.gridArray[r][c].isClass === "end") {
        copy_end = _script.gridArray[r][c];
      }
    }
  }
  var valid_buttons = [copy_start, copy_end];
  return valid_buttons;
}; //Invoked when start visualizing is 'CLICKED'
//Get the start and end node

function dijkstra(nodesToAnimate) {
  var specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  var visitedNodesInOrder = [startNode];
  //Assign distance as 0 for startNode
  startNode.distance = 0;
  var currNode = new _script.Node();
  currNode = startNode;
  //Get the unvisited nodes
  var unvisitedNodes = getUnvisitedNodes();
  while (unvisitedNodes.length) {
    //Get the neighbours
    var neighbours = getNeighbours(currNode);
    updateNeighbours(neighbours, currNode, "dijkstra");
    unvisitedNodes.sort(function (a, b) {
      return a.distance - b.distance;
    });
    // if (unvisitedNodes[0].distance === 1) {
    //   unvisitedNodes[0].parent = startNode;
    // }
    var closestNode = unvisitedNodes.shift();
    //Check if distnace is infintiy---no path exists
    if (closestNode.distance === Infinity) {
      break;
    }
    visitedNodesInOrder.push(closestNode);
    //Update the status of the closest node as visited
    if (closestNode.status === "end") {
      backtrack(startNode, endNode, nodesToAnimate);
      break;
    }
    closestNode.status = "visited";
    //closestNode.isClass = "visited";
    var element = document.getElementById(closestNode.id);
    element.className = "visited";
    //Check if the end point
    unvisitedNodes = getUnvisitedNodes();
    currNode = closestNode;
  }
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
function getNeighbours(currNode) {
  var r = currNode.row;
  var c = currNode.col;
  var relevantStatuses = ["start", "wall", "visited"];
  var actual_neighbours = [];
  var neighbours = [];
  if (r - 1 >= 0) {
    neighbours.push(_script.gridArray[r - 1][c]);
    if (c - 1 >= 0) {
      neighbours.push(_script.gridArray[r - 1][c - 1]);
    }
    if (c + 1 <= _script.totalCols - 1) {
      neighbours.push(_script.gridArray[r - 1][c + 1]);
    }
  }
  if (r + 1 <= _script.totalRows - 1) {
    neighbours.push(_script.gridArray[r + 1][c]);
    if (c - 1 >= 0) {
      neighbours.push(_script.gridArray[r + 1][c - 1], _script.gridArray[r][c - 1]);
    }
    if (c + 1 <= _script.totalCols - 1) {
      neighbours.push(_script.gridArray[r + 1][c + 1], _script.gridArray[r][c + 1]);
    }
  }
  neighbours.forEach(function (neighbour) {
    if (!relevantStatuses.includes(neighbour.status)) {
      actual_neighbours.push(neighbour);
    }
  });
  return actual_neighbours;
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
function backtrack(startNode, endNode, nodesToAnimate) {
  nodesToAnimate.push(endNode);
  var currNode = new _script.Node();
  currNode = endNode.parent;
  while (currNode !== startNode) {
    nodesToAnimate.push(currNode);
    currNode.status = "shortest";
    var element = document.getElementById(currNode.id);
    element.className = "shortest";
    currNode = currNode.parent;
  }
  nodesToAnimate.push(startNode);
  nodesToAnimate.reverse();
  return nodesToAnimate;
}
exports.dijkstra = dijkstra;