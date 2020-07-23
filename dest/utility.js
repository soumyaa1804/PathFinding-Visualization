"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countLength = countLength;
exports.getNeighbours = getNeighbours;
exports.animateCells = animateCells;
exports.getSpecialNodes = exports.minHeap = exports.Queue = void 0;

var _script = require("./script.js");

var _timer = require("./timer.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Queue class
 *  -dequeue() returns first element added
 *  -enqueue()
 *  -empty() @returns true/false
 *  -clear()
 */
var Queue = /*#__PURE__*/function () {
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


exports.Queue = Queue;

var minHeap = /*#__PURE__*/function () {
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
      } // No sifting down needed


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


exports.minHeap = minHeap;

var getSpecialNodes = function getSpecialNodes() {
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


exports.getSpecialNodes = getSpecialNodes;

function countLength(count, algoId) {
  if (algoId === "aStar") {
    document.getElementById("aStarCount").innerHTML = "Distance Count: ".concat(count);
  } else if (algoId === "greedyBFS") {
    document.getElementById("greedyBFSCount").innerHTML = "Distance Count: ".concat(count);
  } else if (algoId === "dijkstra") {
    document.getElementById("dijkstraCount").innerHTML = "Distance Count: ".concat(count);
  } else if (algoId === "BFS") {
    document.getElementById("BFSCount").innerHTML = "Distance Count: ".concat(count);
  } else {
    // To reset the count on Clear Path and Clear Grid
    var countElement = document.getElementsByClassName("count");

    for (var _i = 0; _i < countElement.length; _i++) {
      countElement[_i].innerText = "Distance Count: ".concat(count);
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
  var neighbours = []; // direction vectors
  // 0-3: East, South, West, North
  // 4-7: South-East, North-East, South-West, North-West

  var dx = [1, 0, -1, 0, 1, 1, -1, -1];
  var dy = [0, 1, 0, -1, 1, -1, 1, -1];
  var diagonal = document.getElementById("diagonal-flag").checked;
  var length; // length of direction vector

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


function animateCells(_x, _x2, _x3, _x4) {
  return _animateCells.apply(this, arguments);
}
/**
 * @description Disable each cell of the grid and all buttons
 *              if animation is in progress
 * 
 * @param {boolean} inProgress
 */


function _animateCells() {
  _animateCells = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(inProgress, nodesToAnimate, startbtnText, algo) {
    var count, cells, i, nodeCoordinates, x, y, num, cell, colorClass;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            count = 1;
            (0, _timer.start)(startbtnText);
            console.log("animation started");
            inProgress = true;
            toggleScreen(inProgress);
            cells = document.getElementsByTagName("td");
            i = 0;

          case 7:
            if (!(i < nodesToAnimate.length)) {
              _context.next = 26;
              break;
            }

            nodeCoordinates = nodesToAnimate[i][0];
            x = nodeCoordinates.row;
            y = nodeCoordinates.col;
            num = x * _script.totalCols + y;
            cell = cells[num];
            colorClass = nodesToAnimate[i][1]; // success, visited or searching
            // Wait until its time to animate

            _context.next = 16;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 5);
            });

          case 16:
            if (!(cell.className == "start" || cell.className == "end")) {
              _context.next = 21;
              break;
            }

            if (cell.className == "end" && colorClass === "shortest") {
              (0, _timer.start)(startbtnText);
              console.log("End reached!");
            }

            return _context.abrupt("continue", 23);

          case 21:
            cell.className = colorClass;

          case 22:
            // Update count
            if (colorClass == "shortest") {
              count++;
              countLength(count, algo);
            }

          case 23:
            i++;
            _context.next = 7;
            break;

          case 26:
            nodesToAnimate = [];
            inProgress = false;
            toggleScreen(inProgress);
            return _context.abrupt("return", new Promise(function (resolve) {
              return resolve(true);
            }));

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _animateCells.apply(this, arguments);
}

function toggleScreen(inProgress) {
  if (inProgress) {
    //Get the elements
    //Start Button disable
    document.getElementById("startBtn").disabled = true; //clear Path disable

    document.getElementById("clearPathBtn").disabled = true; //clear grid disable

    document.getElementById("clearBtn").disabled = true;
    document.getElementById("diagonal-flag").disabled = true;
    var tds = document.querySelectorAll("td");
    tds.forEach(function (td) {
      return td.style.pointerEvents = "none";
    });
  } else {
    //Get the elements
    //Start Button enable
    document.getElementById("startBtn").disabled = false; //clear Path enable

    document.getElementById("clearPathBtn").disabled = false; //clear grid enable

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