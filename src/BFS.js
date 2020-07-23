/**
 * Breadth-First Search
 * 
 * An uninformed search algorithm.
 * Completeness: BFS is complete, meaning for a given search tree, BFS will come up with a solution if it exists.
 * Optimality: BFS is optimal as long as the costs of all edges are equal.
 */

import { getSpecialNodes, Queue, getNeighbours } from "./utility.js";
import { Node, gridArray } from "./script.js";

/**
 * @description BFS Algorithm
 * 
 * @param {Array} nodesToAnimate array of type [node, "status"] 
 * @param {boolean} pathFound false in the beginning.
 * @returns true if path found or else return false.
 */
export function BFS(nodesToAnimate, pathFound) {
  let myQueue = new Queue();
  // Get start node and end node
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  
  startNode.isVisited = true;
  myQueue.enqueue(startNode);
  nodesToAnimate.push([startNode, "searching"]);
  let currNode = new Node();
  
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
    var neighbours = getNeighbours(r, c);
    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];
      let node = new Node();
      node = gridArray[m][n];
      gridArray[m][n].isVisited = true;
      gridArray[m][n].parent = currNode;
      nodesToAnimate.push([node, "searching"]);
      myQueue.enqueue(node);
    }
  }

  // backtrack if path found
  if (pathFound) {
    nodesToAnimate.push([endNode, "shortest"]);
    let prevNode = new Node();
    prevNode = endNode.parent;
    while (prevNode !== null) {
      nodesToAnimate.push([prevNode, "shortest"]);
      prevNode = prevNode.parent;
    }
  }

  return pathFound;
}
