import { getSpecialNodes, Queue } from "./utility.js";
import { Node, gridArray, totalCols, totalRows } from "./script.js";

export function BFS(nodesToAnimate, pathFound) {
  let myQueue = new Queue();
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  console.log(startNode, endNode);
  myQueue.enqueue(startNode);
  //startNode.isVisited = true;
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new Node();
  //console.log(myQueue.items.length);
  while (!myQueue.empty()) {
    currNode = myQueue.dequeue();
    // console.log(currNode);
    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([currNode, "visited"]);
    //nodesToAnimate.push([gridArray[r][c], "visited"]);
    if (currNode.status === endNode.status) {
      // alert("Endfound");
      pathFound = true;
      break;
    }
    currNode.isVisited = true;
    // if (r == endNode.row && c == endNode.col) {
    //   pathFound = true;
    //   break;
    // }
    var neighbours = getNeighbours(r, c);
    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];
      let node = new Node();
      node = gridArray[m][n];
      if (node.isVisited || node.status === "wall") {
        // console.log(node);
        continue;
      }
      // if (gridArray[m][n].isVisited || gridArray[m][n].status == "wall") {
      //   continue;
      // }
      //node.isVisited = true;
      node.parent = currNode;
      // gridArray[m][n].isVisited = true;
      // gridArray[m][n].parent = currNode;
      nodesToAnimate.push([node, "searching"]);
      //nodesToAnimate.push([gridArray[m][n], "searching"]);
      //myQueue.enqueue(gridArray[m][n]);
      myQueue.enqueue(node);
    }
  }

  if (pathFound) {
    // endNode.isVisited = true;
    // nodesToAnimate.push([endNode, "shortest"]);
    // //nodesToAnimate.push([gridArray[endNode.row][endNode.col], "shortest"]);
    // while (currNode.parent != null) {
    //   let prevNode = new Node();
    //   prevNode = currNode.parent;
    //   nodesToAnimate.push([currNode.parent, "shortest"]);
    // }
    endNode.isVisited = true;
    nodesToAnimate.push([endNode, "shortest"]);
    let prevNode = new Node();
    console.log("current node should be endnode", currNode);
    prevNode = endNode.parent;
    while (prevNode !== null) {
      nodesToAnimate.push([prevNode, "shortest"]);
      prevNode = prevNode.parent;
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
