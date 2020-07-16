import { getSpecialNodes, Queue } from "./utility.js";
import { Node, gridArray, totalCols, totalRows } from "./script.js";

export function BFS(nodesToAnimate, pathFound) {
  //let pathFound = false;
  let myQueue = new Queue();
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  // console.log(startNode, endNode);
  myQueue.enqueue(gridArray[startNode.row][startNode.col]);
  gridArray[startNode.row][startNode.col].isVisited = true;
  nodesToAnimate.push([gridArray[startNode.row][startNode.col], "searching"]);
  var currNode = new Node();
  // console.log(myQueue.items.length);
  while (!myQueue.empty()) {
    currNode = myQueue.dequeue();
    // console.log(currNode);
    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([gridArray[r][c], "visited"]);
    if (r == endNode.row && c == endNode.col) {
      pathFound = true;
      break;
    }
    var neighbours = getNeighbours(r, c);
    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];
      if (gridArray[m][n].isVisited || gridArray[m][n].status == "wall") {
        continue;
      }
      gridArray[m][n].isVisited = true;
      gridArray[m][n].parent = currNode;
      nodesToAnimate.push([gridArray[m][n], "searching"]);
      myQueue.enqueue(gridArray[m][n]);
    }
  }

  if (pathFound) {
    endNode.isVisited = true;
    nodesToAnimate.push([gridArray[endNode.row][endNode.col], "shortest"]);
    while (currNode.parent != null) {
      var prevNode = currNode.parent;
      nodesToAnimate.push([gridArray[prevNode.row][prevNode.col], "shortest"]);
      currNode = prevNode;
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
  if (i < totalRows - 1) {
    neighbors.push([i + 1, j]);
  }
  if (j < totalCols - 1) {
    neighbors.push([i, j + 1]);
  }
  return neighbors;
}
