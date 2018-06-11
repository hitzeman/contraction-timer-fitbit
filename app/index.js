import clock from "clock";
import document from "document";

/* Variables */
let active = false;
const seconds = 0;
const contractions = [];
let intervalStart, intervalStop;

/* Element References */
let btnBR = document.getElementById("btn-br");
let btnBRIcon = btnBR.getElementById("combo-button-icon");
let btnBrIconPress = btnBR.getElementById("combo-button-icon-press");
let btnCancel = document.getElementById("btnCancel");
let btnReset = document.getElementById("btnReset");
let btnTR = document.getElementById("btn-tr");
let container = document.getElementById("container");
let resetPopup = document.getElementById("reset-popup");
let timer = document.getElementById("timer");

/* Event Handlers */
btnBR.onactivate = function () {
  if (active) {
    activate(false);
    timeInterval(false);

    contractions.push({
      start: intervalStart,
      stop: intervalStop,
      seconds: seconds
    });
    console.log(JSON.stringify(contractions));

    resetTimer();
  } else {
    activate(true);
    timeInterval(true);
  }
  
  displayResetButton(contractions.length && !active);
}

btnTR.onactivate = function() {
  resetTimer();
  renderView("popup");
}

btnCancel.onclick = function(e) {
  renderView("container");
}

btnReset.onclick = function(e) {
  contractions = [];
  renderView("container");
  displayResetButton(false);
}

function displayResetButton(renderFlag) {
  btnTR.style.display = renderFlag ? "inline" : "none";
}

function renderView(view) {
  switch (view) {
    case "container": 
      resetPopup.style.display = "none";
      container.style.display = "inline";
      break;
    case "popup": 
      container.style.display = "none";
      resetPopup.style.display = "inline";
      break;   
  }
}

function activate(activeFlag) {
  active = !active;
  if (activeFlag) {
    intervalStart = new Date();
  } else {
    intervalStop = new Date();
  }
  
  const buttonMode = active ? 'pause' : 'play';
  
  btnBRIcon.image = `icons/btn_combo_${buttonMode}_p.png`;  
  btnBrIconPress.image = `icons/btn_combo_${buttonMode}_press_p.png`;
}

function timeInterval(timeFlag) {
  if (timeFlag) {
    clock.granularity = "seconds";
    clock.ontick = function() {
      seconds++;
      timer.textContent = formatTime(seconds);
    }
  } else {
    // Stop counting by no longer emitting event
    clock.granularity = "off";
  }
}

function resetTimer() {
  seconds = 0;
  timer.textContent = formatTime(seconds);
}

function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}









