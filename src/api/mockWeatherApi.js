// Offline mock for the old OpenWeather endpoints used by this repo.
// Provides deterministic, local data for 9 weather types.

const WEATHER_TYPES = [
  {
    id: "clear",
    icon: "01d",
    description: "clear sky",
    baseTempK: 303.15,
  },
  {
    id: "fewClouds",
    icon: "02d",
    description: "few clouds",
    baseTempK: 297.15,
  },
  {
    id: "scatteredClouds",
    icon: "03d",
    description: "scattered clouds",
    baseTempK: 295.15,
  },
  {
    id: "brokenClouds",
    icon: "04d",
    description: "broken clouds",
    baseTempK: 294.15,
  },
  {
    id: "showerRain",
    icon: "09d",
    description: "shower rain",
    baseTempK: 291.15,
  },
  {
    id: "rain",
    icon: "10d",
    description: "rain",
    baseTempK: 289.15,
  },
  {
    id: "thunderstorm",
    icon: "11d",
    description: "thunderstorm",
    baseTempK: 287.15,
  },
  {
    id: "snow",
    icon: "13d",
    description: "snow",
    baseTempK: 272.15,
  },
  {
    id: "mist",
    icon: "50d",
    description: "mist",
    baseTempK: 285.15,
  },
];

function hashString(str) {
  // small deterministic hash
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickWeatherType(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return WEATHER_TYPES[0];

  // If user types a known keyword, force that weather.
  const keywordMap = new Map([
    ["clear", "clear"],
    ["sun", "clear"],
    ["cloud", "brokenClouds"],
    ["cloudy", "brokenClouds"],
    ["few", "fewClouds"],
    ["scatter", "scatteredClouds"],
    ["broken", "brokenClouds"],
    ["shower", "showerRain"],
    ["rain", "rain"],
    ["storm", "thunderstorm"],
    ["thunder", "thunderstorm"],
    ["snow", "snow"],
    ["mist", "mist"],
    ["fog", "mist"],
    ["haze", "mist"],
  ]);
  for (const [k, id] of keywordMap.entries()) {
    if (q.includes(k)) return WEATHER_TYPES.find((w) => w.id === id);
  }

  // Otherwise deterministically rotate between the 9 types based on query.
  const idx = hashString(q) % WEATHER_TYPES.length;
  return WEATHER_TYPES[idx];
}

function nowUnix() {
  return Math.floor(Date.now() / 1000);
}

function createDaily(dtStart, timezoneOffsetSeconds, weatherType) {
  // Match the consumption in `SearchWrap`: daily[i].temp.max/min and daily[i].weather[0].icon
  const arr = [];
  for (let i = 0; i < 7; i++) {
    const dayDt = dtStart + i * 86400;
    // Simple shaped temps
    const max = weatherType.baseTempK + 2 + (i % 3);
    const min = weatherType.baseTempK - 3 - (i % 2);
    arr.push({
      dt: dayDt,
      temp: { max, min },
      weather: [
        { description: weatherType.description, icon: weatherType.icon },
      ],
    });
  }
  return { timezone_offset: timezoneOffsetSeconds, daily: arr };
}

function createHourly(dtStart, timezoneOffsetSeconds, weatherType) {
  const arr = [];
  for (let i = 0; i < 8; i++) {
    const dt = dtStart + i * 3600;
    const temp = weatherType.baseTempK + Math.sin(i / 2) * 2;
    arr.push({
      dt,
      temp,
      weather: [
        { description: weatherType.description, icon: weatherType.icon },
      ],
    });
  }
  return { timezone_offset: timezoneOffsetSeconds, hourly: arr };
}

function asAxiosResponse(data) {
  return Promise.resolve({ data });
}

const mockWeatherApi = {
  /**
   * Mimics `axios.get('weather', { params: { q } })`
   */
  getWeatherByCity(q) {
    const dt = nowUnix();
    const timezone = 0;
    const weatherType = pickWeatherType(q);

    // Deterministic pseudo-coordinates based on query
    const h = hashString((q || "").toLowerCase());
    const lat = ((h % 180000) / 1000 - 90).toFixed(4);
    const lon = (((h / 180000) % 360000) / 1000 - 180).toFixed(4);

    const tempJitter = (h % 600) / 100 - 3; // -3..+3
    const temp = weatherType.baseTempK + tempJitter;

    return asAxiosResponse({
      name: (q || "Unknown").trim() || "Unknown",
      dt,
      timezone,
      main: { temp },
      weather: [
        { description: weatherType.description, icon: weatherType.icon },
      ],
      coord: { lat: Number(lat), lon: Number(lon) },
    });
  },

  /**
   * Mimics `axios.get('onecall', { params: { lat, lon, exclude } })`
   */
  getOneCall({ lat, lon }) {
    const dt = nowUnix();
    const timezone_offset = 0;

    // Choose a type based on lat/lon so it stays stable per "location"
    const seed = `${lat},${lon}`;
    const weatherType = WEATHER_TYPES[hashString(seed) % WEATHER_TYPES.length];

    const daily = createDaily(dt, timezone_offset, weatherType).daily;
    const hourly = createHourly(dt, timezone_offset, weatherType).hourly;

    return asAxiosResponse({
      timezone_offset,
      daily,
      hourly,
    });
  },

  WEATHER_TYPES,
};

export default mockWeatherApi;
export { WEATHER_TYPES };
