/**
 * Contents:
 * - Imports
 * - Global Variables
 * - Node class
 * - Grid class
 * - Grid object creation
 * - moveSpecialNode (To reset start and end node)
 * - Clear Grid function
 * - Clear Path function
 * - Draggable feature for Instruction bar and Algo bar
 * - Start Button Controls (Algorithm calls)
 */

/**
 * Imports
 */
import { dijkstra } from "./dijkstra.js";
import { aStar } from "./aStar.js";
import { BFS } from "./BFS.js";
import { greedyBFS } from "./greedyBFS.js";
import { animateCells, countLength } from "./utility.js";
import { resetTimer } from "./timer.js";

/**
 * Global Variables
 */
const height = window.innerHeight * 0.8;
const width = window.innerWidth * 0.9;
const cellSize = 25;
export const totalRows = Math.floor(height / cellSize) - 1;
export const totalCols = Math.floor(width / cellSize) - 1;
let mousePressed = false;
export let gridArray = [];
let startRow = Math.floor(totalRows / 4);
let startCol = Math.floor(totalCols / 4);
let endRow = Math.floor((3 * totalRows) / 4);
let endCol = Math.floor((3 * totalCols) / 4);
let prevNode = null;
let nodesToAnimate = [];
let pressedNodeStatus = "normal";
let pathFound = false;
let inProgress = false;
//To add the weights
let keyDown = false;

/**
 * Node class
 */
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

/**
 * Grid Class
 *  - generateGrid()
 *  - eventListener()
 */
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

        mygrid += `<td class = ${new_nodeClass} id = ${new_nodeId}></td>`;
        currRow.push(node);
      }
      mygrid += `</tr>`;
      gridArray.push(currRow);
    }
    this.grid = gridArray;
    mygrid += `</table>`;
    document.getElementById("tableContainer").innerHTML = mygrid;
  }

  eventListener() {
    for (let r = 0; r < totalRows; r += 1) {
      for (let c = 0; c < totalCols; c += 1) {
        let currNode = gridObject.grid[r][c];
        let currId = currNode.id;
        //Current Element in the grid
        let currElement = document.getElementById(currId);
        /**
        * Event Listeners  --mousedown
        *                  --mouseenter
        *                  --mouseup
        * helper           --mousePressed
        */
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
            /**
             * Means that the pressed node is a "Start" or "end"
             * User wants to move the start or end button
             */
            prevNode = moveSpecialNode(currNode);

            //set to default position
          } else if (mousePressed && pressedNodeStatus === "normal") {
            updateStatus(currNode);
          }
          e.preventDefault();
        });
        currElement.addEventListener("mouseup", (e) => {
          mousePressed = false;
          e.preventDefault();
        });
      }
    }
    /*-------  WEIGHTS  --------*/
    window.addEventListener("keydown", (e) => {
      //Return the key that is pressed
      keyDown = e.code;
    });
    window.addEventListener("keyup", () => {
      keyDown = false;
    });
  }
}

/**
 * Create Walls
 * 1) If the click is on the Start Node and it is being dragged then move the startNode
 * 2) If the click is on the End Node and it is being dragged then change position
 * 3) If the click is on a "unvisited" node then update "wall" and if dragged then createWalls
 * 4) If the click is on a "visited" node then update and make it a unvisted node.
*/

/**
 * Grid Object Creation
 */
let gridObject = new Grid();
gridObject.generateGrid();
gridObject.eventListener();

// Helper function used in eventListener() in Grid class
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
      if (startBtn.innerText !== "Start Breadth First Search") {
        element.className =
          currNode.weight !== 5 ? "unvisited-weight" : "unvisited";
        currNode.weight = element.className !== "unvisited-weight" ? 0 : 5;
        currNode.status = "unvisited";
        currNode.isClass = element.className;
      }
    }
  }
}

/**
 * moveSpecialNode (To reset start and end node)
 * 
 * Pressed down on the start node....update the next node that is traversed
 * But once the next node is hovered over with pressed down then the node is not updated---so update the
 * prevNode as the updated node
 */
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
      currNode.status !== "wall" &&
      (prevNode.status == "start" || prevNode.status == "end")
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

/**
 * Clear Grid function
 * 
 * @description leave only start node and end node
 */
