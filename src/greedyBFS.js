import { getSpecialNodes, minHeap, getNeighbours } from "/src/utility.js";
import { Node, gridArray } from "./script.js";
function updateNeighbours(currNode, neighbours, endNode) {
  neighbours.forEach((neighbour) => {
    neighbour.h = neighbour.weight * getDistance(neighbour, endNode);
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
const greedyBFS = (nodesToAnimate, pathFound) => {};
export { greedyBFS };
