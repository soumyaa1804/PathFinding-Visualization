/**
 * This file exports two functions:
 * -start()
 * -resetTimer()
 */

let minutes;
let seconds;
let milisec;
let started = false;
let interval;
let startTime = new Date();
let btnText;

const btnTextTimerId = {
  "Start A*": "aStarTimer",
  "Start Greedy Best-First Search": "greedyBFSTimer",
  "Start Dijkstra": "dijkstraTimer",
  "Start Breadth-First Search": "BFSTimer",
};

/**
 * helper function for start() function
 */
function timer() {
  const now = new Date();

  const milisecond = now - startTime;
  minutes = Math.floor(milisecond / (1000 * 60));
  seconds = Math.floor((milisecond / 1000) % 60);
  milisec = Math.floor(milisecond % 100);

  // show 09 instead of 9 in case minutes, seconds or milisec are less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milisec = milisec < 10 ? "0" + milisec : milisec;

  document.getElementById(btnTextTimerId[btnText]).innerText =
    minutes + " min " + seconds + " sec " + milisec + " ms ";
}

/**
 * @description Invoking start() starts the timer and when invoked again, it stops!
 * 
 * @param {string} startBtnText inner text of start button.
 */
export function start(startBtnText) {
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
export function resetTimer() {
  let timerElement = document.getElementsByClassName("timer");
  for (let i = 0; i < timerElement.length; i++) {
    timerElement[i].innerText = "00 min 00 sec 00 ms";
  }
}
