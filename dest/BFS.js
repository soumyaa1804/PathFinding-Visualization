"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BFS = BFS;
exports.animateCells = animateCells;

var _utility = require("./utility.js");

var _script = require("./script.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getSpecialNodes = function getSpecialNodes() {
  var copy_end = null,
      copy_start = null;

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

function BFS(pathFound, nodesToAnimate) {
  var myQueue = new _utility.Queue();
  var specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1]; // console.log(startNode, endNode);

  myQueue.enqueue(_script.gridArray[startNode.row][startNode.col]);
  _script.gridArray[startNode.row][startNode.col].isVisited = true;
  nodesToAnimate.push([startNode, "searching"]);
  var currNode = new _script.Node(); // console.log(myQueue.items.length);

  while (!myQueue.empty()) {
    currNode = myQueue.dequeue(); // console.log(currNode);

    var r = currNode.row;
    var c = currNode.col;
    nodesToAnimate.push([_script.gridArray[currNode.row][currNode.col], "visited"]);

    if (r == endNode.row && c == endNode.col) {
      pathFound = true;
      break;
    }

    var neighbours = getNeighbours(r, c);

    for (var k = 0; k < neighbours.length; k++) {
      var m = neighbours[k][0];
      var n = neighbours[k][1];

      if (_script.gridArray[m][n].isVisited || _script.gridArray[m][n].status == "wall") {
        continue;
      }

      _script.gridArray[m][n].isVisited = true;
      _script.gridArray[m][n].parent = currNode;
      nodesToAnimate.push([_script.gridArray[m][n], "searching"]);
      myQueue.enqueue(_script.gridArray[m][n]);
    }
  }

  if (pathFound) {
    nodesToAnimate.push([_script.gridArray[endNode.row][endNode.col], "shortest"]);

    while (currNode.parent != null) {
      var prevNode = currNode.parent;
      nodesToAnimate.push([_script.gridArray[prevNode.row][prevNode.col], "shortest"]);
      currNode = prevNode;
    }
  }

  return pathFound;
}

function animateCells(_x, _x2) {
  return _animateCells.apply(this, arguments);
}

function _animateCells() {
  _animateCells = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(inProgress, nodesToAnimate) {
    var specialNodes, startNode, endNode, cells, startNodeIndex, endNodeIndex, i, nodeCoordinates, x, y, num, cell, colorClass;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            inProgress = true;
            specialNodes = getSpecialNodes();
            startNode = specialNodes[0];
            endNode = specialNodes[1];
            cells = document.getElementsByTagName("td");
            startNodeIndex = _script.gridArray[startNode.row] * _script.totalCols + _script.gridArray[startNode.col];
            endNodeIndex = _script.gridArray[endNode.row] * _script.totalCols + _script.gridArray[endNode.col];
            i = 0;

          case 8:
            if (!(i < nodesToAnimate.length)) {
              _context.next = 27;
              break;
            }

            nodeCoordinates = nodesToAnimate[i][0];
            x = nodeCoordinates.row;
            y = nodeCoordinates.col;
            num = x * _script.totalCols + y;

            if (!(num == startNodeIndex || num == endNodeIndex)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("continue", 24);

          case 15:
            cell = cells[num];
            colorClass = nodesToAnimate[i][1]; // success, visited or searching
            // Wait until its time to animate

            _context.next = 19;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 5);
            });

          case 19:
            if (!(cell.className == "start" || cell.className == "end")) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("continue", 24);

          case 23:
            cell.className = colorClass;

          case 24:
            i++;
            _context.next = 8;
            break;

          case 27:
            nodesToAnimate = [];
            inProgress = false;
            justFinished = true;
            return _context.abrupt("return", new Promise(function (resolve) {
              return resolve(true);
            }));

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _animateCells.apply(this, arguments);
}

function getNeighbours(i, j) {
  var neighbors = [];

  if (i > 0) {
    neighbors.push([i - 1, j]);
  }

  if (j > 0) {
    neighbors.push([i, j - 1]);
  }

  if (i < _script.totalRows - 1) {
    neighbors.push([i + 1, j]);
  }

  if (j < _script.totalCols - 1) {
    neighbors.push([i, j + 1]);
  }

  return neighbors;
}