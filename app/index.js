import clock from "clock";
import document from "document";

/* Variables */
let active = false;
const seconds = 0;
const contractions = [];
let contractionStart, contractionStop;

/* Element References */
let timer = document.getElementById("timer");
let btnBR = document.getElementById("btn-br");
let btnBRIcon = document.getElementById("combo-button-icon");
let btnBrIconPress = document.getElementById("combo-button-icon-press");

/* Event Handlers */
btnBR.onactivate = function() {
  if (active) {
    activate(false);
    timeContraction(false);
    
    contractions.push({start: contractionStart, stop: contractionStop, seconds: seconds});
    console.log(JSON.stringify(contractions));

    seconds = 0;
    timer.textContent = formatTime(0);
  } else {
    activate(true);
    timeContraction(true);
  }
}

function activate(activeFlag) {
  active = !active;
  if (activeFlag) {
    contractionStart = new Date();
  } else {
    contractionStop = new Date();
  }
  
  const buttonMode = active ? 'pause' : 'play';
  
  btnBRIcon.image = `icons/btn_combo_${buttonMode}_p.png`;  
  btnBrIconPress.image = `icons/btn_combo_${buttonMode}_press_p.png`;
}

function timeContraction(timeFlag) {
  if (timeFlag) {
    clock.granularity = "seconds";
    clock.ontick = () => {
      seconds++;
      timer.textContent = formatTime(seconds);
    }
  } else {
    // Stop counting by no longer emitting event
    clock.granularity = "off";
  }
}

function formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}









