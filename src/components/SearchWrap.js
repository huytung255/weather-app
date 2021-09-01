import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setSearchResults, setIsSearching } from "../redux/info";
import axiosClient from "../api/axiosClient";
import { GoSearch } from "react-icons/go";
import { useState } from "react";
import { Box } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
const SearchWrap = () => {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsFetching(true);
    try {
      const searchRes = await axiosClient.get("weather", {
        params: {
          q: city,
        },
      });
      const { name, dt, timezone } = searchRes.data;
      const temp = searchRes.data.main.temp;
      const { description, icon } = searchRes.data.weather[0];
      const { lat, lon } = searchRes.data.coord;
      const infoRes = await axiosClient.get("onecall", {
        params: {
          lat: lat,
          lon: lon,
          exclude: "minutely,alerts,current",
        },
      });
      const daily = [];
      for (let i = 1; i <= 6; i++) {
        const { timezone_offset } = infoRes.data;
        const { dt } = infoRes.data.daily[i];
        const temp = {
          max: infoRes.data.daily[i].temp.max,
          min: infoRes.data.daily[i].temp.min,
        };
        const icon = infoRes.data.daily[i].weather[0].icon;
        daily.push({ time: dt + timezone_offset, temp, icon });
      }
      const hourly = [];
      for (let i = 1; i <= 6; i++) {
        const { timezone_offset } = infoRes.data;
        const { dt, temp } = infoRes.data.hourly[i];
        const icon = infoRes.data.hourly[i].weather[0].icon;
        hourly.push({ time: dt + timezone_offset, temp, icon });
      }
      dispatch(
        setSearchResults({
          name,
          temp,
          description,
          icon,
          time: dt + timezone,
          daily,
          hourly,
        })
      );
      dispatch(setIsSearching(false));
    } catch (e) {
      setIsFetching(false);
      document.getElementById("not-found").style.opacity = 1;
      console.log(e);
    }
  }
  function handleChange(e) {
    setCity(e.target.value);
  }
  return (
    <form className="search-wrap" onSubmit={handleSubmit}>
      <Box display="flex">
        <div className="input-wrap">
          <IoLocationSharp />
          <input
            type="text"
            name="city"
            id=""
            value={city}
            onChange={(e) => handleChange(e)}
            placeholder="Enter city name here."
          />
        </div>
        <button type="submit">
          {isFetching ? <CircularProgress color="inherit" /> : <GoSearch />}
        </button>
      </Box>
      <label id="not-found">
        Not found. To make search more precise put the city's name, comma,
        2-letter country code (ISO3166).
      </label>
    </form>
  );
};

export default SearchWrap;
