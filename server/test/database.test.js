const assert = require("assert");

describe("Database", function() {
    const Database = require("../database");
    const testDatabase = new Database(
        "josterberg",
        "1234",
        "localhost",
        5432,
        "forekast",
        "historical_data_temp"
    );

    before(function(done) {
        testDatabase.pool.query(
            "BEGIN;\n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS public.historical_data_temp (\n" +
            "    id integer DEFAULT nextval('id_seq'::regclass) NOT NULL,\n" +
            "    city_name text NOT NULL,\n" +
            "    city_zip integer,\n" +
            "    \"timestamp\" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,\n" +
            "    temperature double precision NOT NULL,\n" +
            "    PRIMARY KEY(id)\n" +
            ");\n" +
            "\n" +
            "COMMIT;", (error) => {
                if (!error) {
                    done();
                }
            })
    });

    after(function() {
        testDatabase.pool.query("DROP TABLE historical_data_temp");
    });

    beforeEach(function(done) {
        testDatabase.pool.query("DELETE FROM historical_data_temp", (error) => {
            if (!error) {
                done();
            }
        })
    });

    it("should return a result when data exists for a zip code", function(done) {
        testDatabase.insertForecastData("Roseville", "95747", 50.0);

        // Wait to ensure that the database has updated with this temporary result
        setTimeout(() => {
            testDatabase.fetchHistoricalForecastDataForZipCode("95747").then((results) => {
                assert(results.length !== 0 && results[0].temperature === 50.0);
                done();
            }).catch((error) => {
                assert.fail("Error exists: " + error);
            })
        }, 1000)
    });

    it("should return a result when data exists for a city name", function(done) {
        testDatabase.insertForecastData("Roseville", null, 50.0);

        // Wait to ensure that the database has updated with this temporary result
        setTimeout(() => {
            testDatabase.fetchHistoricalForecastDataForCityName("Roseville").then((results) => {
                assert(results.length !== 0 && results[0].temperature === 50.0);
                done();
            }).catch((error) => {
                assert.fail("Error exists: " + error);
            })
        }, 1000)
    });
});