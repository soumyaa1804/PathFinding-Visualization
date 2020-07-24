"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = BFS;

var _utility = require("./utility.js");

var _script = require("./script.js");

/**
 * @description BFS Algorithm
 * 
 * @param {Array} nodesToAnimate array of type [node, "status"] 
 * @param {boolean} pathFound false in the beginning.
 * @returns true if path found or else return false.
 */
/**
 * Breadth-First Search
 * 
 * An uninformed search algorithm.
 * Completeness: BFS is complete, meaning for a given search tree, BFS will come up with a solution if it exists.
 * Optimality: BFS is optimal as long as the costs of all edges are equal.
 */

function BFS(nodesToAnimate, pathFound) {
  var myQueue = new _utility.Queue();
  // Get start node and end node
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];

  startNode.isVisited = true;
  myQueue.enqueue(startNode);
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new _script.Node();

  // dequeue till queue becomes empty or finds end node
  while (!myQueue.empty()) {
    currNode = myQueue.dequeue();
    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([currNode, "visited"]);
    if (currNode === endNode) {
      pathFound = true;
      break;
    }
    currNode.isVisited = true;
    var neighbours = (0, _utility.getNeighbours)(r, c);
    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];
      var node = new _script.Node();
      node = _script.gridArray[m][n];
      _script.gridArray[m][n].isVisited = true;
      _script.gridArray[m][n].parent = currNode;
      nodesToAnimate.push([node, "searching"]);
      myQueue.enqueue(node);
    }
  }

  // backtrack if path found
  if (pathFound) {
    nodesToAnimate.push([endNode, "shortest"]);
    var prevNode = new _script.Node();
    prevNode = endNode.parent;
    while (prevNode !== null) {
      nodesToAnimate.push([prevNode, "shortest"]);
      prevNode = prevNode.parent;
    }
  }

  return pathFound;
}