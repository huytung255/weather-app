import { Box, Grid } from "@material-ui/core";
import React from "react";
import Forecast from "./Forecast";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { useState } from "react";
import { useSelector } from "react-redux";

const ForecastList = () => {
  const [option, setOption] = useState("hourly");
  const { forecast } = useSelector((state) => state.info);
  function switchOption() {
    setOption(option === "hourly" ? "daily" : "hourly");
  }
  return (
    <div className="forecasts">
      <p>
        {option}
        <button onClick={switchOption}>
          <HiOutlineSwitchHorizontal />
        </button>
      </p>
      <Grid container justifyContent="center" spacing={2}>
        {forecast.map((forecastInfo, i) => {
          return (
            <Grid container item xs={4} md={2} key={i} justifyContent="center">
              <Forecast
                delay={i * 200}
                option={option}
                forecastInfo={forecastInfo}
              />
            </Grid>
          );
        })}
      </Grid>
      {/* <Box display="flex" justifyContent="center" alignItems="center"></Box> */}
    </div>
  );
};

export default ForecastList;
