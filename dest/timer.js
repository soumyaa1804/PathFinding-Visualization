"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.resetTimer = resetTimer;
var minutes;
var seconds;
var milisec;
var started = false;
var interval;
var startTime = new Date();
var btnText;
var btnTextTimerId = {
  "Start A*": "aStarTimer",
  "Start Dijkstra": "dijkstraTimer",
  "Start Breadth First Search": "BFSTimer"
};

function timer(startBtnText) {
  var now = new Date();
  var milisecond = now - startTime;
  minutes = Math.floor(milisecond / (1000 * 60));
  seconds = Math.floor(milisecond / 1000 % 60);
  milisec = Math.floor(milisecond % 100);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milisec = milisec < 10 ? "0" + milisec : milisec;
  document.getElementById(btnTextTimerId[btnText]).innerText = minutes + " min " + seconds + " sec " + milisec + " ms ";
}

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

function resetTimer() {
  console.log("clear grid!");
  var timerElement = document.getElementsByClassName("timer");

  for (var i = 0; i < timerElement.length; i++) {
    timerElement[i].innerText = "00 min 00 sec 00 ms";
  }
}