async function getLocation() {
  const locationFetch = await fetch("location/");
  const locationData = await locationFetch.json();
  return locationData;
}

async function getWeather() {
  const location = await getLocation();
  const weatherFetch = await fetch(`weather/${location.latitude}&${location.longitude}`);
  const weatherData = await weatherFetch.json();
  init(location, weatherData);
}

function init(location, weatherData) {
  function currentWeather() {
    const currentWeather = weatherData.current;
    const city = location.city;
    const sunrise = new Date(currentWeather.sunrise * 1000);
    const sunset = new Date(currentWeather.sunset * 1000);
    const currentMarkUp = `
      <h2>${city}</h2>
      <div>
        <i class="wi wi-owm-day-${currentWeather.weather[0].id}"></i>
        <p>${Math.round(currentWeather.temp)}°</p>
      </div>
      <ul>
        <li>Føles som: ${Math.round(currentWeather.feels_like)}°</li>
        <li>UV index: ${currentWeather.uvi}</li>
        <li>Luftfugtighed: ${currentWeather.humidity}</li>
        <li>Sol op/ned: ${sunrise.getHours()}:${sunrise.getMinutes()}/${sunset.getHours()}:${sunset.getMinutes()}</li>
      </ul>
    `;
    document.getElementById("current").innerHTML = currentMarkUp;
  }

  function weeklyForecast() {
    weatherData.daily.map((weekday) => {
      const date = new Date(weekday.dt * 1000);
      const forecastMarkup = `
        <ul class="forecast-day">
          <li>${Math.round(weekday.temp.max)}°/${Math.round(weekday.temp.min)}°</li>  
          <li><i class="wi wi-owm-day-${weekday.weather[0].id}"></i></li>
          <li>${weekday.weather[0].description}</li>  
          <li><i class="wi wi-direction-down" style="transform: rotate(${weekday.wind_deg}deg)"></i></>
          <li>${Math.round(weekday.wind_speed)} m/s</li>
          <li>${date.getDate()} ${date.toLocaleDateString("default", { month: "short" })}</li>  
        </ul>
      `;
      document.getElementById("forecast").innerHTML += forecastMarkup;
    });
  }

  function hourlyForecast() {
    weatherData.hourly.map((hour) => {
      const date = new Date(hour.dt * 1000);
      //console.log(date);
    });
  }

  currentWeather();
  weeklyForecast();
  hourlyForecast();
}

getWeather();
