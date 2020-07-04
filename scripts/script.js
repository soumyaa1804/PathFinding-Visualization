// /* Variables */

// var height = window.innerHeight * 0.8;
// var width = window.innerWidth * 0.9;
// var cellSize = 25;
// var totalRows = Math.floor(height / cellSize) - 1;
// var totalCols = Math.floor(width / cellSize) - 1;
// var inProgress = false;
// var cellsToAnimate = [];
// var createWalls = false;
// var algorithm = null;
// var justFinished = false;
// var animationSpeed = "Fast";
// var animationState = null;
// var startCell = [Math.floor(totalRows / 4), Math.floor(totalCols / 4)];
// var endCell = [
//   Math.floor((3 * totalRows) / 4),
//   Math.floor((3 * totalCols) / 4),
// ];
// var movingStart = false;
// var movingEnd = false;

// /* Generate Grid */

// function generateGrid(rows, cols) {
//   var grid = `<table>`;
//   for (row = 1; row <= rows; row++) {
//     grid += `<tr>`;
//     for (col = 1; col <= cols; col++) {
//       let output = "cell";
//       grid += `<td class = "${output}"></td>`;
//     }
//     grid += `</tr>`;
//   }
//   grid += `</table>`;
//   return grid;
// }

// let grid = generateGrid(totalRows, totalCols);
// document.getElementById("tableContainer").innerHTML = grid;

var height = window.innerHeight * 0.8;
var width = window.innerWidth * 0.9;
var cellSize = 25;
var totalRows = Math.floor(height / cellSize) - 1;
var totalCols = Math.floor(width / cellSize) - 1;
// var inProgress = false;
// var cellsToAnimate = [];
// var createWalls = false;
// var algorithm = null;
// var justFinished = false;
// var animationSpeed = "Fast";
// var animationState = null;
let keyDown = false;
let mousePressed = false;
let gridArray = [];
let startRow = Math.floor(totalRows / 4);
let startCol = Math.floor(totalCols / 4);
let endRow = Math.floor((3 * totalRows) / 4);
let endCol = Math.floor((3 * totalCols) / 4);

//Instantiate the grid
class Node {
  constructor(row, col, nodeClass, nodeId) {
    this.row = row;
    this.col = col;
    this.isStart = false;
    this.isFinish = false;
    this.isWall = false;
    this.isVisited = false;
    this.isClass = nodeClass;
    this.id = nodeId;
    this.status = nodeClass;
  }
}

//Generate the grid

class Grid {
  constructor() {
    this.grid;
  }
  generateGrid(totalRows, totalCols) {
    // grid += `<table>`;
    for (let row = 0; row < totalRows; row++) {
      let currRow = [];
      grid += `<tr>`;
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
        grid += `<td class = ${new_nodeClass} id = ${new_nodeId}></td>`;
        currRow.push(node);
      }
      grid += `</tr>`;
      gridArray.push(currRow);
    }
    grid = `<table>` + grid + `</table>`;
    return grid;
  }
}
let grid = new Grid();
grid.generateGrid(totalRows, totalCols);
document.getElementById("tableContainer").innerHTML = grid;
//Create Walls
/* 1) If the click is on the Start Node and it is being dragged then move the startNode
   2) If the click is on the End Node and it is being dragged then change position
   3) If the click is on a "unvisited" node then update "wall" and if dragged then createWalls
   4) If the click is on a "visited" node then update and make it a unvisted node.*/
//console.log(document.getElementById("1-1"));

for (let r = 0; r < totalRows; r += 1) {
  for (let c = 0; c < totalCols; c += 1) {
    let currId = `${r}-${c}`;
    //Current Node in the gridArray
    let currNode = getNode(currId);
    //Current Element in the grid
    let currElement = document.getElementById(currId);

    //  # Event Listeners --mousedown
    //                      --mouseenter
    //                      --mouseup
    //             helper  --mousePressed

    currElement.addEventListener("mousedown", () => {
      mousePressed = true;
      if (currNode.status === "start" || currNode.status === "end") {
        pressedNodeStatus = currNode.status;
      } else {
        pressedNodeStatus = "normal";
        //Manipulate the normal node - convert to "WALL" or "A normal node"
        updateStatus(currNode);
      }
    });
    currElement.addEventListener("mouseup", (e) => {
      if (pressedNodeStatus === "start") {
        start = currId;
      } else if (board.pressedNodeStatus === "end") {
        object = currId;
      }
      pressedNodeStatus = "normal";
    });
    currElement.addEventListener("mouseenter", (e) => {});
  }
}
function getNode(id) {
  let info = id.split("-");
  let row = parseInt(info[0]);
  let col = parseInt(info[1]);
  return gridArray[row][col];
}
function updateStatus(currNode) {
  let element = document.getElementById(currNode.id);
  console.log(element, currNode);
  relevantStatuses = ["start", "end"];
  if (!keyDown) {
    if (!relevantStatuses.includes(currNode.status)) {
      element.className = currNode.status !== "wall" ? "wall" : "unvisited";
      currNode.status = element.className !== "wall" ? "unvisited" : "wall";
    }
  }
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
/*-- Class Declarations  -- */
/*------------------------- */

/* -------- Queue ------- */

class Queue {
  constructor() {
    this.items = new Array();
  }

  dequeue() {
    return this.items.shift();
  }

  enqueue(element) {
    this.items.push(element);
    return;
  }

  empty() {
    return this.items.length === 0;
  }

  clear() {
    this.items = new Array();
    return;
  }
}

/* ------ MinHeap ------ (Not completed yet) */

class MinHeap {
  constructor() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  clear() {
    this.heap = [];
  }

  getMin() {
    if (this.isEmpty()) {
      return null;
    }
    var min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap[this.heap.length - 1] = min;
    return min;
  }
}

/* ------------------------- */
/* ---- MOUSE FUNCTIONS ---- */
/* ------------------------- */

//Getting only one cell that is cell[0][0]
// document
//   .querySelector("#tableContainer")
//   .addEventListener("mousedown", HandleMousedown);
// function HandleMousedown(e) {
//   console.log("mousedown");
//   e.preventDefault();
// }
// $("td").mousedown(function () {
//   var index = $("td").index(this);
//   var startCellIndex = startCell[0] * totalCols + startCell[1];
//   var endCellIndex = endCell[0] * totalCols + endCell[1];
//   if (!inProgress) {
//     // Clear board if just finished
//     if (justFinished && !inProgress) {
//       clearBoard((keepWalls = true));
//       justFinished = false;
//     }
//     if (index == startCellIndex) {
//       movingStart = true;
//       //console.log("Now moving start!");
//     } else if (index == endCellIndex) {
//       movingEnd = true;
//       //console.log("Now moving end!");
//     } else {
//       createWalls = true;
//     }
//   }
// });
