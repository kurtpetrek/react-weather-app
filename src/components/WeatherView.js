import React from 'react';

export default function WeatherView(props) {
  const {
    weather,
    forecast,
    location,
    handleSearchNewLocation
  } = props;


  return (
    <div>
      <h3>Current Weather in</h3>
      <h1>{location}</h1>
      <h1>{Math.round(weather.main.temp)} &deg;F</h1>
      <h2>{weather.weather[0].description}</h2>
      <button onClick={handleSearchNewLocation}>Search New Location</button>
    </div>
  );
}
