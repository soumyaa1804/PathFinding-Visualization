import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { BFS } from "./BFS.js";
import { animateCells } from "./utility.js";
//GLOBAL VARIABLES
var height = window.innerHeight * 0.8;
var width = window.innerWidth * 0.9;
var cellSize = 25;
export var totalRows = Math.floor(height / cellSize) - 1;
export var totalCols = Math.floor(width / cellSize) - 1;
let mousePressed = false;
export let gridArray = [];
let startRow = Math.floor(totalRows / 4);
let startCol = Math.floor(totalCols / 4);
let endRow = Math.floor((3 * totalRows) / 4);
let endCol = Math.floor((3 * totalCols) / 4);
let prevNode = null;
export let nodesToAnimate = [];
let pressedNodeStatus = "normal";
let pathFound = false;
let inProgress = false;
//To add the weights
let keyDown = false;
//Instantiate the grid
export class Node {
  constructor(row, col, nodeClass, nodeId) {
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
  }
}
//Generate the grid
let startNode = new Node();
let endNode = new Node();
class Grid {
  constructor() {
    this.grid = [];
  }
  generateGrid() {
    let mygrid = `<table>`;
    for (let row = 0; row < totalRows; row++) {
      let currRow = [];
      mygrid += `<tr>`;
      for (let col = 0; col < totalCols; col++) {
        let new_nodeId = `${row}-${col}`,
          new_nodeClass;
        if (row === startRow && col === startCol) {
          new_nodeClass = "start";
        } else if (row === endRow && col === endCol) {
          new_nodeClass = "end";
        } else {
          new_nodeClass = "unvisited";
        }
        //Instantiate a new Node object
        let node = new Node(row, col, new_nodeClass, new_nodeId);

        if (node.isClass === "start" && node.status === "start") {
          startNode = node;
        } else if (node.isClass === "end" && node.status === "end") {
          endNode = node;
        }

        mygrid += `<td class = ${new_nodeClass} id = ${new_nodeId}></td>`;
        currRow.push(node);
      }
      mygrid += `</tr>`;
      gridArray.push(currRow);
    }
    this.grid = gridArray;
    mygrid += `</table>`;
    return mygrid;
  }
}
let gridObject = new Grid();
let newGrid = gridObject.generateGrid();
document.getElementById("tableContainer").innerHTML = newGrid;

//Create Walls
/* 1) If the click is on the Start Node and it is being dragged then move the startNode
   2) If the click is on the End Node and it is being dragged then change position
   3) If the click is on a "unvisited" node then update "wall" and if dragged then createWalls
   4) If the click is on a "visited" node then update and make it a unvisted node.*/
//console.log(document.getElementById("1-1"));

