import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import icons from "../constants/Icons";
const Forecast = ({ delay, option, forecastInfo }) => {
  const [forecast, setForecast] = useState({
    time: "",
    icon: "",
    temp: "",
  });
  const [styleInfo, setStyleInfo] = useState("");
  const [styleIcon, setStyleIcon] = useState("");
  const [isEntrance, setIsEntrance] = useState(true);

  useEffect(() => {
    setForecast({
      time: forecastInfo[option].time,
      icon: forecastInfo[option].icon,
      temp: forecastInfo[option].temp,
    });
    setIsEntrance(false);
    let timer = setTimeout(() => {
      setStyleInfo("reveal-info");
      setStyleIcon("reveal-icon");
    }, delay + 400);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    if (isEntrance) return;
    setStyleInfo("hide-info");
    setStyleIcon("hide-icon");
    let timer = setTimeout(() => {
      setForecast({
        time: forecastInfo[option].time,
        icon: forecastInfo[option].icon,
        temp: forecastInfo[option].temp,
      });
      setStyleInfo("reveal-info");
      setStyleIcon("reveal-icon");
    }, 600);
    return () => {
      clearTimeout(timer);
    };
  }, [option]);
  return (
    <div style={{ animationDuration: `${delay + 800}ms` }} className="forecast">
      <div className={styleInfo}>{forecast.time}</div>
      <svg
        id="Layer_1"
        enableBackground="new 0 0 512 512"
        height="512"
        viewBox="0 0 512 512"
        width="512"
        xmlns="http://www.w3.org/2000/svg"
        className={styleIcon}
      >
        {icons[forecast.icon]}
      </svg>
      <div className={`forecast-temp ` + styleInfo}>{forecast.temp}°</div>
    </div>
  );
};

export default Forecast;
