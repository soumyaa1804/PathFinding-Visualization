"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = BFS;

var _utility = require("./utility.js");

var _script = require("./script.js");

function BFS(nodesToAnimate, pathFound) {
  var myQueue = new _utility.Queue();
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1]; // console.log(startNode, endNode);

  myQueue.enqueue(_script.gridArray[startNode.row][startNode.col]);
  _script.gridArray[startNode.row][startNode.col].isVisited = true;
  nodesToAnimate.push([_script.gridArray[startNode.row][startNode.col], "searching"]);
  var currNode = new _script.Node(); // console.log(myQueue.items.length);

  while (!myQueue.empty()) {
    currNode = myQueue.dequeue(); // console.log(currNode);

    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([_script.gridArray[r][c], "visited"]);

    if (r == endNode.row && c == endNode.col) {
      pathFound = true;
      break;
    }

    var neighbours = getNeighbours(r, c);

    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];

      if (_script.gridArray[m][n].isVisited || _script.gridArray[m][n].status == "wall") {
        continue;
      }

      _script.gridArray[m][n].isVisited = true;
      _script.gridArray[m][n].parent = currNode;
      nodesToAnimate.push([_script.gridArray[m][n], "searching"]);
      myQueue.enqueue(_script.gridArray[m][n]);
    }
  }

  if (pathFound) {
    nodesToAnimate.push([_script.gridArray[endNode.row][endNode.col], "shortest"]);

    while (currNode.parent != null) {
      var prevNode = currNode.parent;
      nodesToAnimate.push([_script.gridArray[prevNode.row][prevNode.col], "shortest"]);
      currNode = prevNode;
    }
  }

  return pathFound;
}

function getNeighbours(i, j) {
  var neighbors = [];

  if (i > 0) {
    neighbors.push([i - 1, j]);
  }

  if (j > 0) {
    neighbors.push([i, j - 1]);
  }

  if (i < _script.totalRows - 1) {
    neighbors.push([i + 1, j]);
  }

  if (j < _script.totalCols - 1) {
    neighbors.push([i, j + 1]);
  }

  return neighbors;
}