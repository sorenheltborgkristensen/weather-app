const express = require("express");
const app = express();
const fetch = require("node-fetch");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

app.use(express.static("public"));

app.get("/location/", async (req, res) => {
  const api_url = "https://freegeoip.app/json/";
  const response = await fetch(api_url);
  const data = await response.json();
  res.json(data);
});

app.get("/weather/:lat&:lon", async (req, res) => {
  const api_url =
    "https://api.openweathermap.org/data/2.5/onecall?" +
    new URLSearchParams({
      lat: req.params.lat,
      lon: req.params.lon,
      exclude: "minutely",
      units: "metric",
      appid: process.env.API_KEY,
    });
  const response = await fetch(api_url);
  const data = await response.json();
  res.json(data);
});
