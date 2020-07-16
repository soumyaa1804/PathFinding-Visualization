"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecialNodes = exports.minHeap = exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getNeighbours = getNeighbours;
exports.animateCells = animateCells;

var _script = require("./script.js");

var _timer = require("./timer.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* -------- Queue ------- */
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
/*------ Min Heap ----- */

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
/*-------getSpecialNodes------*/


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
/*------------getNeighbours------------*/
function getNeighbours(currNode) {
  var r = currNode.row;
  var c = currNode.col;
  var relevantStatuses = ["start", "wall"];
  var actual_neighbours = [];
  var neighbours = [];
  if (r - 1 >= 0) {
    neighbours.push(_script.gridArray[r - 1][c]);
    if (c - 1 >= 0) {
      if (_script.gridArray[r - 1][c].status !== "wall" && _script.gridArray[r][c - 1].status !== "wall") neighbours.push(_script.gridArray[r - 1][c - 1]);
    }
    if (c + 1 <= _script.totalCols - 1) {
      if (_script.gridArray[r - 1][c].status !== "wall" && _script.gridArray[r][c + 1].status !== "wall") neighbours.push(_script.gridArray[r - 1][c + 1]);
    }
  }
  if (r + 1 <= _script.totalRows - 1) {
    neighbours.push(_script.gridArray[r + 1][c]);
    if (c - 1 >= 0) {
      if (_script.gridArray[r + 1][c - 1].status !== "wall" && _script.gridArray[r + 1][c].status !== "wall") {
        neighbours.push(_script.gridArray[r + 1][c - 1]);
      }
      neighbours.push(_script.gridArray[r][c - 1]);
    }
    if (c + 1 <= _script.totalCols - 1) {
      if (_script.gridArray[r][c + 1].status !== "wall" && _script.gridArray[r + 1][c].status !== "wall") {
        neighbours.push(_script.gridArray[r + 1][c + 1]);
      }
      neighbours.push(_script.gridArray[r][c + 1]);
    }
  }
  neighbours.forEach(function (neighbour) {
    if (!relevantStatuses.includes(neighbour.status) && !neighbour.isVisited) {
      actual_neighbours.push(neighbour);
    }
  });
  return actual_neighbours;
}
/*---------Animation-------*/
async function animateCells(inProgress, nodesToAnimate, startbtnText) {
  (0, _timer.start)(startbtnText);
  console.log("animation started");
  inProgress = true;
  var cells = document.getElementsByTagName("td");
  toggleScreen(inProgress);
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
  }
  nodesToAnimate = [];
  inProgress = false;
  toggleScreen(inProgress);
  return new Promise(function (resolve) {
    return resolve(true);
  });
}
function toggleScreen(inProgress) {
  if (inProgress) {
    //Get the elements
    //Start Button disable
    document.getElementById("startBtn").disabled = true; //clear Path disable
    document.getElementById("clearPathBtn").disabled = true;
    //clear grid disable
    document.getElementById("clearBtn").disabled = true;
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
    var _tds = document.querySelectorAll("td");
    _tds.forEach(function (td) {
      return td.style.pointerEvents = "all";
    });
    // //Clear the board
    document.getElementById("tableContainer").addEventListener("mousedown", _script.clearPath);
  }
}