async function getWeather() {
  // get location
  const positionFetch = await fetch("https://freegeoip.app/json/");
  const positionData = await positionFetch.json();
  const city = positionData.city;
  const lat = positionData.latitude;
  const lon = positionData.longitude;
  // get weather based on location
  const weatherFetch = await fetch(`weather/${lat}&${lon}`);
  const weatherData = await weatherFetch.json();
  const currentWeather = weatherData.current;
  const dailyWeather = weatherData.daily;
  const hourlyWeather = weatherData.hourly;
  // display weather data
  displayCurrentWeather(city, currentWeather);
  displayDailyWeather(dailyWeather);
  displayHourlyWeather(hourlyWeather);
}

function displayCurrentWeather(city, currentWeather) {
  console.log(currentWeather);
  const sunrise = new Date(currentWeather.sunset * 1000);
  const sunset = new Date(currentWeather.sunset * 1000);
  const markupCurrentWeather = `
    <h2>${city}</h2>
    <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].main}"></img>
    <p>${parseFloat(currentWeather.temp).toFixed(1)}°</p>
    <p>Følels som: ${parseFloat(currentWeather.feels_like).toFixed(1)}°</p>
    <p>UV-index: ${currentWeather.uvi}</p>
    <p>Luftfugtighed: ${currentWeather.humidity}</p>
    <p>Sol op/ned: ${sunrise.getHours()}:${sunrise.getMinutes()}/${sunset.getHours()}:${sunset.getMinutes()}</p>
    `;

  document.getElementById("current-weather").innerHTML = markupCurrentWeather;
}

function displayDailyWeather(dailyWeather) {
  console.log(dailyWeather);
}

function displayHourlyWeather(hourlyWeather) {
  console.log(hourlyWeather);
}

getWeather();
