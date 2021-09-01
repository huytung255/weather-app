import React from "react";
import { Box } from "@material-ui/core";
import ForecastList from "./ForecastList";
import { useDispatch, useSelector } from "react-redux";
import icons from "../constants/Icons";
import { HiArrowLeft } from "react-icons/hi";
import { setIsSearching } from "../redux/info";
const MainWrap = () => {
  const dispatch = useDispatch();
  const { location, temp, weather, icon, time } = useSelector(
    (state) => state.info
  );
  return (
    <>
      <div className="location-info">
        <Box display="flex" justifyContent="center" alignItems="center">
          <button
            onClick={() => {
              dispatch(setIsSearching(true));
            }}
          >
            <HiArrowLeft />
          </button>
          {location}
        </Box>

        <div>{time}</div>
      </div>
      <div className="today-info">
        <div className="today-degree">{temp}°</div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <div className="today-weather-icon">
            <svg
              id="Layer_1"
              enableBackground="new 0 0 512 512"
              height="512"
              viewBox="0 0 512 512"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              {icons[icon]}
            </svg>
          </div>
          <div className="today-weather">{weather}</div>
        </Box>
      </div>
      <ForecastList />
    </>
  );
};

export default MainWrap;
