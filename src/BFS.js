import { getSpecialNodes, Queue, getNeighbours } from "./utility.js";
import { Node, gridArray, totalCols, totalRows } from "./script.js";

export function BFS(nodesToAnimate, pathFound) {
  let myQueue = new Queue();
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  startNode.isVisited = true;
  myQueue.enqueue(startNode);
  nodesToAnimate.push([startNode, "searching"]);
  let currNode = new Node();
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

  if (pathFound) {
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
