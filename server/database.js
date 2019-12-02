const Pool = require("pg").Pool;

function Database(user, password, host, port, database) {
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: port,
        database: database
    });

    this.fetchHistoricalForecastDataForCityName = (cityName) => {
        return new Promise(((resolve, reject) => {
            pool.query("SELECT * FROM historical_data WHERE city_name = $1 ORDER BY timestamp DESC", [cityName], (error, results) => {
                if (error) {
                    return reject(error);
                }

                resolve(results.rows);
            });
        }));
    };

    this.fetchHistoricalForecastDataForZipCode = (zipCode) => {
        return new Promise(((resolve, reject) => {
            pool.query("SELECT * FROM historical_data WHERE city_zip = $1 ORDER BY timestamp DESC", [zipCode], (error, results) => {
                if (error) {
                    return reject(error);
                }

                resolve(results.rows);
            });
        }));
    };

    this.insertForecastData = (cityName, zipCode, temperature) => {
        pool.query(
            "INSERT INTO historical_data (city_name, city_zip, temperature) VALUES ($1, $2, $3)",
            [cityName, zipCode, temperature],
            (error) => {
                if (error) {
                    console.error(error);
                }
            });
    };

}

module.exports = Database;