"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aStar = void 0;

var _utility = require("/src/utility.js");

var _script = require("./script.js");

//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
function updateNeighbours(neighbours, currNode, algo, endNode) {
  if (algo === "aStar") {
    neighbours.forEach(function (neighbour) {
      var newGCost = 1 + currNode.g; //Whenever weights are involved f(n) = g(n) + W*h(n)

      var estimation_cost = neighbour.weight * getDistance(neighbour, endNode);
      var newCost = newGCost + estimation_cost;

      if (newCost < neighbour.f) {
        neighbour.g = newGCost;
        neighbour.f = newCost;
        neighbour.h = estimation_cost;
        neighbour.parent = currNode;
      }
    });
  }
} //Astar Algorithm


function getDistance(nodeA, nodeB) {
  var diagonal = document.getElementById("diagonal-flag").checked;
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);

  if (diagonal === false) {
    //Manhattan Distance
    return dx + dy;
  } else {
    if (dx > dy) {
      //Better results than using sqrt(2) and 1
      return 1.4 * dy + 1 * (dx - dy);
    }

    return 1.4 * dx + 1 * (dy - dx);
  }
}

function backtrack(endNode, nodesToAnimate) {
  nodesToAnimate.push([endNode, "shortest"]);
  var currNode = new _script.Node();
  currNode = endNode.parent;

  while (currNode !== null) {
    nodesToAnimate.push([currNode, "shortest"]);
    currNode = currNode.parent;
  }
}

var aStar = function aStar(nodesToAnimate, pathFound) {
  //Get the startNode and the endNode
  var specialNodes = (0, _utility.getSpecialNodes)();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1]; //nodesToAnimate = [];
  //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array

  var openList = new _utility.minHeap(); //Update the distances of startNode
  //Distance of startNode from startNode

  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode); //Considering directions as only four

  startNode.f = startNode.g + startNode.h; //Push start node in the open List
  //startNode.isVisited = true;
  //nodesToAnimate.push([startNode, "searching"]);

  openList.push([startNode.f, startNode]); //nodesToAnimate.push([startNode, "searching"]);

  var _loop2 = function _loop2() {
    //The node having the lowest f value
    //console.log("loop", openList);
    currNode = new _script.Node();
    var currArr = openList.getMin();
    currNode = currArr[1];
    console.log("72", currNode); //nodesToAnimate.push([currNode, "searching"]);
    //Check if the endNode

    if (currNode.status == endNode.status) {
      pathFound = true;
      backtrack(endNode, nodesToAnimate);
      return "break";
    }

    if (currNode.isVisited) {
      console.log(74, currNode.isVisited);
      return "continue";
    }

    currNode.isVisited = true;
    nodesToAnimate.push([currNode, "visited"]);
    neighboursIndex = (0, _utility.getNeighbours)(currNode.row, currNode.col);
    var neighbours = [];
    neighboursIndex.forEach(function (indices) {
      var m = indices[0];
      var n = indices[1];
      var neighbour = new _script.Node();
      neighbour = _script.gridArray[m][n];
      neighbours.push(neighbour);
    });
    updateNeighbours(neighbours, currNode, "aStar", endNode);
    console.log("astar neigh", neighbours);

    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      nodesToAnimate.push([neighbour, "searching"]);
      openList.push([neighbour.f, neighbour]);
    }
  };

  _loop: while (!openList.isEmpty()) {
    var currNode;
    var neighboursIndex;

    var _ret = _loop2();

    switch (_ret) {
      case "break":
        break _loop;

      case "continue":
        continue;
    }
  }

  while (!openList.isEmpty()) {
    var cell = new _script.Node();
    var arr = openList.getMin();
    cell = arr[1];

    if (cell.isVisited) {
      continue;
    }

    cell.isVisited = true;
    nodesToAnimate.push([cell, "visited"]);
  } //alert("No Path Exists");


  console.log(endNode);
  console.log("inside a*", pathFound);
  openList.clear();
  return pathFound;
};

exports.aStar = aStar;