async function getLocation() {
  const locationFetch = await fetch("location/");
  const locationData = await locationFetch.json();
  return locationData;
}

async function getWeather() {
  const location = await getLocation();
  const weatherFetch = await fetch(`weather/${location.latitude}&${location.longitude}`);
  const weatherData = await weatherFetch.json();
  return weatherData;
}

async function getData() {
  try {
    const data = await Promise.all([getLocation(), getWeather()]);
    const [location, weather] = data;
    init(location, weather);
  } catch (error) {
    console.log(error);
  }
}

function init(location, weather) {
  function current() {
    const current = weather.current;
    const city = location.city;
    const id = current.weather[0].id;
    const temp = Math.round(current.temp);
    const feels_like = Math.round(current.feels_like);
    const uvi = current.uvi;
    const humidity = current.humidity;
    const sunrise = new Date(current.sunrise * 1000);
    const sunset = new Date(current.sunset * 1000);

    const currentStructure = `
      <h2>${city}</h2>
      <div>
        <i class="wi wi-owm-day-${id}"></i>
        <p>${temp}°</p>
      </div>
      <ul>
        <li>Føles som: ${feels_like}°</li>
        <li>UV index: ${uvi}</li>
        <li>Luftfugtighed: ${humidity}</li>
        <li>Sol op/ned: ${sunrise.getHours()}:${sunrise.getMinutes()}/${sunset.getHours()}:${sunset.getMinutes()}</li>
      </ul>
    `;

    document.getElementById("current").innerHTML = currentStructure;
  }

  function daily() {
    const days = weather.daily;

    days.map((day) => {
      const max = Math.round(day.temp.max);
      const min = Math.round(day.temp.min);
      const id = day.weather[0].id;
      const description = day.weather[0].description;
      const wind_deg = day.wind_deg;
      const wind_speed = Math.round(day.wind_speed);
      const dateNumber = new Date(day.dt * 1000).getDate();
      const dateName = new Date(day.dt * 1000).toLocaleDateString("default", { month: "short" });

      const dailyStructure = `
        <ul class="forecast-day">
          <li>${max}°/${min}°</li>  
          <li><i class="wi wi-owm-day-${id}"></i></li>
          <li>${description}</li>  
          <li><i class="wi wi-direction-down" style="transform: rotate(${wind_deg}deg)"></i></>
          <li>${wind_speed} m/s</li>
          <li>${dateNumber} ${dateName}</li>  
        </ul>
      `;

      document.getElementById("forecast").innerHTML += dailyStructure;
    });
  }

  function hourly() {
    const hourly = weather.hourly;
    hourly.map((hour) => {
      const date = new Date(hour.dt * 1000);
      //console.log(date);
    });
  }

  current();
  daily();
  hourly();
}

getData();
