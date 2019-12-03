const Pool = require("pg").Pool;
const _ = require("underscore");

function Database(user, password, host, port, database, table) {
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: port,
        database: database
    });

    table = _.defaults({table: table}, {
        table: "historical_data"
    }).table;

    this.pool = pool; // For testing

    this.fetchHistoricalForecastDataForCityName = (cityName) => {
        return new Promise(((resolve, reject) => {
            pool.query("SELECT * FROM " + table + " WHERE city_name = $1 ORDER BY timestamp DESC", [cityName], (error, results) => {
                if (error) {
                    return reject(error);
                }

                resolve(results.rows);
            });
        }));
    };

    this.fetchHistoricalForecastDataForZipCode = (zipCode) => {
        return new Promise(((resolve, reject) => {
            pool.query("SELECT * FROM " + table + " WHERE city_zip = $1 ORDER BY timestamp DESC", [zipCode], (error, results) => {
                if (error) {
                    return reject(error);
                }

                resolve(results.rows);
            });
        }));
    };

    this.insertForecastData = (cityName, zipCode, temperature) => {
        pool.query(
            "INSERT INTO " + table + " (city_name, city_zip, temperature) VALUES ($1, $2, $3)",
            [cityName, zipCode, temperature],
            (error) => {
                if (error) {
                    console.error(error);
                }
            });
    };

}

module.exports = Database;