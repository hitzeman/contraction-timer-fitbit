import clock from "clock";
import document from "document";
import * as utils from "../common/utils";

/* Variables */
let active = false;
const contractions = [];
let frequencies = [];
let avgFrequency, avgSeconds, intervalStart, intervalStop, isFirstChild;
const seconds = 0;

/* Element References */
const averages = document.getElementById("averages");
const btnBR = document.getElementById("btn-br");
const btnBRIcon = btnBR.getElementById("combo-button-icon");
const btnBrIconPress = btnBR.getElementById("combo-button-icon-press");
const btnCancel = document.getElementById("btn-cancel");
const btnConfirm = document.getElementById("btn-confirm");
const btnNo = document.getElementById("btn-no");
const btnReset = document.getElementById("btn-reset");
const btnTR = document.getElementById("btn-tr");
const btnYes = document.getElementById("btn-yes");
const container = document.getElementById("container");
const contractionDetails = document.getElementById("contraction-details");
const firstChildPopup = document.getElementById("first-child-popup");
const sectionAverage = document.getElementById("section-average");
const sectionDetails = document.getElementById("section-details");
const zeroContractionsAverage = sectionAverage.getElementById("zero-contractions");
const zeroContractionsSummary = sectionDetails.getElementById("zero-contractions");
const notificationPopup = document.getElementById("notification-popup");
const previous = document.getElementById("previous");
const resetPopup = document.getElementById("reset-popup");
const tiles = document.getElementById("tiles");
const timer = document.getElementById("timer");
const tileFrequency = document.getElementById("tile-average-frequency");
const tileLength = document.getElementById("tile-average-length");
const tileTotalContractions = document.getElementById("tile-average-contractions");

/* Event Handlers */
btnBR.onactivate = function () {
  if (active) {
    activate(false);
    timeInterval(false);

    contractions.unshift({
      start: intervalStart,
      stop: intervalStop,
      seconds: seconds
    });
    
    displayElement(zeroContractionsAverage, false);
    displayElement(zeroContractionsSummary, false);
    displayElement(contractionDetails, true);
    displayElement(averages, true);
    generateTiles();
    tiles.length = contractions.length;
    updateAverages();
    
    resetTimer();
    
    displayNotification();
    
  } else {
    activate(true);
    timeInterval(true);
  }

  displayElement(btnTR, contractions.length && !active)
  renderPreviousInterval();
}

btnTR.onactivate = function () {
  resetTimer();
  renderView("reset");
}

btnCancel.onclick = function (e) {
  renderView("container");
}

btnConfirm.onclick = function(e) {
  renderView("container");
}

btnReset.onclick = function (e) {
  contractions = [];
  renderView("container");
  displayElement(btnTR, false);
  displayElement(previous, false);
  displayElement(contractionDetails, false);
}

btnNo.onclick = function(e) {
  renderView("container");
  isFirstChild = false;
}

btnYes.onclick = function(e) {
  renderView("container");
  isFirstChild = true;
}

function updateAverages() {
  avgFrequency = getAverageFrequencies();
  avgSeconds = getAverageSeconds();
 
  tileFrequency.textContent = `Frequency ${utils.formatSeconds(avgFrequency)}`;
  tileTotalContractions.textContent = contractions.length;
  tileLength.textContent = utils.formatSeconds(avgSeconds);
}

function displayNotification() {
  if (avgSeconds > 45 && contractions.length >= 4 && (isFirstChild && avgFrequency >= 180 && avgFrequency < 300) || (!isFirstChild && avgFrequency >= 300 && avgFrequency < 420)) {
    renderView("notification");
  }
}

function getAverageFrequencies() {
  let sum = 0;
  for (var i = 0; i < frequencies.length; i++) {
    sum += frequencies[i];
  }
  return frequencies.length === 1 ? 0 : sum / (frequencies.length - 1);
}

function getAverageSeconds() {
  let secs = 0;
  for (var i = 0; i < contractions.length; i++) {
    secs += contractions[i].seconds;
  }
  return secs / contractions.length;
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

      const tileDivider = tile.getElementById("tile-divider-bottom");      
      const tileStartValue = tile.getElementById("tile-start").getElementById("tile-value");      
      const tileEndValue = tile.getElementById("tile-end").getElementById("tile-value");
      const tileDurationValue = tile.getElementById("tile-duration").getElementById("tile-value");            
      const tileFrequencyValue = tile.getElementById("tile-frequency").getElementById("tile-value");

      tileStartValue.textContent = utils.formatTime(info.value.start);
      tileEndValue.textContent = utils.formatTime(info.value.stop);
      tileDurationValue.textContent = utils.formatSeconds(info.value.seconds);
      frequencies[info.index] = calculateFrequency(info.index);
      tileFrequencyValue.textContent = utils.formatSeconds(frequencies[info.index]);

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
    previous.textContent = utils.formatSeconds(contractions[0].seconds);
  }
}

function renderView(view) {
  switch (view) {
    case "container":
      firstChildPopup.style.display = "none";
      notificationPopup.style.display = "none";
      resetPopup.style.display = "none";
      container.style.display = "inline";
      break;
    case "firstChild": {
      firstChildPopup.style.display = "inline";
      notificationPopup.style.display = "none";
      resetPopup.style.display = "none";
      container.style.display = "none";
      break;
    }
    case "notification": {
      firstChildPopup.style.display = "none";
      notificationPopup.style.display = "inline";
      resetPopup.style.display = "none";
      container.style.display = "none";
      break;
    }
    case "reset":
      firstChildPopup.style.display = "none";
      notificationPopup.style.display = "none";
      resetPopup.style.display = "inline";
      container.style.display = "none";
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
      timer.textContent = utils.formatSeconds(seconds);
    }
  } else {
    // Stop counting by no longer emitting event
    clock.granularity = "off";
  }
}

function resetTimer() {
  seconds = 0;
  timer.textContent = utils.formatSeconds(seconds);
}

function calculateFrequency(index) {
  if (index === contractions.length - 1) {
    return 0;
  } else {
    const previousStartTime = contractions[index].start.getTime();
    const currentEndTime = contractions[index + 1].stop.getTime();
    return (previousStartTime - currentEndTime) / 1000;
  }
}


