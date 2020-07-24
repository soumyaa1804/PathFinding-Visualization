"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.resetTimer = resetTimer;
/**
 * This file exports two functions:
 * -start()
 * -resetTimer()
 */

var minutes = void 0;
var seconds = void 0;
var milisec = void 0;
var started = false;
var interval = void 0;
var startTime = new Date();
var btnText = void 0;

var btnTextTimerId = {
  "Start A*": "aStarTimer",
  "Start Greedy Best-First Search": "greedyBFSTimer",
  "Start Dijkstra": "dijkstraTimer",
  "Start Breadth-First Search": "BFSTimer"
};

/**
 * helper function for start() function
 */
function timer() {
  var now = new Date();

  var milisecond = now - startTime;
  minutes = Math.floor(milisecond / (1000 * 60));
  seconds = Math.floor(milisecond / 1000 % 60);
  milisec = Math.floor(milisecond % 100);

  // show 09 instead of 9 in case minutes, seconds or milisec are less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milisec = milisec < 10 ? "0" + milisec : milisec;

  document.getElementById(btnTextTimerId[btnText]).innerText = minutes + " min " + seconds + " sec " + milisec + " ms ";
}

/**
 * @description Invoking start() starts the timer and when invoked again, it stops!
 * 
 * @param {string} startBtnText inner text of start button.
 */
function start(startBtnText) {
  btnText = startBtnText;
  startTime = new Date();
  if (started == false) {
    interval = setInterval(timer, 10);
    started = true;
  } else {
    clearInterval(interval);
    started = false;
  }
}

/**
 * @description Reset the timer on clear path or clear grid
 */
function resetTimer() {
  var timerElement = document.getElementsByClassName("timer");
  for (var i = 0; i < timerElement.length; i++) {
    timerElement[i].innerText = "00 min 00 sec 00 ms";
  }
}