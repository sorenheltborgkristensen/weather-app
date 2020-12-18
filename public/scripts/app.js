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
  function current() {
    const currentWeather = weatherData.current;
    const city = location.city;
    const sunrise = new Date(currentWeather.sunrise * 1000);
    const sunset = new Date(currentWeather.sunset * 1000);
    const currentMarkUp = `
      <h2>${city}</h2>
      <div>
        <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="${currentWeather.weather[0].description}" />
        <p>${currentWeather.temp}°</p>
      </div>
      <ul>
        <li>Føles som: ${currentWeather.feels_like}°</li>
        <li>UV index: ${currentWeather.uvi}</li>
        <li>Luftfugtighed: ${currentWeather.humidity}</li>
        <li>Sol op/ned: ${sunrise.getHours()}:${sunrise.getMinutes()}/${sunset.getHours()}:${sunset.getMinutes()}</li>
      </ul>
    `;

    document.getElementById("current-weather").innerHTML = currentMarkUp;
  }

  function daily() {
    weatherData.daily.map((day) => {
      console.log(day);
    });
  }

  function hourly() {
    weatherData.hourly.map((hour) => {
      console.log(hour);
    });
  }

  current();
  daily();
  hourly();
}

getWeather();
