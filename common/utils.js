import { preferences } from "user-settings";

export function formatSeconds(seconds) {
  const date = new Date(seconds * 1000);
  return `${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}

export function formatTime(date) {
  let hours = date.getHours();
  hours = preferences.clockDisplay === '12h' ? hours % 12 || 12 : hours;
  
  return `${padZero(hours)}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

Number.prototype.inRange = function(min, max) {
  var num = this.valueOf();
  return num >= min && num <= max;
}

