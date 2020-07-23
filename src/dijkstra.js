/**
 * Dijkstra Algorithm
 * Weighted search algorithm.
 * Invoked when Start Dijkstra is 'CLICKED'
 */

import { Node, totalRows, totalCols, gridArray } from "./script.js";
import { getNeighbours, getSpecialNodes } from "./utility.js";

/**
 * @description Dijkstra Algorithm
 * 
 * @param {Array} nodesToAnimate array of type [node, "status"] 
 * @param {boolean} pathFound false in the beginning.
 * @returns true if path found or else return false.
 */
function dijkstra(nodesToAnimate, pathFound) {
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  //Assign distance as 0 for startNode
  startNode.distance = 0;
  let currNode = new Node();
  currNode = startNode;
  nodesToAnimate.push([startNode, "searching"]);
  startNode.isVisited = true;
  //Get the unvisited nodes
  let unvisitedNodes = getUnvisitedNodes();
  while (unvisitedNodes.length) {
    //Get the neighbours
    //nodesToAnimate.push([currNode, "visited"]);
    var neighboursIndex = getNeighbours(currNode.row, currNode.col);
    let neighbours = [];
    neighboursIndex.forEach((indices) => {
      let m = indices[0];
      let n = indices[1];
      let neighbour = new Node();
      neighbour = gridArray[m][n];
      neighbours.push(neighbour);
    });
    updateNeighbours(neighbours, currNode, "dijkstra");
    unvisitedNodes.sort((a, b) => {
      return a.distance - b.distance;
    });
    let closestNode = unvisitedNodes.shift();
    //Check if distnace is infintiy---no path exists
    if (closestNode.distance === Infinity) {
      pathFound = false;
      break;
    }
    nodesToAnimate.push([closestNode, "searching"]);
    //Update the status of the closest node as visited
    if (closestNode.status === "end") {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      break;
    }
    nodesToAnimate.push([closestNode, "visited"]);
    closestNode.status = "visited";
    unvisitedNodes = getUnvisitedNodes();
    currNode = closestNode;
  }
  return pathFound;
}

function getUnvisitedNodes() {
  let nodes = [];
  let relevantStatuses = ["start", "wall", "visited"];
  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalCols; j++) {
      if (!relevantStatuses.includes(gridArray[i][j].status)) {
        nodes.push(gridArray[i][j]);
      }
    }
  }
  return nodes;
}
/**
 * @description update neighbour's distance
 * 
 * @param {Array} neighbours array of neighbouring nodes
 * @param {Node} currNode parent node of neighbours
 * @param {string} algo algorithm's HTML id
 */
function updateNeighbours(neighbours, currNode, algo) {
  let row = currNode.row;
  let col = currNode.col;
  let DiagonalId = [
    `${row - 1}-${col - 1}`,
    `${row - 1}-${col + 1}`,
    `${row + 1}-${col - 1}`,
    `${row + 1}-${col + 1}`,
  ];
  if (algo === "dijkstra") {
    neighbours.forEach((neighbour) => {
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
export { dijkstra };
