"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = BFS;
exports.animateCells = animateCells;

var _utility = require("./utility.js");

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
};
function BFS(pathFound, nodesToAnimate) {
  var myQueue = new _utility.Queue();
  var specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  // console.log(startNode, endNode);
  myQueue.enqueue(_script.gridArray[startNode.row][startNode.col]);
  _script.gridArray[startNode.row][startNode.col].isVisited = true;
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new _script.Node();
  // console.log(myQueue.items.length);
  while (!myQueue.empty()) {
    currNode = myQueue.dequeue();
    // console.log(currNode);
    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([_script.gridArray[currNode.row][currNode.col], "visited"]);
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

async function animateCells(inProgress, nodesToAnimate) {
  inProgress = true;
  var specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  var cells = document.getElementsByTagName("td");
  var startNodeIndex = _script.gridArray[startNode.row] * _script.totalCols + _script.gridArray[startNode.col];
  var endNodeIndex = _script.gridArray[endNode.row] * _script.totalCols + _script.gridArray[endNode.col];

  for (var i = 0; i < nodesToAnimate.length; i++) {
    var nodeCoordinates = nodesToAnimate[i][0];
    var x = nodeCoordinates.row;
    var y = nodeCoordinates.col;
    var num = x * _script.totalCols + y;
    if (num == startNodeIndex || num == endNodeIndex) {
      continue;
    }
    var cell = cells[num];
    var colorClass = nodesToAnimate[i][1]; // success, visited or searching
    // Wait until its time to animate
    await new Promise(function (resolve) {
      return setTimeout(resolve, 5);
    });
    if (cell.className == "start" || cell.className == "end") {
      continue;
    } else cell.className = colorClass;
  }

  nodesToAnimate = [];
  inProgress = false;
  justFinished = true;

  return new Promise(function (resolve) {
    return resolve(true);
  });
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