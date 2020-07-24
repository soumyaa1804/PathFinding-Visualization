"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greedyBFS = void 0;

var _utility = require("/src/utility.js");

var _script = require("./script.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  var endNode = specialNodes[1]; //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array

  var openList = new _utility.minHeap(); //Update the distances of startNode
  //Distance of startNode from startNode

  startNode.h = getDistance(startNode, endNode);
  startNode.f = startNode.h;
  openList.push([startNode.f, startNode]);

  while (!openList.isEmpty()) {
    var currNode = new _script.Node();
    var currArr = openList.getMin();
    currNode = currArr[1]; //Check if the endNode

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

    var _iterator = _createForOfIteratorHelper(neighboursIndex),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var indices = _step.value;
        var m = indices[0];
        var n = indices[1];

        var _neighbour = new _script.Node();

        _neighbour = _script.gridArray[m][n];
        neighbours.push(_neighbour);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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
  } //alert("No Path Exists");


  console.log(endNode);
  console.log("inside a*", pathFound);
  openList.clear();
  return pathFound;
};

exports.greedyBFS = greedyBFS;