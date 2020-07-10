// import { dijkstra } from "./dijkstra";
// import { aStar } from "./aStar";
//GLOBAL VARIABLES
var height = window.innerHeight * 0.8;
var width = window.innerWidth * 0.9;
var cellSize = 25;
var totalRows = Math.floor(height / cellSize) - 1;
var totalCols = Math.floor(width / cellSize) - 1;
let keyDown = false;
let mousePressed = false;
let gridArray = [];
let startRow = Math.floor(totalRows / 4);
let startCol = Math.floor(totalCols / 4);
let endRow = Math.floor((3 * totalRows) / 4);
let endCol = Math.floor((3 * totalCols) / 4);
let prevNode = null;
let nodesToAnimate = [];
let pressedNodeStatus = "normal";
let pathFound = false;

//Instantiate the grid
class Node {
  constructor(row, col, nodeClass, nodeId) {
    this.row = row;
    this.col = col;
    this.isClass = nodeClass;
    this.id = nodeId;
    this.status = nodeClass;
    //For Algorithm
    this.distance = Infinity;
    this.parent = null;
    //For heuristics
    this.f = Infinity;
    this.g = Infinity;
    this.h = Infinity;
    this.cost = 1;
  }
}
let startNode = new Node();
let endNode = new Node();
let copy_start = new Node();
let copy_end = new Node();
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

        //set to default position
      } else if (mousePressed && pressedNodeStatus === "normal") {
        updateStatus(currNode);
      }
    });
    currElement.addEventListener("mouseup", (e) => {
      //console.log("mouseup", currId);
      // if (pressedNodeStatus === "start") {
      //   copy_start = currNode;
      // } else if (pressedNodeStatus === "end") {
      //   cpoy_end = currNode;
      // }
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

class minHeap {
  constructor() {
    this.heap = [];
  }
  isEmpty = function () {
    return this.heap.length == 0;
  };
  clear = function () {
    this.heap = [];
    return;
  };
  getMin = function () {
    if (this.isEmpty()) {
      return null;
    }
    var min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap[this.heap.length - 1] = min;
    this.heap.pop();
    if (!this.isEmpty()) {
      this.siftDown(0);
    }
    return min;
  };
  push = function (item) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
    return;
  };
  parent = function (index) {
    if (index == 0) {
      return null;
    }
    return Math.floor((index - 1) / 2);
  };
  children = function (index) {
    return [index * 2 + 1, index * 2 + 2];
  };
  siftDown = function (index) {
    var children = this.children(index);
    var leftChildValid = children[0] <= this.heap.length - 1;
    var rightChildValid = children[1] <= this.heap.length - 1;
    var newIndex = index;
    if (leftChildValid && this.heap[newIndex][0] > this.heap[children[0]][0]) {
      newIndex = children[0];
    }
    if (rightChildValid && this.heap[newIndex][0] > this.heap[children[1]][0]) {
      newIndex = children[1];
    }
    // No sifting down needed
    if (newIndex === index) {
      return;
    }
    var val = this.heap[index];
    this.heap[index] = this.heap[newIndex];
    this.heap[newIndex] = val;
    this.siftDown(newIndex);
    return;
  };
  siftUp = function (index) {
    var parent = this.parent(index);
    if (parent !== null && this.heap[index][0] < this.heap[parent][0]) {
      var val = this.heap[index];
      this.heap[index] = this.heap[parent];
      this.heap[parent] = val;
      this.siftUp(parent);
    }
    return;
  };
}

//ALGORITHMS
const getSpecialNodes = () => {
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

function dijkstra() {
  let specialNodes = getSpecialNodes();
  startNode = specialNodes[0];
  endNode = specialNodes[1];
  let visitedNodesInOrder = [startNode];
  //Assign distance as 0 for startNode
  startNode.distance = 0;
  let currNode = new Node();
  currNode = startNode;
  //Get the unvisited nodes
  let unvisitedNodes = getUnvisitedNodes();
  while (unvisitedNodes.length) {
    //Get the neighbours
    let neighbours = getNeighbours(currNode);
    updateNeighbours(neighbours, currNode, "dijkstra");
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
      backtrack(startNode, endNode);
      break;
    }
    closestNode.status = "visited";
    //closestNode.isClass = "visited";
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

function getNeighbours(currNode) {
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
    }
  });
  return actual_neighbours;
}

function updateNeighbours(neighbours, currNode, algo) {
  if (algo === "dijkstra") {
    neighbours.forEach((neighbour) => {
      if (1 + currNode.distance < neighbour.distance) {
        neighbour.distance = 1 + currNode.distance;
        neighbour.parent = currNode;
      }
    });
  } else if (algo === "aStar") {
    neighbours.forEach((neighbour) => {
      var newGCost = 10 + currNode.g;
      // if (newGCost < neighbour.g) {
      //   neighbour.g = newGCost;
      //   neighbour.parent = currNode;
      // }
      let estimation_cost = getDistance(neighbour, endNode);
      let newCost = newGCost + estimation_cost;
      if (newCost < neighbour.f) {
        neighbour.g = newGCost;
        neighbour.f = newCost;
        neighbour.h = estimation_cost;
        neighbour.parent = currNode;
      }
    });
  }
}

//Astar Algorithm
function getDistance(nodeA, nodeB) {
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);
  if (dx > dy) {
    //Better results than using sqrt(2) and 1
    return 14 * dy + 10 * (dx - dy);
  }
  return 14 * dx + 10 * (dy - dx);
  //return dx + dy;
}

