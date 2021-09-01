import { createSlice } from "@reduxjs/toolkit";
import {
  toCelsius,
  toFormattedTime,
  getShortWeekday,
  getTime,
} from "../helper/helperfunctions";
const initialState = {
  isSearching: true,
  time: "",
  location: "",
  temp: 0,
  weather: "",
  icon: "",
  forecast: [],
};
export const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
      if (action.payload === true) state.icon = "";
    },
    setSearchResults: (state, action) => {
      const { name, temp, description, icon, time, daily, hourly } =
        action.payload;
      state.time = toFormattedTime(time);
      state.location = name;
      state.temp = toCelsius(temp);
      state.weather = description;
      state.icon = icon;
      state.forecast = [];
      for (let i = 0; i < daily.length; i++) {
        state.forecast.push({
          daily: {
            time: getShortWeekday(daily[i].time),
            icon: daily[i].icon,
            temp:
              toCelsius(daily[i].temp.max) +
              " / " +
              toCelsius(daily[i].temp.min),
          },
          hourly: {
            time: getTime(hourly[i].time),
            icon: hourly[i].icon,
            temp: toCelsius(hourly[i].temp),
          },
        });
      }
    },
  },
});
export const { setIsSearching, setSearchResults } = infoSlice.actions;
export default infoSlice.reducer;
