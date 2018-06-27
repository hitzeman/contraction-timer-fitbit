import { preferences } from "user-settings";

export function formatSeconds(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

export function formatTime(date) {
  let hours = date.getHours();
  hours = preferences.clockDisplay === '12h' ? hours % 12 || 12 : hours;
  
  return `${padZero(hours)}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}