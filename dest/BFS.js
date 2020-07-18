"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = BFS;

var _utility = require("./utility.js");

var _script = require("./script.js");

function BFS(nodesToAnimate, pathFound) {
  //let pathFound = false;
  var myQueue = new _utility.Queue();
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1]; // console.log(startNode, endNode);

  startNode.isVisited = true;
  console.log("start node", startNode);
  console.log("Grid node", _script.gridArray[startNode.row][startNode.col]);
  myQueue.enqueue(startNode);
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new _script.Node();

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
      var node = new _script.Node();
      node = _script.gridArray[m][n];
      _script.gridArray[m][n].isVisited = true;
      _script.gridArray[m][n].parent = currNode;
      nodesToAnimate.push([node, "searching"]);
      myQueue.enqueue(node);
    }
  }

  if (pathFound) {
    nodesToAnimate.push([endNode, "shortest"]);
    var prevNode = new _script.Node();
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
  var neighbors = []; // direction vectors
  // 0-3: East, South, West, North
  // 4-7: South-East, North-East, South-West, North-West

  var dx = [1, 0, -1, 0, 1, 1, -1, -1];
  var dy = [0, 1, 0, -1, 1, -1, 1, -1];

  for (var d = 0; d < dx.length; d++) {
    var rr = i + dx[d];
    var cc = j + dy[d];

    if (rr >= 0 && rr < _script.totalRows && cc >= 0 && cc < _script.totalCols) {
      if (_script.gridArray[rr][cc].isVisited || _script.gridArray[rr][cc].status === "wall") {
        continue;
      } // if d < 4, push elements else if d >= 4, check for diagonal walls  
      else if (d < 4) {
          neighbors.push([rr, cc]);
        } else if (d === 4 && _script.gridArray[i][j + 1].status !== "wall" && _script.gridArray[i + 1][j].status !== "wall") {
          neighbors.push([rr, cc]);
        } else if (d === 5 && _script.gridArray[i][j - 1].status !== "wall" && _script.gridArray[i + 1][j].status !== "wall") {
          neighbors.push([rr, cc]);
        } else if (d === 6 && _script.gridArray[i - 1][j].status !== "wall" && _script.gridArray[i][j + 1].status !== "wall") {
          neighbors.push([rr, cc]);
        } else if (d === 7 && _script.gridArray[i - 1][j].status !== "wall" && _script.gridArray[i][j - 1].status !== "wall") {
          neighbors.push([rr, cc]);
        }
    }
  }

  return neighbors;
}