const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const _ = require("underscore");
const request = require("request");
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

const Cache = require("./cache.js");
const forecastCache = new Cache();

app.post("/api/forecast", (req, res) => {
    const city = req.body.city;
    let allowsCache = req.body.allowsCache;

    if (city === undefined || _.isEmpty(city)) {
        return res.status(400).json({
            error: "No city specified."
        })
    }

    if (allowsCache === undefined) {
        allowsCache = true;
    }

    const cachedObject = forecastCache.get(city);
    if (cachedObject != null && allowsCache) {
        cachedObject.isCached = true; // Set this property so the frontend knows to display cache indicator
        return res.status(200).json(cachedObject);
    }

    const weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + weatherMapAPIKey;

    request(weatherURL, (error, response, body) => {
        if (error) {
            return res.status(500).json({
                error: "Failed to communicate with weather API. Please try again later."
            })
        }

        body = JSON.parse(body);
        const resultJSON = {
            current: body.main.temp,
            high: body.main.temp_max,
            low: body.main.temp_min,
            city: body.name,
            city_id: body.id,
            coords: body.coord
        };

        forecastCache.put(city, resultJSON, 10);

        res.status(200).json(resultJSON);
    })
});

app.listen(port, () => {
    console.log("Began listening on port " + port);
});
