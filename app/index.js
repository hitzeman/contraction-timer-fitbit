import clock from "clock";
import { elementDisplayStates, MINIMUM_CONTRACTION_LENGTH, MINIMUM_CONTRACTIONS, FIRSTCHILD_MINIMUM_FREQUENCY, FIRSTCHILD_MAXIMUM_FREQUENCY, NOT_FIRSTCHILD_MINIMUM_FREQUENCY, NOT_FIRSTCHILD_MAXIMUM_FREQUENCY } from "../common/constants";
import * as elements from "../common/elements";
import * as utils from "../common/utils";

/* Variables */
let active = false;
let contractions = [];
const frequencies = [];
let avgFrequency, avgSeconds, intervalStart, intervalStop, isFirstChild;
let seconds = 0;

/* Event Handlers */
elements.btnBR.onactivate = function () {
  if (active) {
    activate(false);
    timeInterval(false);

    contractions.unshift({
      start: intervalStart,
      stop: intervalStop,
      seconds: seconds
    });

    updateAverages();
    updateDetails();

    resetTimer();
    displayNotification();
  } else {
    activate(true);
    timeInterval(true);
  }

  displayElement(elements.btnTR, contractions.length && !active)
  renderPreviousInterval();
};

elements.btnTR.onactivate = function () {
  resetTimer();
  renderView("reset");
};

elements.btnCancel.onclick = function () {
  renderView("container");
};

elements.btnConfirm.onclick = function () {
  renderView("container");
};

elements.btnReset.onclick = function () {
  contractions = [];
  frequencies = [];
  renderView("container");
  displayElement(elements.btnTR, false);
  displayElement(elements.previous, false);
  displayElement(elements.contractionDetails, false);
  displayElement(elements.averages, false);
  displayElement(elements.zeroContractionsAverage, true);
  displayElement(elements.zeroContractionsDetails, true);
};

elements.btnNo.onclick = function () {
  isFirstChild = false;
  renderView("container");
};

elements.btnYes.onclick = function () {
  isFirstChild = true;
  renderView("container");
};

function updateAverages() {
  displayElement(elements.zeroContractionsAverage, false);
  displayElement(elements.averages, true);
  setAverages();
}

function setAverages() {
  avgFrequency = getAverageFrequencies();
  avgSeconds = getAverageSeconds();

  elements.tileFrequency.textContent = `Frequency ${utils.formatSeconds(avgFrequency)}`;
  elements.tileTotalContractions.textContent = contractions.length;
  elements.tileLength.textContent = utils.formatSeconds(avgSeconds);
}

function updateDetails() {
  displayElement(elements.zeroContractionsDetails, false);
  displayElement(elements.contractionDetails, true);
  generateTiles();
  elements.tiles.length = contractions.length;
}

function displayNotification() {
  if(avgSeconds > MINIMUM_CONTRACTION_LENGTH && contractions.length >= MINIMUM_CONTRACTIONS){
    if(isFirstChild && avgFrequency.inRange(FIRSTCHILD_MINIMUM_FREQUENCY, FIRSTCHILD_MAXIMUM_FREQUENCY)) {
        renderView("notification");
    }
  } else if (!isFirstChild && avgFrequency.inRange(NOT_FIRSTCHILD_MINIMUM_FREQUENCY, NOT_FIRSTCHILD_MAXIMUM_FREQUENCY)) {
        renderView("notification");
  }
}

function getAverageFrequencies() {
  if (frequencies.length === 1) {
    return 0;
  }
  
  const sum = frequencies.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return sum / (frequencies.length - 1);
}

function getAverageSeconds() {
  const seconds = contractions.reduce((accumulator, currentValue) => accumulator + currentValue.seconds, 0);
  return seconds / contractions.length;
}

function generateTiles() {
  elements.tiles.delegate = {
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

        tileDivider.style.fill = info.index % 2 === 0 ? "#f83478" : "#2490dd";
        displayElement(tileDivider, info.index !== contractions.length - 1);
      }
    }
  };
}

function displayElement(element, renderFlag) {
  element.style.display = renderFlag ? "inline" : "none";
}

function renderPreviousInterval() {
  displayElement(elements.previous, contractions.length);
  if (contractions.length) {
    elements.previous.textContent = utils.formatSeconds(contractions[0].seconds);
  }
}

function setElementsDisplayValues(states) {
  elements.firstChildPopup.style.display = states[0];
  elements.notificationPopup.style.display = states[1];
  elements.resetPopup.style.display = states[2];
  elements.container.style.display = states[3];
}

function renderView(view) {
  setElementsDisplayValues(elementDisplayStates[view]);
}

function activate(activeFlag) {
  active = !active;
  if (activeFlag) {
    intervalStart = new Date();
  } else {
    intervalStop = new Date();
  }

  const buttonMode = active ? 'x' : 'play';

  elements.btnBRIcon.image = `icons/btn_combo_${buttonMode}_p.png`;
  elements.btnBrIconPress.image = `icons/btn_combo_${buttonMode}_press_p.png`;
}

function timeInterval(timeFlag) {
  if (timeFlag) {
    clock.granularity = "seconds";
    clock.ontick = function () {
      seconds++;
      elements.timer.textContent = utils.formatSeconds(seconds);
    }
  } else {
    // Stop counting by no longer emitting event
    clock.granularity = "off";
  }
}

function resetTimer() {
  seconds = 0;
  elements.timer.textContent = utils.formatSeconds(seconds);
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
