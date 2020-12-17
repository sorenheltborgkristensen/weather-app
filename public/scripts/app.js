async function getLocation() {
  const locationFetch = await fetch("location/");
  const locationData = await locationFetch.json();
  return locationData;
}

async function getWeather() {
  const location = await getLocation();
  const city = location.city;
  const weatherFetch = await fetch(`weather/${location.latitude}&${location.longitude}`);
  const weatherData = await weatherFetch.json();
  init(city, weatherData);
}

function init(city, weatherData) {
  function current() {
    const currentWeather = weatherData.current;
    const sunrise = new Date(currentWeather.sunrise * 1000);
    const sunset = new Date(currentWeather.sunset * 1000);
    console.log(sunrise.getHours(), sunset.getHours());
  }

  function daily() {
    console.log(weatherData.daily);
  }

  function hourly() {
    console.log(weatherData.hourly);
  }

  current();
  daily();
  hourly();
}

getWeather();
