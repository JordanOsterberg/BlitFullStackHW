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

const Cache = require("./cache.js");
const forecastCache = new Cache();

const Database = require("./database");
const forekastDatabase = new Database(
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_PORT,
    process.env.POSTGRES_DATABASE
);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/api/forecast/historical", (req, res) => {
    const city = req.body.city;

    if (city === undefined || _.isEmpty(city)) {
        return res.status(400).json({
            error: "No city specified."
        })
    }

    const isCityZipCode = /^\d+$/.test(city);

    if (isCityZipCode) {
        forekastDatabase.fetchHistoricalForecastDataForZipCode(city).then((result) => {
            handleResult(result);
        }).catch((error) => {
            handleError(error);
        });
    } else {
        forekastDatabase.fetchHistoricalForecastDataForCityName(city).then((result) => {
            handleResult(result);
        }).catch((error) => {
            handleError(error);
        });
    }

    function handleResult(result) {
        res.status(200).json(result);
    }

    function handleError(error) {
        res.status(500).json({
            error: "Something went wrong while retrieving historical forecast data for " + city + "."
        });

        console.error(error)
    }
});

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

    const isCityZipCode = /^\d+$/.test(city);

    const weatherURL = "http://api.openweathermap.org/data/2.5/weather/?";
    const path = (isCityZipCode ?
        "zip=" + city :
        "q=" + city) + "&units=imperial&APPID=" + weatherMapAPIKey;

    request(weatherURL + path, (error, response, body) => {
        if (error) {
            return res.status(500).json({
                error: "Failed to communicate with weather API. Please try again later."
            })
        }

        body = JSON.parse(body);

        if (body.cod !== '200' && body.cod !== 200) {
            return res.status(Number(body.cod)).json({
                error: body.message
            })
        }

        const resultJSON = {
            current: body.main.temp,
            high: body.main.temp_max,
            low: body.main.temp_min,
            city: body.name,
            city_id: body.id,
            coords: body.coord,
            method: isCityZipCode ? "zip" : "name"
        };

        forecastCache.put(city, resultJSON, 60 * 30); // 30 minutes

        if (isCityZipCode) { // Insert the name of the city into the cache as well if we used a zip code
            forecastCache.put(body.main.name, resultJSON, 60 * 30);
        }

        forekastDatabase.insertForecastData(resultJSON.city, isCityZipCode ? city : null, resultJSON.current);

        res.status(200).json(resultJSON);
    })
});

// Ensure that there is a default value for PORT
const port = _.defaults(process.env, {
    PORT: 3000
}).PORT;

app.listen(port, () => {
    console.log("Began listening on port " + port);
});

module.exports = app;