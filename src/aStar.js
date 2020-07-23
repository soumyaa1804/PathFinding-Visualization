/**
 * A* searching algorithm
 * 
 * Complete: A* algorithm is complete as long as branching factor (branches from 1 node) 
 * is finite and cost at every action is fixed.
 * Optimal: A* search algorithm is optimal if it follows below two conditions: Admissibility and consistency.
 * 
 * reference: https://www.javatpoint.com/ai-informed-search-algorithms
 */

import { getSpecialNodes, minHeap, getNeighbours } from "/src/utility.js";
import { Node, gridArray } from "./script.js";
//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
function updateNeighbours(neighbours, currNode, algo, endNode) {
  if (algo === "aStar") {
    neighbours.forEach((neighbour) => {
      var newGCost = currNode.g + neighbour.weight;

      //Whenever weights are involved f(n) = g(n) + W*h(n)
      let estimation_cost = getDistance(neighbour, endNode);
      let newCost = newGCost + estimation_cost;
      if (newCost < neighbour.f) {
        neighbour.g = newGCost;
        neighbour.f = newCost;
        neighbour.h = estimation_cost;
        neighbour.parent = currNode;
      }
    });
  }
}
//Astar Algorithm
function getDistance(nodeA, nodeB) {
  const diagonal = document.getElementById("diagonal-flag").checked;
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (diagonal === false) {
    //Manhattan Distance
    return dx + dy;
  } else {
    if (dx > dy) {
      //Better results than using sqrt(2) and 1
      return 1.4 * dy + 1 * (dx - dy);
    }
    return 1.4 * dx + 1 * (dy - dx);
  }
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
const aStar = (nodesToAnimate, pathFound) => {
  let specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];

  let openList = new minHeap();
  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode);
  startNode.f = startNode.g + startNode.h;

  openList.push([startNode.f, startNode]);

  while (!openList.isEmpty()) {
    var currNode = new Node();
    let currArr = openList.getMin();
    currNode = currArr[1];

    if (currNode.status == endNode.status) {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      break;
    }
    if (currNode.isVisited) {
      continue;
    }
    currNode.isVisited = true;
    nodesToAnimate.push([currNode, "visited"]);

    var neighboursIndex = getNeighbours(currNode.row, currNode.col);
    let neighbours = [];
    neighboursIndex.forEach((indices) => {
      let m = indices[0];
      let n = indices[1];
      let neighbour = new Node();
      neighbour = gridArray[m][n];
      neighbours.push(neighbour);
    });
    updateNeighbours(neighbours, currNode, "aStar", endNode);
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
  openList.clear();
  return pathFound;
};
export { aStar };
