import clock from "clock";
import document from "document";
import { preferences } from "user-settings";

/* Variables */
let active = false;
const seconds = 0;
const contractions = [];
let intervalStart, intervalStop;

/* Element References */
const btnBR = document.getElementById("btn-br");
const btnBRIcon = btnBR.getElementById("combo-button-icon");
const btnBrIconPress = btnBR.getElementById("combo-button-icon-press");
const btnCancel = document.getElementById("btnCancel");
const btnReset = document.getElementById("btnReset");
const btnTR = document.getElementById("btn-tr");
const container = document.getElementById("container");
const previous = document.getElementById("previous");
const resetPopup = document.getElementById("reset-popup");
const tiles = document.getElementById("tiles");
const timer = document.getElementById("timer");

console.log('preferences', preferences.clockDisplay);

/* Event Handlers */
btnBR.onactivate = function () {
  if (active) {
    activate(false);
    timeInterval(false);

    // Add latest contraction to the beginning of the array
    contractions.unshift({
      start: intervalStart,
      stop: intervalStop,
      seconds: seconds
    });

    generateTiles();
    tiles.length = contractions.length;
    resetTimer();
  } else {
    activate(true);
    timeInterval(true);
  }

  displayElement(btnTR, contractions.length && !active)
  renderPreviousInterval();
}

btnTR.onactivate = function () {
  resetTimer();
  renderView("popup");
}

btnCancel.onclick = function (e) {
  renderView("container");
}

btnReset.onclick = function (e) {
  contractions = [];
  renderView("container");
  displayElement(btnTR, false);
  displayElement(previous, false);
}

function generateTiles() {
  tiles.delegate = {
  getTileInfo: function (index) {
    return {
      type: "contraction-pool",
      value: contractions[index],
      index: index
    };
  },
  configureTile: function (tile, info) {
    if (info.type === "contraction-pool") {
      console.log(JSON.stringify(info));

      const tileDivider = tile.getElementById("tile-divider-bottom");      
      const tileStartValue = tile.getElementById("tile-start").getElementById("tile-value");      
      const tileEndValue = tile.getElementById("tile-end").getElementById("tile-value");
      const tileDurationValue = tile.getElementById("tile-duration").getElementById("tile-value");            
      const tileFrequencyValue = tile.getElementById("tile-frequency").getElementById("tile-value");

      tileStartValue.textContent = formatTime(info.value.start);
      tileEndValue.textContent = formatTime(info.value.stop);
      tileDurationValue.textContent = formatSeconds(info.value.seconds);
      tileFrequencyValue.textContent = calculateFrequency(info.index);

      tileDivider.style.fill = info.index % 2 === 0 ? "#f83478" : "#2490dd"
      displayElement(tileDivider, info.index !== contractions.length - 1)
    }
  }
}
}

function displayElement(element, renderFlag) {
  element.style.display = renderFlag ? "inline" : "none";
}

function renderPreviousInterval() {
  displayElement(previous, contractions.length);
  if (contractions.length) {
    previous.textContent = formatSeconds(contractions[contractions.length - 1].seconds);
  }
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

  const buttonMode = active ? 'x' : 'play';

  btnBRIcon.image = `icons/btn_combo_${buttonMode}_p.png`;
  btnBrIconPress.image = `icons/btn_combo_${buttonMode}_press_p.png`;
}

function timeInterval(timeFlag) {
  if (timeFlag) {
    clock.granularity = "seconds";
    clock.ontick = function () {
      seconds++;
      timer.textContent = formatSeconds(seconds);
    }
  } else {
    // Stop counting by no longer emitting event
    clock.granularity = "off";
  }
}

function resetTimer() {
  seconds = 0;
  timer.textContent = formatSeconds(seconds);
}

function formatSeconds(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

function formatTime(date) {
  let hours = date.getHours();
  hours = preferences.clockDisplay === '12h' ? hours % 12 || 12 : hours;
  
  return `${padZero(hours)}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}

function calculateFrequency(index) {
  if (index === contractions.length - 1) {
    return "N/A";
  } else {
    return formatSeconds((contractions[index].start.getTime() - contractions[index + 1].stop.getTime()) / 1000);
  }
}

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}


