//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
import { Node, totalRows, totalCols, gridArray } from "./script.js";
const getSpecialNodes = () => {
  let copy_end = null,
    copy_start = null;
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      if (
        gridArray[r][c].status === "start" &&
        gridArray[r][c].isClass === "start"
      ) {
        copy_start = gridArray[r][c];
      } else if (
        gridArray[r][c].status === "end" &&
        gridArray[r][c].isClass === "end"
      ) {
        copy_end = gridArray[r][c];
      }
    }
  }
  let valid_buttons = [copy_start, copy_end];
  return valid_buttons;
};
function dijkstra(nodesToAnimate) {
  let specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  let visitedNodesInOrder = [startNode];
  //Assign distance as 0 for startNode
  startNode.distance = 0;
  let currNode = new Node();
  currNode = startNode;
  //Get the unvisited nodes
  let unvisitedNodes = getUnvisitedNodes();
  while (unvisitedNodes.length) {
    //Get the neighbours
    let neighbours = getNeighbours(currNode);
    updateNeighbours(neighbours, currNode, "dijkstra");
    unvisitedNodes.sort((a, b) => {
      return a.distance - b.distance;
    });
    // if (unvisitedNodes[0].distance === 1) {
    //   unvisitedNodes[0].parent = startNode;
    // }
    let closestNode = unvisitedNodes.shift();
    //Check if distnace is infintiy---no path exists
    if (closestNode.distance === Infinity) {
      break;
    }
    visitedNodesInOrder.push(closestNode);
    //Update the status of the closest node as visited
    if (closestNode.status === "end") {
      backtrack(startNode, endNode, nodesToAnimate);
      break;
    }
    closestNode.status = "visited";
    //closestNode.isClass = "visited";
    let element = document.getElementById(closestNode.id);
    element.className = "visited";
    //Check if the end point
    unvisitedNodes = getUnvisitedNodes();
    currNode = closestNode;
  }
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
function getNeighbours(currNode) {
  let r = currNode.row;
  let c = currNode.col;
  let relevantStatuses = ["start", "wall", "visited"];
  let actual_neighbours = [];
  let neighbours = [];
  if (r - 1 >= 0) {
    neighbours.push(gridArray[r - 1][c]);
    if (c - 1 >= 0) {
      if (
        gridArray[r - 1][c].status !== "wall" &&
        gridArray[r][c - 1].status !== "wall"
      )
        neighbours.push(gridArray[r - 1][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      if (
        gridArray[r - 1][c].status !== "wall" &&
        gridArray[r][c + 1].status !== "wall"
      )
        neighbours.push(gridArray[r - 1][c + 1]);
    }
  }
  if (r + 1 <= totalRows - 1) {
    neighbours.push(gridArray[r + 1][c]);
    if (c - 1 >= 0) {
      if (
        gridArray[r + 1][c - 1].status !== "wall" &&
        gridArray[r + 1][c].status !== "wall"
      ) {
        neighbours.push(gridArray[r + 1][c - 1]);
      }
      neighbours.push(gridArray[r][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      if (
        gridArray[r][c + 1].status !== "wall" &&
        gridArray[r + 1][c].status !== "wall"
      ) {
        neighbours.push(gridArray[r + 1][c + 1]);
      }
      neighbours.push(gridArray[r][c + 1]);
    }
  }
  neighbours.forEach((neighbour) => {
    if (!relevantStatuses.includes(neighbour.status)) {
      actual_neighbours.push(neighbour);
    }
  });
  return actual_neighbours;
}

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
  } else if (algo === "aStar") {
    neighbours.forEach((neighbour) => {
      var newGCost = 10 + currNode.g;
      // if (newGCost < neighbour.g) {
      //   neighbour.g = newGCost;
      //   neighbour.parent = currNode;
      // }
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
function backtrack(startNode, endNode, nodesToAnimate) {
  nodesToAnimate.push(endNode);
  let currNode = new Node();
  currNode = endNode.parent;
  while (currNode !== startNode) {
    nodesToAnimate.push(currNode);
    currNode.status = "shortest";
    let element = document.getElementById(currNode.id);
    element.className = "shortest";
    currNode = currNode.parent;
  }
  nodesToAnimate.push(startNode);
  nodesToAnimate.reverse();
  return nodesToAnimate;
}
export { dijkstra };