function backtrack(startNode, endNode) {
  nodesToAnimate.push(endNode);
  let currNode = new Node();
  currNode = endNode.parent;
  while (currNode !== startNode) {
    nodesToAnimate.push(currNode);
    currNode.status = "shortest";
    let element = document.getElementById(currNode.id);
    element.className = "shortest";
    currNode = currNode.parent;
  }
  nodesToAnimate.push(startNode);
  nodesToAnimate.reverse();
  return nodesToAnimate;
}
//Astar Algorithm

const aStar = () => {
  //Get the startNode and the endNode
  let specialNodes = getSpecialNodes();
  startNode = specialNodes[0];
  endNode = specialNodes[1];
  //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array
  let openList = new minHeap();
  let visitedNodesInOrder = [];
  //Update the distances of startNode
  //Distance of startNode from startNode
  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode);
  //Considering directions as only four
  startNode.f = startNode.g + startNode.h;
  //Push start node in the open List
  openList.push([startNode.f, startNode]);
  //nodesToAnimate.push([startNode, "searching"]);
  while (!openList.isEmpty()) {
    //The node having the lowest f value
    var currNode = new Node();
    let currArr = openList.getMin();
    currNode = currArr[1];
    //nodesToAnimate.push([currNode, "searching"]);
    visitedNodesInOrder.push(currNode);
    //Check if the endNode
    if (currNode === endNode) {
      return backtrack(startNode, endNode);
    }
    if (currNode.status !== "start") {
      console.log(currNode);
      currNode.status = "visited";
    }
    //get element
    let element = document.getElementById(currNode.id);
    if (element.className !== "start" || element.className !== "end") {
      element.className = "visited";
    }
    //nodesToAnimate.push([currNode, "visited"]);
    var neighbours = getNeighbours(currNode);
    updateNeighbours(neighbours, currNode, "aStar");
    for (let i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      // if (!openList.includes(neighbour)) {
      openList.push([neighbour.f, neighbour]);
      // }
    }
  }
  alert("No Path Exists");
  return;
};

/* ------------ BFS Algorithm ------ */

function BFS() {
  let myQueue = new Queue();
  let specialNodes = getSpecialNodes();
  startNode = specialNodes[0];
  endNode = specialNodes[1];
  // console.log(startNode, endNode);
  myQueue.enqueue(gridArray[startNode.row][startNode.col]);
  gridArray[startNode.row][startNode.col].isVisited = true;
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new Node;
  // console.log(myQueue.items.length);
  while (!myQueue.empty()) {
    currNode = myQueue.dequeue();
    // console.log(currNode);
    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([gridArray[currNode.row][currNode.col], "visited"]);
    if (r == endNode.row && c == endNode.col) {
      pathFound = true;
      break;
    }
    var neighbours = getNeighbours(r, c);
    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];
      if (gridArray[m][n].isVisited || gridArray[m][n].status == "wall") {
        continue;
      }
      gridArray[m][n].isVisited = true;
      gridArray[m][n].parent = currNode;
      nodesToAnimate.push([gridArray[m][n], "searching"]);
      myQueue.enqueue(gridArray[m][n]);
    }
  }

  if (pathFound) {
    nodesToAnimate.push([gridArray[endNode.row][endNode.col], "shortest"]);
    while (currNode.parent != null) {
      var prevNode = currNode.parent;
      nodesToAnimate.push([gridArray[prevNode.row][prevNode.col], "shortest"]);
      currNode = prevNode;
    }
  }
  return pathFound;
}

async function animateCells() {
  inProgress = true;
  var cells = document.getElementsByTagName("td");
  var startNodeIndex = gridArray[startNode.row] * totalCols + gridArray[startNode.col];
  var endNodeIndex = gridArray[endNode.row] * totalCols + gridArray[endNode.col];

  for (var i = 0; i < nodesToAnimate.length; i++) {
    var nodeCoordinates = nodesToAnimate[i][0];
    var x = nodeCoordinates.row;
    var y = nodeCoordinates.col;
    var num = x * totalCols + y;
    if (num == startNodeIndex || num == endNodeIndex) {
      continue;
    }
    var cell = cells[num];
    var colorClass = nodesToAnimate[i][1]; // success, visited or searching
    // Wait until its time to animate
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (cell.className == "start" || cell.className == "end") {
      continue;
    } else cell.className = colorClass;
  }

  nodesToAnimate = [];
  inProgress = false;
  justFinished = true;

  return new Promise(resolve => resolve(true));
}

function getNeighbours(i, j) {
  var neighbors = [];
  if (i > 0) {
    neighbors.push([i - 1, j]);
  }
  if (j > 0) {
    neighbors.push([i, j - 1]);
  }
  if (i < totalRows - 1) {
    neighbors.push([i + 1, j]);
  }
  if (j < totalCols - 1) {
    neighbors.push([i, j + 1]);
  }
  return neighbors;
}

const startAlgo = () => {
  let startBtnText = startBtn.innerText;
  switch (startBtnText) {
    case "Start Visualization": {
      startBtn.innerText = "Pick an Algorithm!";
      break;
    }
    case "Start A*": {
      aStar(nodesToAnimate, gridArray);
      break;
    }
    case "Start Dijkstra": {
      dijkstra(nodesToAnimate, gridArray);
      break;
    }
    case "Start Breadth First Search": {
      if(BFS()) {
        animateCells();
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

