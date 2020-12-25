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
      <h2><i class="wi wi-small-craft-advisory"></i>${city}</h2>
      <i class="wi wi-owm-day-${id}"></i>
      <p>${temp}°</p>
      <ul>
        <li>Føles som: ${feels_like}°</li>
        <li>UV index: ${uvi}</li>
        <li>Luftfugtighed: ${humidity}</li>
        <li><i class="wi wi-sunrise"></i>${sunriseHour}:${sunriseMinutes} <i class="wi wi-sunset"></i>${sunsetHour}:${sunsetMinutes}</li>
      </ul>
    `;

    document.getElementById("current").innerHTML = currentStructure;
  }

  function daily() {
    const days = weather.daily;
    days.splice(0, 1);

    days.map((day) => {
      const temp = Math.round(day.temp.day);
      const id = day.weather[0].id;
      const wind_deg = day.wind_deg;
      const wind_speed = Math.round(day.wind_speed);
      const weekday = new Date(day.dt * 1000).toLocaleDateString("default", { weekday: "long" });

      const dailyStructure = `
        <ul class="forecast-day">
          <li class="weekday">${weekday}</li>  
          <li class="icon-weather"><i class="wi wi-owm-day-${id}"></i></li>
          <li class="temperature">${temp}°</li>  
          <li class="icon-wind"><i class="wi wi-direction-down" style="transform: rotate(${wind_deg}deg)"></i></>
          <li>${wind_speed} m/s</li>
        </ul>
      `;

      document.getElementById("daily-weather").innerHTML += dailyStructure;
    });
  }

  function hourly() {
    const hourly = weather.hourly;
    const label = [];
    const temp = [];

    for (let i = 0; i < hourly.length; i++) {
      const element = hourly[i];
      const time = new Date(element.dt * 1000);
      label.push(time);
      temp.push(element.temp);
    }

    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: label.slice(0, 25),
        datasets: [
          {
            label: "Temperature",
            data: temp,
            borderWidth: 4,
            backgroundColor: "#E2E2E2",
            borderColor: "#404040",
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
          yAxes: [
            {
              scaleLabel: {
                display: false,
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
