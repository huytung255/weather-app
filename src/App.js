import "./App.css";
import MainWrap from "./components/MainWrap";
import { useSelector } from "react-redux";
import SearchWrap from "./components/SearchWrap";
import { useEffect } from "react";
import defaultBackground from "./assets/nacho-rochon-CG7YwmRDGvI-unsplash.jpg";
import { backgrounds } from "./constants/Backgrounds";
import { useState } from "react";
function App() {
  const { isSearching, icon } = useSelector((state) => state.info);
  const [weatherBackground, setWeatherBackground] = useState(defaultBackground);
  useEffect(() => {
    Object.values(backgrounds).forEach((background) => {
      const img = new Image();
      img.src = background;
    });
  }, []);
  useEffect(() => {
    if (icon !== "") {
      setWeatherBackground(backgrounds[icon.substring(0, icon.length - 1)]);
      document.getElementById("defaultBackground").style.opacity = 0;
    } else {
      document.getElementById("defaultBackground").style.opacity = 1;
    }
  }, [icon]);

  return (
    <div className="">
      <img src={weatherBackground} alt="" className="background" />
      <img
        src={defaultBackground}
        alt=""
        className="background"
        id="defaultBackground"
      />
      {isSearching ? <SearchWrap /> : <MainWrap />}
    </div>
  );
}

export default App;
