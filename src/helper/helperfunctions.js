import moment from "moment";
export function toCelsius(val) {
  val = parseFloat(val);
  return Number((val - 273.15).toFixed(0));
}
function addZero(num) {
  return ("0" + num).slice(-2);
}
export function getTime(unix_timestamp) {
  const datetime = moment.utc(new Date(unix_timestamp * 1000));
  return addZero(datetime.hour()) + ":" + addZero(datetime.minute());
}
const longDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export function toFormattedTime(unix_timestamp) {
  const datetime = moment.utc(new Date(unix_timestamp * 1000));
  const day = longDays[datetime.day()];
  const date = datetime.date();
  const month = months[datetime.month()];
  const time = getTime(unix_timestamp);
  return day + ", " + date + " " + month + " " + time;
}
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function getShortWeekday(unix_timestamp) {
  const datetime = moment.utc(new Date(unix_timestamp * 1000));
  return shortDays[datetime.day()];
}
