"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecialNodes = exports.minHeap = exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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


exports.countLength = countLength;
exports.getNeighbours = getNeighbours;
exports.animateCells = animateCells;

var _script = require("./script.js");

var _timer = require("./timer.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Queue class
 *  -dequeue() returns first element added
 *  -enqueue()
 *  -empty() @returns true/false
 *  -clear()
 */
var Queue = exports.Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this.items = new Array();
  }

  _createClass(Queue, [{
    key: "dequeue",
    value: function dequeue() {
      return this.items.shift();
    }
  }, {
    key: "enqueue",
    value: function enqueue(element) {
      this.items.push(element);
      return;
    }
  }, {
    key: "empty",
    value: function empty() {
      return this.items.length === 0;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.items = new Array();
      return;
    }
  }]);

  return Queue;
}();

/**
 * Min heap class
 *  -isEmpty()
 *  -clear()
 *  -getMin() 
 *  -push() @param {Array} item Array of type [number, Node] 
 */


var minHeap = exports.minHeap = function () {
  function minHeap() {
    _classCallCheck(this, minHeap);

    this.heap = [];
  }

  _createClass(minHeap, [{
    key: "isEmpty",
    value: function isEmpty() {
      return this.heap.length == 0;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.heap = [];
      return;
    }
  }, {
    key: "getMin",
    value: function getMin() {
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
  }, {
    key: "push",
    value: function push(item) {
      this.heap.push(item);
      this.siftUp(this.heap.length - 1);
      return;
    }
  }, {
    key: "parent",
    value: function parent(index) {
      if (index == 0) {
        return null;
      }
      return Math.floor((index - 1) / 2);
    }
  }, {
    key: "children",
    value: function children(index) {
      return [index * 2 + 1, index * 2 + 2];
    }
  }, {
    key: "siftDown",
    value: function siftDown(index) {
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
  }, {
    key: "siftUp",
    value: function siftUp(index) {
      var parent = this.parent(index);
      if (parent !== null && this.heap[index][0] < this.heap[parent][0]) {
        var val = this.heap[index];
        this.heap[index] = this.heap[parent];
        this.heap[parent] = val;
        this.siftUp(parent);
      }
      return;
    }
  }]);

  return minHeap;
}();

/**
 * @description get updated start and end node
 * 
 * @returns array of nodes containing start and end nodes
 */


var getSpecialNodes = exports.getSpecialNodes = function getSpecialNodes() {
  var copy_start = null;
  var copy_end = null;
  for (var r = 0; r < _script.totalRows; r++) {
    for (var c = 0; c < _script.totalCols; c++) {
      if (_script.gridArray[r][c].status === "start" && _script.gridArray[r][c].isClass === "start") {
        copy_start = _script.gridArray[r][c];
      } else if (_script.gridArray[r][c].status === "end" && _script.gridArray[r][c].isClass === "end") {
        copy_end = _script.gridArray[r][c];
      }
    }
  }
  var valid_buttons = [copy_start, copy_end];
  return valid_buttons;
};

/**
 * @description Count length of distance
 * 
 * @param {number} count Distance count
 * @param {string} algoId Algo id or else "reset" to reset the count
 */
function countLength(count, algoId) {
  if (algoId === "aStar") {
    document.getElementById("aStarCount").innerHTML = "Distance Count: " + count;
  } else if (algoId === "greedyBFS") {
    document.getElementById("greedyBFSCount").innerHTML = "Distance Count: " + count;
  } else if (algoId === "dijkstra") {
    document.getElementById("dijkstraCount").innerHTML = "Distance Count: " + count;
  } else if (algoId === "BFS") {
    document.getElementById("BFSCount").innerHTML = "Distance Count: " + count;
  } else {
    // To reset the count on Clear Path and Clear Grid
    var countElement = document.getElementsByClassName("count");
    for (var _i = 0; _i < countElement.length; _i++) {
      countElement[_i].innerText = "Distance Count: " + count;
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
function getNeighbours(i, j) {
  var neighbours = [];
  // direction vectors
  // 0-3: East, South, West, North
  // 4-7: South-East, North-East, South-West, North-West
  var dx = [1, 0, -1, 0, 1, 1, -1, -1];
  var dy = [0, 1, 0, -1, 1, -1, 1, -1];
  var diagonal = document.getElementById("diagonal-flag").checked;

  var length = void 0; // length of direction vector
  if (diagonal === false) {
    length = 4;
  } else length = 8;

  for (var d = 0; d < length; d++) {
    var rr = i + dx[d];
    var cc = j + dy[d];
    if (rr >= 0 && rr < _script.totalRows && cc >= 0 && cc < _script.totalCols) {
      if (_script.gridArray[rr][cc].isVisited || _script.gridArray[rr][cc].status === "wall") {
        continue;
      } // if d < 4, push elements else if d >= 4, check for diagonal walls
      else if (d < 4) {
          neighbours.push([rr, cc]);
        } else if (d === 4 && _script.gridArray[i][j + 1].status !== "wall" && _script.gridArray[i + 1][j].status !== "wall") {
          neighbours.push([rr, cc]);
        } else if (d === 5 && _script.gridArray[i][j - 1].status !== "wall" && _script.gridArray[i + 1][j].status !== "wall") {
          neighbours.push([rr, cc]);
        } else if (d === 6 && _script.gridArray[i - 1][j].status !== "wall" && _script.gridArray[i][j + 1].status !== "wall") {
          neighbours.push([rr, cc]);
        } else if (d === 7 && _script.gridArray[i - 1][j].status !== "wall" && _script.gridArray[i][j - 1].status !== "wall") {
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
async function animateCells(inProgress, nodesToAnimate, startbtnText, algo) {
  var count = 1;
  (0, _timer.start)(startbtnText);
  console.log("animation started");
  inProgress = true;
  toggleScreen(inProgress);
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < nodesToAnimate.length; i++) {
    var nodeCoordinates = nodesToAnimate[i][0];
    var x = nodeCoordinates.row;
    var y = nodeCoordinates.col;
    var num = x * _script.totalCols + y;
    var cell = cells[num];
    var colorClass = nodesToAnimate[i][1]; // success, visited or searching
    // Wait until its time to animate
    await new Promise(function (resolve) {
      return setTimeout(resolve, 5);
    });
    if (cell.className == "start" || cell.className == "end") {
      if (cell.className == "end" && colorClass === "shortest") {
        (0, _timer.start)(startbtnText);
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
  return new Promise(function (resolve) {
    return resolve(true);
  });
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
    var tds = document.querySelectorAll("td");
    tds.forEach(function (td) {
      return td.style.pointerEvents = "none";
    });
  } else {
    //Get the elements
    //Start Button enable
    document.getElementById("startBtn").disabled = false;
    //clear Path enable
    document.getElementById("clearPathBtn").disabled = false;
    //clear grid enable
    document.getElementById("clearBtn").disabled = false;
    document.getElementById("diagonal-flag").disabled = false;
    var _tds = document.querySelectorAll("td");
    _tds.forEach(function (td) {
      return td.style.pointerEvents = "all";
    });
  }
}

/* Animate instruction icon on click */
var icon = document.getElementById("info-icon");
icon.addEventListener("click", rotateIcon);
var i = true;
function rotateIcon() {
  if (i == true) {
    icon.className = "fa fa-chevron-up rotate down";
  } else {
    icon.className = "fa fa-chevron-up rotate";
  }
  i = !i;
}