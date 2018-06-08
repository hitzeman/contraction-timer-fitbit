import clock from "clock";
import document from "document";

/* Variables */
let active = false;
let seconds = 0;
let contractions = [];
let contractionStart, contractionStop;

/* Element References */
let timer = document.getElementById("timer");
let btnBR = document.getElementById("btn-br");
let btnBRIcon = document.getElementById("combo-button-icon");
let btnBrIconPress = document.getElementById("combo-button-icon-press");

/* Event Handlers */
btnBR.onactivate = function(e) {
  if (active) {
    active = false;
    contractionStop = new Date();
    
    btnBRIcon.image = "icons/btn_combo_play_p.png";  
    btnBrIconPress.image = "icons/btn_combo_play_press_p.png";
    
    // Stop counting
    clock.granularity = "off";
    
    contractions.push({start: startTime, stop: stopTime, seconds: seconds});
  } else {
    active = true;
    contractionStart = new Date();
    
    btnBRIcon.image = "icons/btn_combo_pause_p.png";  
    btnBrIconPress.image = "icons/btn_combo_pause_press_p.png";
    
    // Start counting
    clock.granularity = "seconds";
    clock.ontick = (e) => {
      seconds++;
      timer.textContent = seconds;
    }
  }
}
