import { getSpecialNodes, Queue } from "./utility.js";
import { Node, gridArray, totalCols, totalRows } from "./script.js";

export function BFS(nodesToAnimate, pathFound) {
  //let pathFound = false;
  let myQueue = new Queue();
  let specialNodes = getSpecialNodes();
  let startNode = specialNodes[0];
  let endNode = specialNodes[1];
  // console.log(startNode, endNode);
  startNode.isVisited = true;
  console.log("start node", startNode);
  console.log("Grid node", gridArray[startNode.row][startNode.col]);
  myQueue.enqueue(startNode);
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new Node();
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

function getNeighbours(i, j) {
  var neighbors = [];
  // direction vectors
  const dx = [1, 0, -1, 0, 1, 1, -1, -1];
  const dy = [0, 1, 0, -1, 1, -1, 1, -1];

  for(let d=0; d< dx.length; d++){
    let rr = i+dx[d];
    let cc = j+dy[d];
    if((rr >= 0) && (rr < totalRows) && (cc >= 0) && (cc < totalCols)) {
      if(gridArray[rr][cc].isVisited || gridArray[rr][cc].status == "wall"){
        continue;
      } else {
        gridArray[rr][cc].isVisited = true;
        gridArray[rr][cc].parent = gridArray[i][j];
        neighbors.push([rr, cc]);
      }
    }
  }
  return neighbors;
}