for (let r = 0; r < totalRows; r += 1) {
  for (let c = 0; c < totalCols; c += 1) {
    let currNode = gridObject.grid[r][c];
    let currId = currNode.id;
    //Current Element in the grid
    let currElement = document.getElementById(currId);

    //  # Event Listeners --mousedown
    //                      --mouseenter
    //                      --mouseup
    //             helper  --mousePressed

    currElement.addEventListener("mousedown", (e) => {
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
    currElement.addEventListener("mouseenter", (e) => {
      if (mousePressed && pressedNodeStatus !== "normal") {
        //Means that the pressed node is a "Start" or "end"
        //User wants to move the start or end button
        prevNode = moveSpecialNode(currNode);

        //set to default position
      } else if (mousePressed && pressedNodeStatus === "normal") {
        updateStatus(currNode);
      }
    });
    currElement.addEventListener("mouseup", (e) => {
      mousePressed = false;
    });
  }
}
/*---------WEIGHTS----------*/
window.addEventListener("keydown", (e) => {
  //Return the key that is pressed
  keyDown = e.code;
});
window.addEventListener("keyup", () => {
  keyDown = false;
});
function updateStatus(currNode) {
  let element = document.getElementById(currNode.id);
  let relevantStatuses = ["start", "end"];
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
      element.className =
        currNode.weight !== 5 ? "unvisited-weight" : "unvisited";
      currNode.weight = element.className !== "unvisited-weight" ? 0 : 5;
      currNode.status = "unvisited";
    }
  }
}
//Pressed down on the start node....update the next node that is traversed
//But once the next node is hovered over with pressed down then the node is not updated---so uodate the
//prevNode as the updated node
function moveSpecialNode(currNode) {
  let currElement = document.getElementById(currNode.id);
  let prevElement;
  //Keep a track if prevElement was pressed or not
  prevElement = document.getElementById(prevNode.id);
  //Check if the node is a wall or end node or start node
  if (mousePressed) {
    if (
      currNode.status !== "start" &&
      currNode.status !== "end" &&
      currNode.status !== "wall"
    ) {
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
let node = new Node();
//console.log(node);
let clearBtn = document.getElementById("clearBtn");

function clearGrid() {
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      node = gridArray[r][c];
      //console.log(node);
      if (node.isClass !== "start" && node.isClass !== "end") {
        let element = document.getElementById(node.id);
        element.className = "unvisited";
        node.status = "unvisited";
        node.isClass = "unvisited";
      }
    }
  }
}
clearBtn.addEventListener("click", clearGrid);
//CLEAR PATH
let clearPathBtn = document.getElementById("clearPathBtn");
function clearPath() {
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      let element = document.getElementById(gridArray[r][c].id);
      if (
        element.className === "shortest" ||
        element.className === "visited" ||
        element.className === "searching"
      ) {
        element.className = "unvisited";
        gridArray[r][c].status = "unvisited";
        gridArray[r][c] = new Node(
          r,
          c,
          gridArray[r][c].status,
          gridArray[r][c].id
        );
      }
    }
  }
}
clearPathBtn.addEventListener("click", clearPath);
//Handling Algo buttons + start button
//algorithms Object Literal
const algorithms = new Map([
  ["aStar", "A*"],
  ["dijkstra", "Dijkstra"],
  ["GBFS", "Greedy Best First Search"],
  ["BFS", "Breadth First Search"],
  ["DFS", "Depth First Search"],
  ["JPS", "Jump Point Search"],
]);

const algoID = document.getElementById("accordion");

algoID.addEventListener("click", (e) => {
  const validID = ["aStar", "dijkstra", "GBFS", "BFS", "DFS", "JPS"];
  let target_id = e.target.id;
  if (validID.includes(target_id)) {
    updateStartBtn(target_id);
  }
  e.preventDefault();
});
//Get the start Element
let startBtn = document.getElementById("startBtn");

function updateStartBtn(id) {
  //get the name
  let name = algorithms.get(id);
  //console.log(name);
  let updated_string = "Start " + name;
  startBtn.innerHTML = updated_string;
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

const startAlgo = () => {
  let startBtnText = startBtn.innerText;
  switch (startBtnText) {
    case "Start Visualization": {
      startBtn.innerText = "Pick an Algorithm!";
      break;
    }
    case "Start A*": {
      if (aStar(nodesToAnimate, pathFound)) {
        animateCells(inProgress, nodesToAnimate, startBtnText);
      } else {
        alert("Path does not exist!");
      }
      break;
    }
    case "Start Dijkstra": {
      if (dijkstra(nodesToAnimate, pathFound)) {
        animateCells(inProgress, nodesToAnimate, startBtnText);
      } else {
        alert("Path does not exist!");
      }
      break;
    }
    case "Start Breadth First Search": {
      if (BFS(nodesToAnimate, pathFound)) {
        animateCells(inProgress, nodesToAnimate, startBtnText);
      } else {
        alert("Path does not exist!");
      }
      break;
    }
    default: {
      break;
    }
  }
};

startBtn.addEventListener("click", startAlgo);
