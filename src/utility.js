/**
 * Contents:
 * 
 * -Imports
 * -Queue class
 * -Min Heap class
 * -getSpecialNode() get updated start and end node after dragging them
 * -countLength() count length of the path
 * -getNeighbour()
 * -animateCells()
 * -toggleScreen() (Disable items when animation is in progress)
 */

/**
 * Imports
 */
import { gridArray, totalRows, totalCols } from "./script.js";
import { start } from "./timer.js";

/**
 * Queue class
 *  -dequeue() returns first element added
 *  -enqueue()
 *  -empty() @returns true/false
 *  -clear()
 */
export class Queue {
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

/**
 * Min heap class
 *  -isEmpty()
 *  -clear()
 *  -getMin() 
 *  -push() @param {Array} item Array of type [number, Node] 
 */
export class minHeap {
  constructor() {
    this.heap = [];
  }
  isEmpty() {
    return this.heap.length == 0;
  }
  clear() {
    this.heap = [];
    return;
  }
  getMin() {
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
  }
  push(item) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
    return;
  }
  parent(index) {
    if (index == 0) {
      return null;
    }
    return Math.floor((index - 1) / 2);
  }
  children(index) {
    return [index * 2 + 1, index * 2 + 2];
  }
  siftDown(index) {
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
  }
  siftUp(index) {
    var parent = this.parent(index);
    if (parent !== null && this.heap[index][0] < this.heap[parent][0]) {
      var val = this.heap[index];
      this.heap[index] = this.heap[parent];
      this.heap[parent] = val;
      this.siftUp(parent);
    }
    return;
  }
}

/**
 * @description get updated start and end node
 * 
 * @returns array of nodes containing start and end nodes
 */
export const getSpecialNodes = () => {
  let copy_start = null;
  let copy_end = null;
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

/**
 * @description Count length of distance
 * 
 * @param {number} count Distance count
 * @param {string} algoId Algo id or else "reset" to reset the count
 */
export function countLength(count, algoId) {
  if (algoId === "aStar") {
    document.getElementById(
      "aStarCount"
    ).innerHTML = `Distance Count: ${count}`;
  } else if (algoId === "greedyBFS") {
    document.getElementById(
      "greedyBFSCount"
    ).innerHTML = `Distance Count: ${count}`;
  } else if (algoId === "dijkstra") {
    document.getElementById(
      "dijkstraCount"
    ).innerHTML = `Distance Count: ${count}`;
  } else if (algoId === "BFS") {
    document.getElementById("BFSCount").innerHTML = `Distance Count: ${count}`;
  } else {
    // To reset the count on Clear Path and Clear Grid
    let countElement = document.getElementsByClassName("count");
    for (let i = 0; i < countElement.length; i++) {
      countElement[i].innerText = `Distance Count: ${count}`;
    }
  }
}

/**
 * @description Returns neighbours of a node according
 *              to if diagonal movement is allowed or not.
 *
 * @param {number} i row index of node
 * @param {numbet} j column index of node
 */
export function getNeighbours(i, j) {
  let neighbours = [];
  // direction vectors
  // 0-3: East, South, West, North
  // 4-7: South-East, North-East, South-West, North-West
  const dx = [1, 0, -1, 0, 1, 1, -1, -1];
  const dy = [0, 1, 0, -1, 1, -1, 1, -1];
  const diagonal = document.getElementById("diagonal-flag").checked;

  let length; // length of direction vector
  if (diagonal === false) {
    length = 4;
  } else length = 8;

  for (let d = 0; d < length; d++) {
    let rr = i + dx[d];
    let cc = j + dy[d];
    if (rr >= 0 && rr < totalRows && cc >= 0 && cc < totalCols) {
      if (gridArray[rr][cc].isVisited || gridArray[rr][cc].status === "wall") {
        continue;
      } // if d < 4, push elements else if d >= 4, check for diagonal walls
      else if (d < 4) {
        neighbours.push([rr, cc]);
      } else if (
        d === 4 &&
        gridArray[i][j + 1].status !== "wall" &&
        gridArray[i + 1][j].status !== "wall"
      ) {
        neighbours.push([rr, cc]);
      } else if (
        d === 5 &&
        gridArray[i][j - 1].status !== "wall" &&
        gridArray[i + 1][j].status !== "wall"
      ) {
        neighbours.push([rr, cc]);
      } else if (
        d === 6 &&
        gridArray[i - 1][j].status !== "wall" &&
        gridArray[i][j + 1].status !== "wall"
      ) {
        neighbours.push([rr, cc]);
      } else if (
        d === 7 &&
        gridArray[i - 1][j].status !== "wall" &&
        gridArray[i][j - 1].status !== "wall"
      ) {
        neighbours.push([rr, cc]);
      }
    }
  }
  return neighbours;
}

/**
 * @description Animate all the cells that are added to
 *              nodesToAnimate array according to their status.
 *
 * @param {boolean} inProgress If animation is in progress
 * @param {array} nodesToAnimate Array containing nodes along with their status
 * @param {string} startbtnText Text on start button
 * @param {string} algo Id of algo selected
 * @return {Promise} represents the completion of an asynchronous operation
 */
export async function animateCells(
  inProgress,
  nodesToAnimate,
  startbtnText,
  algo
) {
  let count = 1;
  start(startbtnText);
  console.log("animation started");
  inProgress = true;
  toggleScreen(inProgress);
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < nodesToAnimate.length; i++) {
    var nodeCoordinates = nodesToAnimate[i][0];
    var x = nodeCoordinates.row;
    var y = nodeCoordinates.col;
    var num = x * totalCols + y;
    var cell = cells[num];
    var colorClass = nodesToAnimate[i][1]; // success, visited or searching
    // Wait until its time to animate
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (cell.className == "start" || cell.className == "end") {
      if (cell.className == "end" && colorClass === "shortest") {
        start(startbtnText);
        console.log("End reached!");
      }
      continue;
    } else cell.className = colorClass;

    // Update count
    if (colorClass == "shortest") {
      count++;
      countLength(count, algo);
    }
  }
  nodesToAnimate = [];
  inProgress = false;
  toggleScreen(inProgress);
  return new Promise((resolve) => resolve(true));
}

/**
 * @description Disable each cell of the grid and all buttons
 *              if animation is in progress
 * 
 * @param {boolean} inProgress
 */
function toggleScreen(inProgress) {
  if (inProgress) {
    //Get the elements
    //Start Button disable
    document.getElementById("startBtn").disabled = true; //clear Path disable
    document.getElementById("clearPathBtn").disabled = true;
    //clear grid disable
    document.getElementById("clearBtn").disabled = true;
    document.getElementById("diagonal-flag").disabled = true;
    const tds = document.querySelectorAll("td");
    tds.forEach((td) => (td.style.pointerEvents = "none"));
  } else {
    //Get the elements
    //Start Button enable
    document.getElementById("startBtn").disabled = false;
    //clear Path enable
    document.getElementById("clearPathBtn").disabled = false;
    //clear grid enable
    document.getElementById("clearBtn").disabled = false;
    document.getElementById("diagonal-flag").disabled = false;
    const tds = document.querySelectorAll("td");
    tds.forEach((td) => (td.style.pointerEvents = "all"));
  }
}

/* Animate instruction icon on click */
let icon = document.getElementById("info-icon");
icon.addEventListener("click", rotateIcon);
let i = true;
function rotateIcon() {
  if (i == true) {
    icon.className = "fa fa-chevron-up rotate down";
  } else {
    icon.className = "fa fa-chevron-up rotate";
  }
  i = !i;
}
