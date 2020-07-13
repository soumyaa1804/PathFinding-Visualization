let minutes;
let seconds;   
let milisec; 
let started=false;  
let interval;
let startTime = new Date();

function timer() {
  const now = new Date();

  const milisecond = now - startTime;
  minutes = Math.floor(milisecond / (1000 * 60) % 60);
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