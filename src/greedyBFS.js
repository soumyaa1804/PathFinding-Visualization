/**
 * Greedy Best-First Search
 * 
 * An informed searching algorithm
 * Complete: Greedy best-first search is incomplete, even if the given state space is finite.
 * Optimal: Greedy best first search algorithm is not optimal.
 */

import { getSpecialNodes, minHeap, getNeighbours } from "/src/utility.js";
import { Node, gridArray } from "./script.js";

function updateNeighbours(currNode, neighbours, endNode) {
  neighbours.forEach((neighbour) => {
    neighbour.h = neighbour.weight + getDistance(neighbour, endNode);
    var newf = neighbour.h;
    if (newf < neighbour.f) neighbour.f = newf;
    neighbour.parent = currNode;
  });
}

function backtrack(endNode, nodesToAnimate) {
  nodesToAnimate.push([endNode, "shortest"]);
  let currNode = new Node();
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
  const diagonal = document.getElementById("diagonal-flag").checked;
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (diagonal === false) {
    //Manhattan Distance
    return dx + dy;
  } else {
    // Diagonal Distance
    if (dx > dy) {
      return (1.4 * dy) + (1 * (dx - dy));
    }
    return (1.4 * dx) + (1 * (dy - dx));
  }
}

const greedyBFS = (nodesToAnimate, pathFound) => {
  //Get the startNode and the endNode
  let specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];

  //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array
  let openList = new minHeap();
  //Update the distances of startNode
  //Distance of startNode from startNode

  startNode.h = getDistance(startNode, endNode);

  startNode.f = startNode.h;

  openList.push([startNode.f, startNode]);

  while (!openList.isEmpty()) {
    var currNode = new Node();
    let currArr = openList.getMin();
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

    var neighboursIndex = getNeighbours(currNode.row, currNode.col);
    let neighbours = [];
    for (const indices of neighboursIndex) {
      let m = indices[0];
      let n = indices[1];
      let neighbour = new Node();
      neighbour = gridArray[m][n];
      neighbours.push(neighbour);
    }
    updateNeighbours(currNode, neighbours, endNode);
    console.log("astar neigh", neighbours);
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      nodesToAnimate.push([neighbour, "searching"]);
      openList.push([neighbour.f, neighbour]);
    }
  }
  while (!openList.isEmpty()) {
    let cell = new Node();
    let arr = openList.getMin();
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
export { greedyBFS };
