// Requiring the Packages
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

// Declaring the variables
let weatherTemp = "";
let weatherDesc = "";
let weatherIcon = "";
let weatherCity = "";

// Adding the routes
app.get("/", function(req, res) {

  let today = new Date();
  let options = {
    month: "long",
    day: "numeric",
    year: "numeric"
  }

  let date = today.toLocaleDateString("en-US", options);


  res.render("weather", {
    finalTemp: weatherTemp,
    finalDesc: weatherDesc,
    finalIcon: weatherIcon,
    currentDate: date,
    city: weatherCity
  });

  weatherCity = "";
});



app.post("/", function(req, res) {
  const query = req.body.cityName;
  if (query.length != 0) {
    const apiKey = "<Your API Key>";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function(response) {

      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const desc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const button = req.body.button;

        weatherTemp = temp;
        weatherDesc = desc;
        weatherIcon = iconURL;
        weatherCity = _.capitalize(query);
        buttonClick = button;
        res.redirect("/");
      });
    });
  } else {
    res.redirect("/");
  }
});

// Declaring the Server's Port Number
app.listen(process.env.PORT || 3000, function() {
  console.log("I am running on port no 3000.");
});
