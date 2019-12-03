const request = require("request");

function fetchWeather(cityInput: string, allowsCache: boolean, completionHandler: function) {
    request({
        method: 'POST',
        uri: 'http://server.forekast.zone/api/forecast',
        body: {
            city: cityInput,
            allowsCache: allowsCache
        },
        json: true
    }, (error, response, body) => {
        if (error || body.err !== undefined) {
            return;
        }

        completionHandler(body);
    })
}

function fetchHistoricalData(cityInput: string, completionHandler: function) {
    request({
        method: 'POST',
        uri: 'http://server.forekast.zone/api/forecast/historical',
        body: {
            city: cityInput,
        },
        json: true
    }, (error, response, body) => {
        if (error || body.err !== undefined) {
            return;
        }

        completionHandler(body);
    })
}

export { fetchWeather, fetchHistoricalData }