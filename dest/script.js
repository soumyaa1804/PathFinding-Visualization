"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Node = exports.nodesToAnimate = exports.gridArray = exports.totalCols = exports.totalRows = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.clearGrid = clearGrid;
exports.clearPath = clearPath;

var _dijkstra = require("./dijkstra.js");

var _aStar = require("./aStar.js");

var _BFS = require("./BFS.js");

var _utility = require("./utility.js");

var _timer = require("./timer.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//GLOBAL VARIABLES
var height = window.innerHeight * 0.8;
var width = window.innerWidth * 0.9;
var cellSize = 25;
var totalRows = exports.totalRows = Math.floor(height / cellSize) - 1;
var totalCols = exports.totalCols = Math.floor(width / cellSize) - 1;
var mousePressed = false;
var gridArray = exports.gridArray = [];
var startRow = Math.floor(totalRows / 4);
var startCol = Math.floor(totalCols / 4);
var endRow = Math.floor(3 * totalRows / 4);
var endCol = Math.floor(3 * totalCols / 4);
var prevNode = null;
var nodesToAnimate = exports.nodesToAnimate = [];
var pressedNodeStatus = "normal";
var pathFound = false;
var inProgress = false;
//To add the weights
var keyDown = false;
//Instantiate the grid

var Node = exports.Node = function Node(row, col, nodeClass, nodeId) {
  _classCallCheck(this, Node);

  this.row = row;
  this.col = col;
  this.isClass = nodeClass;
  this.id = nodeId;
  this.status = nodeClass;
  //For Algorithm
  this.distance = Infinity;
  this.parent = null;
  this.weight = 1;
  this.isVisited = false;
  //For heuristics
  this.f = Infinity;
  this.g = Infinity;
  this.h = Infinity;
};
//Generate the grid


var startNode = new Node();
var endNode = new Node();

var Grid = function () {
  function Grid() {
    _classCallCheck(this, Grid);

    this.grid = [];
  }

  _createClass(Grid, [{
    key: "generateGrid",
    value: function generateGrid() {
      var mygrid = "<table>";
      for (var row = 0; row < totalRows; row++) {
        var currRow = [];
        mygrid += "<tr>";
        for (var col = 0; col < totalCols; col++) {
          var new_nodeId = row + "-" + col,
              new_nodeClass = void 0;
          if (row === startRow && col === startCol) {
            new_nodeClass = "start";
          } else if (row === endRow && col === endCol) {
            new_nodeClass = "end";
          } else {
            new_nodeClass = "unvisited";
          }
          //Instantiate a new Node object
          var _node = new Node(row, col, new_nodeClass, new_nodeId);

          if (_node.isClass === "start" && _node.status === "start") {
            startNode = _node;
          } else if (_node.isClass === "end" && _node.status === "end") {
            endNode = _node;
          }

          mygrid += "<td class = " + new_nodeClass + " id = " + new_nodeId + "></td>";
          currRow.push(_node);
        }
        mygrid += "</tr>";
        gridArray.push(currRow);
      }
      this.grid = gridArray;
      mygrid += "</table>";
      document.getElementById("tableContainer").innerHTML = mygrid;
    }
  }, {
    key: "eventListener",
    value: function eventListener() {
      for (var r = 0; r < totalRows; r += 1) {
        var _loop = function _loop(c) {
          var currNode = gridObject.grid[r][c];
          var currId = currNode.id;
          //Current Element in the grid
          var currElement = document.getElementById(currId);

          //  # Event Listeners --mousedown
          //                      --mouseenter
          //                      --mouseup
          //             helper  --mousePressed

          currElement.addEventListener("mousedown", function (e) {
            mousePressed = true;
            if (currNode.status === "start" || currNode.status === "end") {
              pressedNodeStatus = currNode.status;
              prevNode = new Node();
              prevNode = currNode;
            } else {
              pressedNodeStatus = "normal";
              //Manipulate the normal node - convert to "WALL" or "A normal node" or to a weight
              updateStatus(currNode);
            }
            e.preventDefault();
          });
          currElement.addEventListener("mouseenter", function (e) {
            if (mousePressed && pressedNodeStatus !== "normal") {
              //Means that the pressed node is a "Start" or "end"
              //User wants to move the start or end button
              prevNode = moveSpecialNode(currNode);

              //set to default position
            } else if (mousePressed && pressedNodeStatus === "normal") {
              updateStatus(currNode);
            }
          });
          currElement.addEventListener("mouseup", function (e) {
            mousePressed = false;
          });
        };

        for (var c = 0; c < totalCols; c += 1) {
          _loop(c);
        }
      }
      /*---------WEIGHTS----------*/
      window.addEventListener("keydown", function (e) {
        //Return the key that is pressed
        keyDown = e.code;
      });
      window.addEventListener("keyup", function () {
        keyDown = false;
      });
    }
  }]);

  return Grid;
}();
// let gridObject = new Grid();
// gridObject.generateGrid();
//document.getElementById("tableContainer").innerHTML = newGrid;

//Create Walls
/* 1) If the click is on the Start Node and it is being dragged then move the startNode
   2) If the click is on the End Node and it is being dragged then change position
   3) If the click is on a "unvisited" node then update "wall" and if dragged then createWalls
   4) If the click is on a "visited" node then update and make it a unvisted node.*/
//console.log(document.getElementById("1-1"));
// eventListener(){
//   for (let r = 0; r < totalRows; r += 1) {
//     for (let c = 0; c < totalCols; c += 1) {
//       let currNode = gridObject.grid[r][c];
//       let currId = currNode.id;
//       //Current Element in the grid
//       let currElement = document.getElementById(currId);

//       //  # Event Listeners --mousedown
//       //                      --mouseenter
//       //                      --mouseup
//       //             helper  --mousePressed

//       currElement.addEventListener("mousedown", (e) => {
//         mousePressed = true;
//         if (currNode.status === "start" || currNode.status === "end") {
//           pressedNodeStatus = currNode.status;
//           prevNode = new Node();
//           prevNode = currNode;
//         } else {
//           pressedNodeStatus = "normal";
//           //Manipulate the normal node - convert to "WALL" or "A normal node" or to a weight
//           updateStatus(currNode);
//         }
//         e.preventDefault();
//       });
//       currElement.addEventListener("mouseenter", (e) => {
//         if (mousePressed && pressedNodeStatus !== "normal") {
//           //Means that the pressed node is a "Start" or "end"
//           //User wants to move the start or end button
//           prevNode = moveSpecialNode(currNode);

//           //set to default position
//         } else if (mousePressed && pressedNodeStatus === "normal") {
//           updateStatus(currNode);
//         }
//       });
//       currElement.addEventListener("mouseup", (e) => {
//         mousePressed = false;
//       });
//     }
//   }
//   /*---------WEIGHTS----------*/
//   window.addEventListener("keydown", (e) => {
//     //Return the key that is pressed
//     keyDown = e.code;
//   });
//   window.addEventListener("keyup", () => {
//     keyDown = false;
//   });
// };


var gridObject = new Grid();
gridObject.generateGrid();
gridObject.eventListener();
// for (let r = 0; r < totalRows; r += 1) {
//   for (let c = 0; c < totalCols; c += 1) {
//     let currNode = gridObject.grid[r][c];
//     let currId = currNode.id;
//     //Current Element in the grid
//     let currElement = document.getElementById(currId);

//     //  # Event Listeners --mousedown
//     //                      --mouseenter
//     //                      --mouseup
//     //             helper  --mousePressed

//     currElement.addEventListener("mousedown", (e) => {
//       mousePressed = true;
//       if (currNode.status === "start" || currNode.status === "end") {
//         pressedNodeStatus = currNode.status;
//         prevNode = new Node();
//         prevNode = currNode;
//       } else {
//         pressedNodeStatus = "normal";
//         //Manipulate the normal node - convert to "WALL" or "A normal node" or to a weight
//         updateStatus(currNode);
//       }
//       e.preventDefault();
//     });
//     currElement.addEventListener("mouseenter", (e) => {
//       if (mousePressed && pressedNodeStatus !== "normal") {
//         //Means that the pressed node is a "Start" or "end"
//         //User wants to move the start or end button
//         prevNode = moveSpecialNode(currNode);

//         //set to default position
//       } else if (mousePressed && pressedNodeStatus === "normal") {
//         updateStatus(currNode);
//       }
//     });
//     currElement.addEventListener("mouseup", (e) => {
//       mousePressed = false;
//     });
//   }
// }
// /*---------WEIGHTS----------*/
// window.addEventListener("keydown", (e) => {
//   //Return the key that is pressed
//   keyDown = e.code;
// });
// window.addEventListener("keyup", () => {
//   keyDown = false;
// });
function updateStatus(currNode) {
  var element = document.getElementById(currNode.id);
  var relevantStatuses = ["start", "end"];
  if (!keyDown) {
    if (!relevantStatuses.includes(currNode.status) && currNode.weight !== 5) {
      element.className = currNode.status !== "wall" ? "wall" : "unvisited";
      currNode.status = element.className !== "wall" ? "unvisited" : "wall";
      currNode.isClass = currNode.status;
    } else if (currNode.weight === 5) {
      element.className = currNode.status;
      currNode.weight = 1;
    }
  } else {
    if (!relevantStatuses.includes(currNode.status) && keyDown === "KeyW") {
      element.className = currNode.weight !== 5 ? "unvisited-weight" : "unvisited";
      currNode.weight = element.className !== "unvisited-weight" ? 0 : 5;
      currNode.status = "unvisited";
    }
  }
}
//Pressed down on the start node....update the next node that is traversed
//But once the next node is hovered over with pressed down then the node is not updated---so uodate the
//prevNode as the updated node
function moveSpecialNode(currNode) {
  var currElement = document.getElementById(currNode.id);
  var prevElement = void 0;
  //Keep a track if prevElement was pressed or not
  prevElement = document.getElementById(prevNode.id);
  //Check if the node is a wall or end node or start node
  if (mousePressed) {
    if (currNode.status !== "start" && currNode.status !== "end" && currNode.status !== "wall") {
      currElement.className = prevNode.status;
      currNode.status = prevNode.status;
      currNode.isClass = prevNode.status;
      prevNode.status = "unvisited";
      prevNode.isClass = "unvisited";
      prevElement.className = "unvisited";
    }
    return currNode;
  }
}

/* BUTTONS ----> EventListeners -----> Algorithm Selection -----> Algorithm Fetch*/
/* Parameters will be startNode,endNode,gridArray and the grid*/

//CEAR GRID
var node = new Node();
//console.log(node);
var clearBtn = document.getElementById("clearBtn");

function clearGrid() {
  exports.nodesToAnimate = nodesToAnimate = [];
  (0, _timer.resetTimer)();
  for (var r = 0; r < totalRows; r++) {
    for (var c = 0; c < totalCols; c++) {
      node = gridArray[r][c];
      //console.log(node);
      if (node.isClass !== "start" && node.isClass !== "end") {
        var element = document.getElementById(node.id);
        element.className = "unvisited";
        node.status = "unvisited";
        node.isClass = "unvisited";
        node.distance = Infinity;
        node.parent = null;
        node.weight = 1;
        node.isVisited = false;
        node.f = Infinity;
        node.g = Infinity;
        node.h = Infinity;
      }
    }
  }
}
clearBtn.addEventListener("click", clearGrid);
//CLEAR PATH
var clearPathBtn = document.getElementById("clearPathBtn");

function clearPath() {
  (0, _timer.resetTimer)();
  for (var r = 0; r < totalRows; r++) {
    for (var c = 0; c < totalCols; c++) {
      var element = document.getElementById(gridArray[r][c].id);
      if (element.className === "shortest" || element.className === "visited" || element.className === "searching") {
        element.className = "unvisited";
        gridArray[r][c].status = "unvisited";
        gridArray[r][c] = new Node(r, c, gridArray[r][c].status, gridArray[r][c].id);
      } else if (element.className === "wall") {
        gridArray[r][c].status = "wall";
      }
    }
  }
}
clearPathBtn.addEventListener("click", clearPath);
//Handling Algo buttons + start button
//algorithms Object Literal
// function updateBtn() {
//   const algorithms = new Map([
//     ["aStar", "A*"],
//     ["dijkstra", "Dijkstra"],
//     ["BFS", "Breadth First Search"],
//   ]);

//   const algoID = document.getElementById("accordion");

//   algoID.addEventListener("click", (e) => {
//     const validID = ["aStar", "dijkstra", "BFS"];
//     let target_id = e.target.id;
//     if (validID.includes(target_id)) {
//       updateStartBtn(target_id);
//     }
//     e.preventDefault();
//   });
// }
var algorithms = new Map([["aStar", "A*"], ["dijkstra", "Dijkstra"], ["BFS", "Breadth First Search"]]);

var algoID = document.getElementById("accordion");

algoID.addEventListener("click", function (e) {
  var validID = ["aStar", "dijkstra", "BFS"];
  var target_id = e.target.id;
  if (validID.includes(target_id)) {
    updateStartBtn(target_id);
  }
  e.preventDefault();
});
//Get the start Element
var startBtn = document.getElementById("startBtn");

function updateStartBtn(id) {
  //get the name
  var name = algorithms.get(id);
  //console.log(name);
  var updated_string = "Start " + name;
  startBtn.innerHTML = updated_string;
  clearPath();
}

/* ---------------------- */
/*-- Draggable Feature -- */
/*----------------------- */

dragElement(document.getElementById("side-bar"));

function dragElement(elmnt) {
  var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/* ------ Draggable Feature ends
/* ------------------------ */

var startAlgo = function startAlgo() {
  var startBtnText = startBtn.innerText;
  switch (startBtnText) {
    case "Select an Algorithm":
      {
        startBtn.innerText = "Pick an Algorithm!";
        break;
      }
    case "Start A*":
      {
        clearPath();
        exports.nodesToAnimate = nodesToAnimate = [];
        if ((0, _aStar.aStar)(nodesToAnimate, pathFound)) {
          //animateCells is returning a Promise that means we have to use .then
          (0, _utility.animateCells)(inProgress, nodesToAnimate, startBtnText);
        } else {
          alert("Path does not exist!");
        }
        break;
      }
    case "Start Dijkstra":
      {
        clearPath();
        exports.nodesToAnimate = nodesToAnimate = [];
        if ((0, _dijkstra.dijkstra)(nodesToAnimate, pathFound)) {
          (0, _utility.animateCells)(inProgress, nodesToAnimate, startBtnText);
        } else {
          alert("Path does not exist!");
        }
        break;
      }
    case "Start Breadth First Search":
      {
        clearPath();
        exports.nodesToAnimate = nodesToAnimate = [];
        if ((0, _BFS.BFS)(nodesToAnimate, pathFound)) {
          (0, _utility.animateCells)(inProgress, nodesToAnimate, startBtnText);
        } else {
          alert("Path does not exist!");
        }
        break;
      }
    default:
      {
        break;
      }
  }
};
startBtn.addEventListener("click", startAlgo);