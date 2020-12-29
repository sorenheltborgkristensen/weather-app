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
  function dayNight() {
    const currentHour = new Date().getHours();
    let iconDayNight;

    if (currentHour >= 06 && currentHour <= 20) {
      iconDayNight = "day";
    } else {
      iconDayNight = "night";
    }

    return iconDayNight;
  }

  function current() {
    const current = weather.current;
    const currentContainer = document.getElementById("current");

    // city
    const city = location.city;
    const cityContainer = document.createElement("h2");
    cityContainer.textContent = city;

    const data = {
      icon: current.weather[0].id,
      temp: Math.round(current.temp),
      feelsLike: Math.round(current.feels_like),
      uvi: Math.round(current.uvi),
      humidity: Math.round(current.humidity),
      sunrise: new Date(current.sunrise * 1000),
      sunset: new Date(current.sunset * 1000),
    };

    const list = document.createElement("ul");

    for (const weather in data) {
      if (Object.hasOwnProperty.call(data, weather)) {
        const element = data[weather];
        let listContent = element;
        const listItem = document.createElement("li");
        listItem.textContent = listContent;
        list.appendChild(listItem);

        if (data.icon === element) {
          const iconDayNight = dayNight();
          listItem.textContent = "";
          listItem.classList = `wi wi-owm-${iconDayNight}-${element}`;
        }

        if (data.sunrise === element) {
          listItem.textContent = listContent.getHours() + ":" + listContent.getMinutes();
        }

        if (data.sunset === element) {
          listItem.textContent = listContent.getHours() + ":" + listContent.getMinutes();
        }
      }
    }

    currentContainer.append(cityContainer, list);
  }

  function daily() {
    const dailyConstainer = document.getElementById("daily-weather");
    const days = weather.daily;
    days.splice(7, 1);

    for (let i = 0; i < days.length; i++) {
      const day = days[i];

      const data = {
        weekday: new Date(day.dt * 1000).toLocaleDateString("default", { weekday: "long" }),
        temp: Math.round(day.temp.day),
        icon: day.weather[0].id,
        windDeg: day.wind_deg,
        windSpeed: day.wind_speed,
      };

      const list = document.createElement("ul");

      for (const weather in data) {
        if (Object.hasOwnProperty.call(data, weather)) {
          const element = data[weather];

          const listContent = element;
          const listItem = document.createElement("li");
          listItem.textContent = listContent;
          list.appendChild(listItem);

          if (data.windDeg === element) {
            listItem.textContent = "";

            const windIcon = document.createElement("i");
            windIcon.classList = "wi wi-direction-down";
            windIcon.style = `transform: rotate(${element}deg)`;
            listItem.appendChild(windIcon);
          }

          if (data.icon === element) {
            const iconDayNight = dayNight();
            listItem.textContent = "";
            listItem.classList = `wi wi-owm-${iconDayNight}-${element}`;
          }
        }
      }

      dailyConstainer.appendChild(list);
    }
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

    // chart.js indstillinger
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
            backgroundColor: "rgba(226, 226, 226, 0.5)",
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
