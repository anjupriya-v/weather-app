const express = require("express");
const bodyParser = require("body-parser")
const app = express();
require("dotenv").config();
const request = require('request');
const unirest = require("unirest");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const weatherApiKey = process.env.API_KEY;
var defaultCity = null;
var city = null;
const apiCall = unirest(
  "GET",
  process.env.API_CALL
);
apiCall.headers({
  "x-rapidapi-host": process.env.RAPIDAPI_HOST,
  "x-rapidapi-key": process.env.RAPIDAPI_KEY
});
apiCall.end(function (result) {
  if (result.error) throw new Error(result.error);
  defaultCity = result.body.city
});
app.get('/', (req, res) => {
  city =defaultCity;
  if (city === '') {
    res.render('index', { weatherData: null, errStatement: "City is not provided" });
  }
  var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`;
  request(weatherUrl, function (err, response, body) {
    if (err) {
      res.render('index', { weatherData: null, errStatement: "Please try again" });
    }
    else {
      weatherData = JSON.parse(body);
      if (weatherData.name !== undefined) {
        let temperature = weatherData.main.temp;
        var information = {
          icon: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + weatherData.weather[0].icon + ".svg",
          description: weatherData.weather[0].description,
          sunrise: weatherData.sys.sunrise,
          sunset: weatherData.sys.sunset,
          pressure: weatherData.main.pressure,
          humidity: weatherData.main.humidity,
          country: weatherData.sys.country,
          name: weatherData.name,
          clouds: weatherData.clouds.all,
          visibility: weatherData.visibility,
          temperature: weatherData.main.temp,
          main: weatherData.weather[0].main,
          fahrenheit: +(Math.round((((temperature * 9) / 5) + 32) + "e+2") + "e-2")
        }
        res.render('index', { information, weatherData, errStatement: null });      }
      else {
        res.render('index', { weatherData: null, errStatement: "Enter the correct city name" });
      }
    }
  })
})
app.post('/', (req, res) => {
  var city = req.body.city;
  if (city === '') {
    res.render('index', { weatherData: null, errStatement: "City is not provided" });
  }
  var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`;
  request(weatherUrl, function (err, response, body) {
    if (err) {
      res.render('index', { weatherData: null, errStatement: "Please try again..." });
    }
    else {
      weatherData = JSON.parse(body);
      if (weatherData.name !== undefined) {
        let temperature = weatherData.main.temp;
        var information = {
          icon: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/" + weatherData.weather[0].icon + ".svg",
          description: weatherData.weather[0].description,
          sunrise: weatherData.sys.sunrise,
          sunset: weatherData.sys.sunset,
          pressure: weatherData.main.pressure,
          humidity: weatherData.main.humidity,
          country: weatherData.sys.country,
          name: weatherData.name,
          clouds: weatherData.clouds.all,
          visibility: weatherData.visibility,
          temperature: weatherData.main.temp,
          main: weatherData.weather[0].main,
          fahrenheit: +(Math.round((((temperature * 9) / 5) + 32) + "e+2") + "e-2")
        }
        res.render('index', { information, weatherData, errStatement: null });
      }
      else {
        res.render('index', { weatherData: null, errStatement: "Enter the correct city name..." });
      }
    }
  })
})
app.listen(process.env.PORT ||3000, () =>
  console.log('App listening on port 3000!'),
);