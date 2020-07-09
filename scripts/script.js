//GLOBAL VARIABLES
var height = window.innerHeight * 0.8;
var width = window.innerWidth * 0.9;
var cellSize = 25;
var totalRows = Math.floor(height / cellSize) - 1;
var totalCols = Math.floor(width / cellSize) - 1;
let end = null;
let start = null;
let keyDown = false;
let mousePressed = false;
let gridArray = [];
let startRow = Math.floor(totalRows / 4);
let startCol = Math.floor(totalCols / 4);
let endRow = Math.floor((3 * totalRows) / 4);
let endCol = Math.floor((3 * totalCols) / 4);
let prevNode = null;
let prevNodeFlag = true;

//Instantiate the grid
class Node {
  constructor(row, col, nodeClass, nodeId) {
    this.row = row;
    this.col = col;
    this.isClass = nodeClass;
    this.id = nodeId;
    this.status = nodeClass;
    //For algorithms
    this.distance = Infinity;
    this.parent = null;
  }
}

//Generate the grid

class Grid {
  grid;
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
    //let currId = `${r}-${c}`;
    //Current Node in the gridArray
    //let currNode = getNode(currId);
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
        //Manipulate the normal node - convert to "WALL" or "A normal node"
        updateStatus(currNode);
      }
      e.preventDefault();
    });
    currElement.addEventListener("mouseenter", (e) => {
      if (mousePressed && pressedNodeStatus !== "normal") {
        //Means that the pressed node is a "Start" or "end"
        //User wants to move the start or end button
        prevNode = moveSpecialNode(currNode);
      } else if (mousePressed && pressedNodeStatus === "normal") {
        updateStatus(currNode);
      }
    });
    currElement.addEventListener("mouseup", (e) => {
      //console.log("mouseup", currId);
      mousePressed = false;
    });
  }
}

// function getNode(id) {
//   let info = id.split("-");
//   let row = parseInt(info[0]);
//   let col = parseInt(info[1]);
//   return gridArray[row][col];
// }

