"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
var minutes;
var seconds;
var milisec;
var started = false;
var interval;
var startTime = new Date();

function timer() {
  var now = new Date();
  var milisecond = now - startTime;
  minutes = Math.floor(milisecond / (1000 * 60));
  seconds = Math.floor(milisecond / 1000 % 60);
  milisec = Math.floor(milisecond % 100);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milisec = milisec < 10 ? "0" + milisec : milisec;
  document.getElementById("timer").innerText = minutes + " min " + seconds + " sec " + milisec + " ms ";
}

function start() {
  startTime = new Date();

  if (started == false) {
    interval = setInterval(timer, 10);
    started = true;
  } else {
    clearInterval(interval);
    started = false;
  }
}