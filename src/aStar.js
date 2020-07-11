import { minHeap } from "/src/utility.js";
import { Node, totalRows, totalCols, gridArray } from "./script.js";
//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
const getSpecialNodes = () => {
  let copy_start = null;
  let copy_end = null;
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
function getNeighbours(currNode) {
  let r = currNode.row;
  let c = currNode.col;
  let relevantStatuses = ["start", "wall", "visited"];
  let actual_neighbours = [];
  let neighbours = [];
  if (r - 1 >= 0) {
    neighbours.push(gridArray[r - 1][c]);
    if (c - 1 >= 0) {
      neighbours.push(gridArray[r - 1][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      neighbours.push(gridArray[r - 1][c + 1]);
    }
  }
  if (r + 1 <= totalRows - 1) {
    neighbours.push(gridArray[r + 1][c]);
    if (c - 1 >= 0) {
      neighbours.push(gridArray[r + 1][c - 1], gridArray[r][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      neighbours.push(gridArray[r][c + 1], gridArray[r + 1][c + 1]);
    }
  }
  neighbours.forEach((neighbour) => {
    if (!relevantStatuses.includes(neighbour.status)) {
      actual_neighbours.push(neighbour);
    }
  });
  return actual_neighbours;
}

function updateNeighbours(neighbours, currNode, algo, startNode, endNode) {
  if (algo === "aStar") {
    neighbours.forEach((neighbour) => {
      var newGCost = neighbour.weight + currNode.g;
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
//Astar Algorithm
function getDistance(nodeA, nodeB) {
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (dx > dy) {
    //Better results than using sqrt(2) and 1
    return 14 * dy + 10 * (dx - dy);
  }
  return 14 * dx + 10 * (dy - dx);
  //return dx + dy;
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
const aStar = (nodesToAnimate) => {
  //Get the startNode and the endNode
  let specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];
  //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array
  let openList = new minHeap();
  let visitedNodesInOrder = [];
  //Update the distances of startNode
  //Distance of startNode from startNode
  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode);
  //Considering directions as only four
  startNode.f = startNode.g + startNode.h;
  //Push start node in the open List
  openList.push([startNode.f, startNode]);
  //nodesToAnimate.push([startNode, "searching"]);
  while (!openList.isEmpty()) {
    //The node having the lowest f value
    var currNode = new Node();
    let currArr = openList.getMin();
    currNode = currArr[1];
    //nodesToAnimate.push([currNode, "searching"]);
    visitedNodesInOrder.push(currNode);
    //Check if the endNode
    if (currNode === endNode) {
      return backtrack(startNode, endNode, nodesToAnimate);
    }
    if (currNode.status !== "start") {
      currNode.status = "visited";
    }
    //get element
    let element = document.getElementById(currNode.id);
    if (element.className !== "start" || element.className !== "end") {
      element.className = "visited";
    }
    //nodesToAnimate.push([currNode, "visited"]);
    var neighbours = getNeighbours(currNode, gridArray);
    updateNeighbours(neighbours, currNode, "aStar", startNode, endNode);
    for (let i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      // if (!openList.includes(neighbour)) {
      openList.push([neighbour.f, neighbour]);
      // }
    }
  }
  alert("No Path Exists");
  return;
};
export { aStar };