function updateStatus(currNode) {
  let element = document.getElementById(currNode.id);
  relevantStatuses = ["start", "end"];
  if (!keyDown) {
    if (!relevantStatuses.includes(currNode.status)) {
      element.className = currNode.status !== "wall" ? "wall" : "unvisited";
      currNode.status = element.className !== "wall" ? "unvisited" : "wall";
      currNode.isClass = currNode.status;
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

/* BUTTONS ----> EventListeners -----> Algorithm Selection -----> Algorithm Fetch*/
/* Parameters will be startNode,endNode,gridArray and the grid*/

//Clear Grid
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

//Invoked when start visualizing is 'CLICKED'
getSpecialNodes = () => {
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      if (
        gridArray[r][c].status === "start" &&
        gridArray[r][c].isClass === "start"
      ) {
        copy_start = gridArray[r][c];
      } else if (
        gridArray[r][c].status === "end" &&
        gridArray[r][c].isClass === "end"
      ) {
        copy_end = gridArray[r][c];
      }
    }
  }
  let valid_buttons = [copy_start, copy_end];
  return valid_buttons;
};

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

/*------ Min Heap ----- */

/*class MinHeap {
  heap;
  constructor() {
    this.heap = [null];
  }

  insert = (num) => {
    this.heap.push(num);
    if (this.heap.length > 2) {
      let idx = this.heap.length - 1;
      while (this.heap[idx] < this.heap[Math.floor(idx / 2)]) {
        if (idx >= 1) {
          [this.heap[Math.floor(idx / 2)], this.heap[idx]] = [
            this.heap[idx],
            this.heap[Math.floor(idx / 2)],
          ];
          if (Math.floor(idx / 2) > 1) {
            idx = Math.floor(idx / 2);
          } else {
            break;
          }
        }
      }
    }
  };

  remove = () => {
    let smallest = this.heap[1];
    if (this.heap.length > 2) {
      this.heap[1] = this.heap[this.heap.length - 1];
      this.heap.splice(this.heap.length - 1);
      if (this.heap.length == 3) {
        if (this.heap[1] > this.heap[2]) {
          [this.heap[1], this.heap[2]] = [this.heap[2], this.heap[1]];
        }
        return smallest;
      }
      let i = 1;
      let left = 2 * i;
      let right = 2 * i + 1;
      while (
        this.heap[i] >= this.heap[left] ||
        this.heap[i] >= this.heap[right]
      ) {
        if (this.heap[left] < this.heap[right]) {
          [this.heap[i], this.heap[left]] = [this.heap[left], this.heap[i]];
          i = 2 * i;
        } else {
          [this.heap[i], this.heap[right]] = [this.heap[right], this.heap[i]];
          i = 2 * i + 1;
        }
        left = 2 * i;
        right = 2 * i + 1;
        if (this.heap[left] == undefined || this.heap[right] == undefined) {
          break;
        }
      }
    } else if (this.heap.length == 2) {
      this.heap.splice(1, 1);
    } else {
      return null;
    }
    return smallest;
  };
}*/

/* ------------------------*/
/*-------ALGORITHMS---------*/
/*--------------------------------------------------------------------------------------------*/
//ALGORITHMS
function dijkstra() {
  let specialNodes = getSpecialNodes();
  startNode = specialNodes[0];
  endNode = specialNodes[1];
  console.log(startNode, endNode);
  let visitedNodesInOrder = [startNode];
  //Assign distance as 0 for startNode
  startNode.distance = 0;
  let currNode = new Node();
  currNode = startNode;
  //Get the unvisited nodes
  let unvisitedNodes = getUnvisitedNodes();
  while (unvisitedNodes.length) {
    //Get the neighbours
    let neighbours = updateNeighbours(currNode);
    unvisitedNodes.sort((a, b) => {
      return a.distance - b.distance;
    });
    // if (unvisitedNodes[0].distance === 1) {
    //   unvisitedNodes[0].parent = startNode;
    // }
    let closestNode = unvisitedNodes.shift();
    //Check if distnace is infintiy---no path exists
    if (closestNode.distance === Infinity) {
      break;
    }
    visitedNodesInOrder.push(closestNode);
    //Update the status of the closest node as visited
    if (closestNode.status === "end") {
      shortestPath = backtrack(visitedNodesInOrder);
      console.log(shortestPath);
      break;
    }
    closestNode.status = "visited";
    closestNode.isClass = "visited";
    let element = document.getElementById(closestNode.id);
    element.className = "visited";
    //Check if the end point
    unvisitedNodes = getUnvisitedNodes();
    currNode = closestNode;
  }
}
function getUnvisitedNodes() {
  let nodes = [];
  let relevantStatuses = ["start", "wall", "visited"];
  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalCols; j++) {
      if (!relevantStatuses.includes(gridArray[i][j].status)) {
        nodes.push(gridArray[i][j]);
      }
    }
  }
  return nodes;
}
function backtrack(nodes) {
  let nodesToAnimate = [endNode];
  //Provided that it is a visted node
  let node = new Node();
  node = endNode.parent;
  //console.log(node);
  while (node != startNode) {
    if (nodes.includes(node)) {
      node.isClass = "shortest";
      node.status = "shortest";
      let element = document.getElementById(node.id);
      element.className = "shortest";
      nodesToAnimate.push(node);
      node = node.parent;
    }
  }
  nodesToAnimate.push(startNode);
  //nodesToAnimate.reverse();
  return nodesToAnimate;
}
function updateNeighbours(currNode) {
  let r = currNode.row;
  let c = currNode.col;
  let relevantStatuses = ["start", "wall", "visited"];
  let actual_neighbours = [];
  let neighbours = [];
  if (r - 1 >= 0) {
    neighbours.push(gridArray[r - 1][c]);
    // if (c - 1 >= 0) {
    //   neighbours.push(gridArray[r - 1][c - 1]);
    // }
    // if (c + 1 <= totalCols - 1) {
    //   neighbours.push(gridArray[r - 1][c + 1]);
    // }
  }
  if (r + 1 <= totalRows - 1) {
    neighbours.push(gridArray[r + 1][c]);
    if (c - 1 >= 0) {
      //gridArray[r + 1][c - 1],
      neighbours.push(gridArray[r][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      //gridArray[r + 1][c + 1]
      neighbours.push(gridArray[r][c + 1]);
    }
  }
  neighbours.forEach((neighbour) => {
    if (!relevantStatuses.includes(neighbour.status)) {
      actual_neighbours.push(neighbour);
      if (1 + currNode.distance < neighbour.distance) {
        neighbour.distance = 1 + currNode.distance;
        neighbour.parent = currNode;
      }
    }
  });
  return actual_neighbours;
}
// function UpdateDistanceFromStart(startNode, neighbours) {
//   neighbours.forEach((node) => {
//     let dx = abs(startNode.row - node.row);
//     let dy = abs(startNode.col - node.col);
//     let minimum = min(dx, dy);
//     let maximum = min(dx, dy);
//     let diagnol_movement = minimum;
//     let straight_movement = maximum;
//     nodes.distance = sqrt(2) + diagnol_movement + straight_movement;
//   });
// }

//REFERENCE

// const algorithms = new Map([
//   ["aStar", "A*"],
//   ["dijkstra", "Dijkstra"],
//   ["GBFS", "Greedy Best First Search"],
//   ["BFS", "Breadth First Search"],
//   ["DFS", "Depth First Search"],
//   ["JPS", "Jump Point Search"],
// ]);
const startAlgo = () => {
  if (startBtn.value === "Start Visualization") {
    alert("Pick an algorithm");
  } else {
    if (startBtn.innerText === "Start Dijkstra") {
      console.log("dijkstra");
      dijkstra();
    }
  }
};

startBtn.addEventListener("click", startAlgo);
