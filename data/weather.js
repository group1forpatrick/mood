const axios = require("axios");
const owm_api =
  "https://api.openweathermap.org/data/2.5/weather?zip={zip code}&units=imperial&APPID=49925dfe45be1e525f0ed1e2e01bc41f";

async function getWeather(zip) {
  if (zip === undefined) throw "Must supply a zip code.";
  if (typeof zip !== "string") throw "Zip Code must be a string.";
  const addy = owm_api.replace("{zip code}", zip);
  const { data } = await axios.get(addy).catch(function(e) {
    console.log(
      `Weather: Error ${e.response.status}, ${e.response.data.message}`
    );
  });

  return {
    weather_tag: data.weather[0].main,
    weather_des: data.weather[0].description,
    max_temp: Math.round(parseInt(data.main.temp_max)),
    curr_temp: Math.round(parseInt(data.main.temp)),
    min_temp: Math.round(parseInt(data.main.temp_min)),
    city: data.name,
    weather_icon: data.weather[0].icon
  };
}

module.exports = { getWeather };
