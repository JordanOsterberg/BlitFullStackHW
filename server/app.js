const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
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

app.post("/api/weather", (req, res) => {
    const weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + weatherMapAPIKey
});

module.exports = app;
