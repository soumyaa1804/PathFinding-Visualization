import { getSpecialNodes, minHeap, getNeighbours } from "/src/utility.js";
import { Node, gridArray } from "./script.js";
//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
function updateNeighbours(neighbours, currNode, algo, endNode) {
  if (algo === "aStar") {
    neighbours.forEach((neighbour) => {
      var newGCost = currNode.g;
      //Whenever weights are involved f(n) = g(n) + W*h(n)
      let estimation_cost = neighbour.weight * getDistance(neighbour, endNode);
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
      return 14 * dy + 10 * (dx - dy);
    }
    return 14 * dx + 10 * (dy - dx);
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
  //Get the startNode and the endNode
  let specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1];

  //nodesToAnimate = [];

  //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array
  let openList = new minHeap();
  //Update the distances of startNode
  //Distance of startNode from startNode
  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode);
  //Considering directions as only four
  startNode.f = startNode.g + startNode.h;
  //Push start node in the open List
  //startNode.isVisited = true;
  //nodesToAnimate.push([startNode, "searching"]);
  openList.push([startNode.f, startNode]);
  //nodesToAnimate.push([startNode, "searching"]);
  while (!openList.isEmpty()) {
    //The node having the lowest f value
    //console.log("loop", openList);
    var currNode = new Node();
    let currArr = openList.getMin();
    currNode = currArr[1];
    console.log("72", currNode);

    //nodesToAnimate.push([currNode, "searching"]);
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
  //alert("No Path Exists");
  console.log(endNode);
  console.log("inside a*", pathFound);
  openList.clear();
  return pathFound;
};
export { aStar };
