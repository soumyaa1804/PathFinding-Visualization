let minutes;
let seconds;   
let milisec;
// let ms=0;   
let started=false;  
let interval;
// let min = "";
// let sec = "";
// let milisec = "";
let startTime = new Date();

function timer() {
  const now = new Date();
  
  // if(m < 10) {
  //   min = `0${m}`;
  // }
  // else min = m;

  // if(s < 10) {
  //   sec = `0${s}`;
  // }
  // else sec = s;

  // if((ms/10) < 10) {
  //   milisec = `0${ms/10}`;
  // }
  // else milisec = ms/10;



  const milisecond = now - startTime;
  minutes = Math.floor(milisecond / (1000 * 60) % 60); // minutes
  seconds = Math.floor(milisecond / (1000) % 60);
  milisec = Math.floor(milisecond%100);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milisec = (milisec < 10) ? "0" + milisec : milisec;

  document.getElementById("timer").innerText= minutes + " min " + seconds + " sec " + milisec + " ms ";
}

export function start(){
  startTime = new Date();
    if(started==false){
        interval=setInterval(timer,10);
        started=true;
    }
    else{
        clearInterval(interval);
        started=false;
    }
}