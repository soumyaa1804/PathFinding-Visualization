"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greedyBFS = undefined;

var _utility = require("/src/utility.js");

var _script = require("./script.js");

/**
 * Greedy Best-First Search
 * 
 * An informed searching algorithm
 * Complete: Greedy best-first search is incomplete, even if the given state space is finite.
 * Optimal: Greedy best first search algorithm is not optimal.
 */

function updateNeighbours(currNode, neighbours, endNode) {
  neighbours.forEach(function (neighbour) {
    neighbour.h = neighbour.weight + getDistance(neighbour, endNode);
    var newf = neighbour.h;
    if (newf < neighbour.f) neighbour.f = newf;
    neighbour.parent = currNode;
  });
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

/**
 * Heuristic Function
 * f(n) = h(n)
 * If 'allow diagonals' is false, use Manhattan Distance
 * else use Diagonal Distance
 * reference: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#heuristics-for-grid-maps
 */
function getDistance(nodeA, nodeB) {
  var diagonal = document.getElementById("diagonal-flag").checked;
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (diagonal === false) {
    //Manhattan Distance
    return dx + dy;
  } else {
    // Diagonal Distance
    if (dx > dy) {
      return 1.4 * dy + 1 * (dx - dy);
    }
    return 1.4 * dx + 1 * (dy - dx);
  }
}

var greedyBFS = function greedyBFS(nodesToAnimate, pathFound) {
  //Get the startNode and the endNode
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];

  //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array
  var openList = new _utility.minHeap();
  //Update the distances of startNode
  //Distance of startNode from startNode

  startNode.h = getDistance(startNode, endNode);

  startNode.f = startNode.h;

  openList.push([startNode.f, startNode]);

  while (!openList.isEmpty()) {
    var currNode = new _script.Node();
    var currArr = openList.getMin();
    currNode = currArr[1];

    //Check if the endNode
    if (currNode.status == endNode.status) {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      break;
    }
    if (currNode.isVisited) {
      console.log(74, currNode.isVisited);
      continue;
    }
    currNode.isVisited = true;
    nodesToAnimate.push([currNode, "visited"]);

    var neighboursIndex = (0, _utility.getNeighbours)(currNode.row, currNode.col);
    var neighbours = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = neighboursIndex[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var indices = _step.value;

        var m = indices[0];
        var n = indices[1];
        var _neighbour = new _script.Node();
        _neighbour = _script.gridArray[m][n];
        neighbours.push(_neighbour);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    updateNeighbours(currNode, neighbours, endNode);
    console.log("astar neigh", neighbours);
    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      nodesToAnimate.push([neighbour, "searching"]);
      openList.push([neighbour.f, neighbour]);
    }
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
  //alert("No Path Exists");
  console.log(endNode);
  console.log("inside a*", pathFound);
  openList.clear();
  return pathFound;
};
exports.greedyBFS = greedyBFS;