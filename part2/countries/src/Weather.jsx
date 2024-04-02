import { useEffect, useState } from "react";
import axios from "axios";
const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}`
      )
      .then((response) => {
        console.log(response.data);
        setWeather(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  if (weather === null) return null;

  return (
    <div>
      <h4>{`Weather in ${country.capital[0]}:`}</h4>
      <p>{`Temperature: ${(weather.main.temp - 273.5).toFixed(2)} Celcius`}</p>
      <img
        alt="weather icon"
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />
      <p>{`Wind: ${weather.wind.speed} m/s`}</p>
    </div>
  );
};

export default Weather;