let clearBtn = document.getElementById("clearBtn");

export function clearGrid() {
  let node = new Node();
  nodesToAnimate = [];
  resetTimer();
  countLength(0, "reset");
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      node = gridArray[r][c];
      let element = document.getElementById(node.id);
      //console.log(node);
      if (node.status !== "start" && node.status !== "end") {
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
      } else {
        node.distance = Infinity;
        node.parent = null;
        node.weight = 1;
        node.isVisited = false;
        node.f = Infinity;
        node.g = Infinity;
        node.h = Infinity;
        console.log(node, gridArray[r][c]);
      }
    }
  }
}
clearBtn.addEventListener("click", clearGrid);

/**
 * Clear Path function
 * 
 * @description leave only start node, end node, walls and weighted nodes
 */
let clearPathBtn = document.getElementById("clearPathBtn");

export function clearPath() {
  let node = new Node();
  resetTimer();
  countLength(0, "reset");
  nodesToAnimate = [];
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      node = gridArray[r][c];
      //console.log(node);
      let element = document.getElementById(node.id);
      if (
        node.status !== "start" &&
        node.status !== "end" &&
        node.status !== "wall" &&
        element.className !== "unvisited-weight"
      ) {
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
      } else if (node.status === "start" || node.status == "end") {
        node.distance = Infinity;
        node.parent = null;
        node.weight = 1;
        node.isVisited = false;
        node.f = Infinity;
        node.g = Infinity;
        node.h = Infinity;
      } else if (node.status === "wall") {
        continue;
      }
    }
  }
}
clearPathBtn.addEventListener("click", clearPath);

// Update start button text based on selected Algo
const algorithms = new Map([
  ["aStar", "A*"],
  ["greedyBFS", "Greedy Best-First Search"],
  ["dijkstra", "Dijkstra"],
  ["BFS", "Breadth-First Search"],
]);

const algoID = document.getElementById("accordion");

algoID.addEventListener("click", (e) => {
  const validID = ["aStar", "greedyBFS", "dijkstra", "BFS"];
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

/**
 * Draggable Feature for Instruction bar and Algo bar
 */
dragElement(document.getElementById("side-bar"));
dragElement(document.getElementById("info-bar"));

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
const removeWeights = () => {
  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalCols; j++) {
      //Get element
      let element = document.getElementById(gridArray[i][j].id);
      element.className =
        element.className !== "unvisited-weight"
          ? element.className
          : "unvisited";
    }
  }
};

/**
 * Start Button Controls (Algorithm calls)
 * 
 * BUTTONS -> EventListeners -> Algorithm Selection -> Algorithm Fetch
 */
const startAlgo = () => {
  let startBtnText = startBtn.innerText;
  switch (startBtnText) {
    case "Select an Algorithm": {
      startBtn.innerText = "Pick an Algorithm!";
      break;
    }
    case "Start A*": {
      clearPath();
      nodesToAnimate = [];
      pathFound = false;
      inProgress = false;
      if (aStar(nodesToAnimate, pathFound)) {
        //animateCells is returning a Promise that means we have to use .then
        animateCells(inProgress, nodesToAnimate, startBtnText, "aStar");
      } else {
        alert("Path does not exist!");
      }
      break;
    }
    case "Start Greedy Best-First Search": {
      clearPath();
      nodesToAnimate = [];
      pathFound = false;
      inProgress = false;
      if (greedyBFS(nodesToAnimate, pathFound)) {
        animateCells(inProgress, nodesToAnimate, startBtnText, "greedyBFS");
      } else {
        alert("Path does not exist!");
      }
      break;
    }
    case "Start Dijkstra": {
      clearPath();
      nodesToAnimate = [];
      pathFound = false;
      inProgress = false;
      if (dijkstra(nodesToAnimate, pathFound)) {
        animateCells(inProgress, nodesToAnimate, startBtnText, "dijkstra");
      } else {
        alert("Path does not exist!");
      }
      break;
    }
    case "Start Breadth-First Search": {
      clearPath();
      removeWeights();
      nodesToAnimate = [];
      pathFound = false;
      inProgress = false;
      if (BFS(nodesToAnimate, pathFound)) {
        animateCells(inProgress, nodesToAnimate, startBtnText, "BFS");
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
