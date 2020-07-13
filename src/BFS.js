import { Queue } from "./utility.js";
import { Node, gridArray, totalCols, totalRows } from "./script.js";
import { start } from "./timer.js"

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

export function BFS(pathFound, nodesToAnimate) {
  let myQueue = new Queue();
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  // console.log(startNode, endNode);
  myQueue.enqueue(gridArray[startNode.row][startNode.col]);
  gridArray[startNode.row][startNode.col].isVisited = true;
  nodesToAnimate.push([startNode, "searching"]);
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
    nodesToAnimate.push([gridArray[endNode.row][endNode.col], "shortest"]);
    while (currNode.parent != null) {
      var prevNode = currNode.parent;
      nodesToAnimate.push([gridArray[prevNode.row][prevNode.col], "shortest"]);
      currNode = prevNode;
    }
  }
  return pathFound;
}

export async function animateCells(inProgress, nodesToAnimate) {
  start();
  inProgress = true;
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  var cells = document.getElementsByTagName("td");
  var startNodeIndex =
    gridArray[startNode.row] * totalCols + gridArray[startNode.col];
  var endNodeIndex =
    gridArray[endNode.row] * totalCols + gridArray[endNode.col];

  for (var i = 0; i < nodesToAnimate.length; i++) {
    var nodeCoordinates = nodesToAnimate[i][0];
    var x = nodeCoordinates.row;
    var y = nodeCoordinates.col;
    var num = x * totalCols + y;
    if (num == startNodeIndex || num == endNodeIndex) {
      continue;
    }
    var cell = cells[num];
    var colorClass = nodesToAnimate[i][1]; // success, visited or searching
    // Wait until its time to animate
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (cell.className == "start" || cell.className == "end") {
      if(cell.className == "end"){
        start();
      }
      continue;
    } else cell.className = colorClass;
  }
  nodesToAnimate = [];
  inProgress = false;
  // justFinished = true;

  return new Promise((resolve) => resolve(true));
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
