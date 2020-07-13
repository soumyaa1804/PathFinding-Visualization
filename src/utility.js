import { gridArray, totalRows, totalCols } from "./script.js";
import { start } from "./timer.js";
/* -------- Queue ------- */
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
/*------ Min Heap ----- */

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
/*-------getSpecialNodes------*/
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
/*------------getNeighbours------------*/
export function getNeighbours(currNode) {
  let r = currNode.row;
  let c = currNode.col;
  let relevantStatuses = ["start", "wall"];
  let actual_neighbours = [];
  let neighbours = [];
  if (r - 1 >= 0) {
    neighbours.push(gridArray[r - 1][c]);
    if (c - 1 >= 0) {
      if (
        gridArray[r - 1][c].status !== "wall" &&
        gridArray[r][c - 1].status !== "wall"
      )
        neighbours.push(gridArray[r - 1][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      if (
        gridArray[r - 1][c].status !== "wall" &&
        gridArray[r][c + 1].status !== "wall"
      )
        neighbours.push(gridArray[r - 1][c + 1]);
    }
  }
  if (r + 1 <= totalRows - 1) {
    neighbours.push(gridArray[r + 1][c]);
    if (c - 1 >= 0) {
      if (
        gridArray[r + 1][c - 1].status !== "wall" &&
        gridArray[r + 1][c].status !== "wall"
      ) {
        neighbours.push(gridArray[r + 1][c - 1]);
      }
      neighbours.push(gridArray[r][c - 1]);
    }
    if (c + 1 <= totalCols - 1) {
      if (
        gridArray[r][c + 1].status !== "wall" &&
        gridArray[r + 1][c].status !== "wall"
      ) {
        neighbours.push(gridArray[r + 1][c + 1]);
      }
      neighbours.push(gridArray[r][c + 1]);
    }
  }
  neighbours.forEach((neighbour) => {
    if (!relevantStatuses.includes(neighbour.status) && !neighbour.isVisited) {
      actual_neighbours.push(neighbour);
    }
  });
  return actual_neighbours;
}
/*---------Animation-------*/
export async function animateCells(inProgress, nodesToAnimate) {
  start();
  inProgress = true;
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
      if (cell.className == "end") {
        start();
      }
      continue;
    } else cell.className = colorClass;
  }
  nodesToAnimate = [];
  inProgress = false;
  // justFinished = true;

  return new Promise((resolve) => resolve(true));
}
