/* Variables */

var height = window.innerHeight * 0.8;
var width = window.innerWidth * 0.9;
var cellSize = 25;
var totalRows = Math.floor(height / cellSize) - 1;
var totalCols = Math.floor(width / cellSize) - 1;
var inProgress = false;
var cellsToAnimate = [];
var createWalls = false;
var algorithm = null;
var justFinished = false;
var animationSpeed = "Fast";
var animationState = null;
var startCell = [Math.floor(totalRows / 4), Math.floor(totalCols / 4)];
var endCell = [
  Math.floor((3 * totalRows) / 4),
  Math.floor((3 * totalCols) / 4),
];
var movingStart = false;
var movingEnd = false;

/* Generate Grid */

function generateGrid(rows, cols) {
  var grid = "<table>";
  for (row = 1; row <= rows; row++) {
    grid += "<tr>";
    for (col = 1; col <= cols; col++) {
      grid += "<td></td>";
    }
    grid += "</tr>";
  }
  grid += "</table>";
  return grid;
}

var myGrid = generateGrid(totalRows, totalCols);
$("#tableContainer").append(myGrid);

/* --------------------- */
/*---- Mouse Function -- */
/*---------------------- */
