const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const _ = require("underscore");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const weatherMapAPIKey = process.env.OPEN_WEATHER_MAP_API_KEY;

if (weatherMapAPIKey === undefined || weatherMapAPIKey === "") {
    console.error("Please enter an API key in the .env file.");
    return process.exit(1);
}

// Ensure that there is a default value for PORT
const port = _.defaults(process.env, {
    PORT: 3000
}).PORT;

app.post("/api/weather", (req, res) => {
    const weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + weatherMapAPIKey
});

app.listen(port, () => {
    console.log("Began listening on port " + port);
});
