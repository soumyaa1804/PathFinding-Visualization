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
      var newGCost = neighbour.weight + currNode.g; // if (newGCost < neighbour.g) {
      //   neighbour.g = newGCost;
      //   neighbour.parent = currNode;
      // }

      var estimation_cost = getDistance(neighbour, endNode);
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
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);

  if (dx > dy) {
    //Better results than using sqrt(2) and 1
    return 14 * dy + 10 * (dx - dy);
  }

  return 14 * dx + 10 * (dy - dx); //return dx + dy;
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

  while (!openList.isEmpty()) {
    //The node having the lowest f value
    //console.log("loop", openList);
    var currNode = new _script.Node();
    var currArr = openList.getMin();
    currNode = currArr[1];
    console.log("72", currNode); //nodesToAnimate.push([currNode, "searching"]);
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
    var neighbours = (0, _utility.getNeighbours)(currNode);
    updateNeighbours(neighbours, currNode, "aStar", endNode);
    console.log("astar neigh", neighbours);

    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      nodesToAnimate.push([neighbour, "searching"]);
      openList.push([neighbour.f, neighbour]);
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