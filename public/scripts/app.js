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
    const sunriseHour = new Date(current.sunrise * 1000).getHours();
    const sunriseMinutes = new Date(current.sunrise * 1000).getMinutes();
    const sunsetHour = new Date(current.sunset * 1000).getHours();
    const sunsetMinutes = new Date(current.sunset * 1000).getMinutes();

    const currentStructure = `
      <h2>${city}</h2>
      <i class="wi wi-owm-day-${id}"></i>
      <p>${temp}°</p>
      <ul>
        <li>Føles som: ${feels_like}°</li>
        <li>UV index: ${uvi}</li>
        <li>Luftfugtighed: ${humidity}</li>
        <li>Sol op/ned: ${sunriseHour}:${sunriseMinutes}/${sunsetHour}:${sunsetMinutes}</li>
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
      const date = dateNumber + " " + dateName;

      const dailyStructure = `
        <ul class="forecast-day">
          <li>${max}°/${min}°</li>  
          <li><i class="wi wi-owm-day-${id}"></i></li>
          <li>${description}</li>  
          <li><i class="wi wi-direction-down" style="transform: rotate(${wind_deg}deg)"></i></>
          <li>${wind_speed} m/s</li>
          <li>${date}</li>  
        </ul>
      `;

      document.getElementById("daily").innerHTML += dailyStructure;
    });
  }

  function hourly() {
    const hourly = weather.hourly;
    const label = [];
    const temp = [];

    for (let i = 0; i < hourly.length; i++) {
      const element = hourly[i];
      const time = new Date(element.dt * 1000);
      temp.push(element.temp);
      label.push(time);
    }

    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: label.slice(0, 24),
        datasets: [
          {
            label: "Temperature",
            data: temp,
            borderWidth: 1,
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(255, 99, 132, 1)",
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        tooltips: {
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "hour",
                stepSize: 1,
                displayFormats: {
                  minute: "HH:mm",
                  hour: "HH:mm",
                },
              },
            },
          ],
        },
      },
    });
  }

  current();
  daily();
  hourly();
}

getData();
