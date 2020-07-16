"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = BFS;

var _utility = require("./utility.js");

var _script = require("./script.js");

function BFS(nodesToAnimate, pathFound) {
  //let pathFound = false;
  var myQueue = new _utility.Queue();
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  // console.log(startNode, endNode);
  myQueue.enqueue(startNode);
  startNode.isVisited = true;
  nodesToAnimate.push([startNode, "searching"]);
  //myQueue.enqueue(gridArray[startNode.row][startNode.col]);
  //gridArray[startNode.row][startNode.col].isVisited = true;
  //nodesToAnimate.push([gridArray[startNode.row][startNode.col], "searching"]);
  var currNode = new _script.Node();
  // console.log(myQueue.items.length);
  while (!myQueue.empty()) {
    currNode = myQueue.dequeue();
    // console.log(currNode);
    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([currNode, "visited"]);
    //nodesToAnimate.push([gridArray[r][c], "visited"]);
    if (currNode.status === endNode.status) {
      pathFound = true;
      break;
    }
    currNode.isVisited = true;
    // if (r == endNode.row && c == endNode.col) {
    //   pathFound = true;
    //   break;
    // }
    var neighbours = getNeighbours(r, c);
    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];
      var node = new _script.Node();
      node = _script.gridArray[m][n];
      if (node.isVisited || node.status === "wall") {
        continue;
      }
      // if (gridArray[m][n].isVisited || gridArray[m][n].status == "wall") {
      //   continue;
      // }
      //node.isVisited = true;
      node.parent = currNode;
      // gridArray[m][n].isVisited = true;
      // gridArray[m][n].parent = currNode;
      nodesToAnimate.push([node, "searching"]);
      //nodesToAnimate.push([gridArray[m][n], "searching"]);
      //myQueue.enqueue(gridArray[m][n]);
      myQueue.enqueue(node);
    }
  }

  if (pathFound) {
    // endNode.isVisited = true;
    // nodesToAnimate.push([endNode, "shortest"]);
    // //nodesToAnimate.push([gridArray[endNode.row][endNode.col], "shortest"]);
    // while (currNode.parent != null) {
    //   let prevNode = new Node();
    //   prevNode = currNode.parent;
    //   nodesToAnimate.push([currNode.parent, "shortest"]);
    // }
    nodesToAnimate.push([endNode, "shortest"]);
    var _currNode = new _script.Node();
    _currNode = endNode.parent;
    while (_currNode !== null) {
      nodesToAnimate.push([_currNode, "shortest"]);
      _currNode = _currNode.parent;
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