const request = require("request");

function fetchWeather(cityInput: string, allowsCache: boolean, completionHandler: function) {
    request({
        method: 'POST',
        uri: 'http://localhost:3000/api/forecast',
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

export { fetchWeather }