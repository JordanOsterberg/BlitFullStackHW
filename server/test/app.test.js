const assert = require("assert");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe("server", function() {
    describe("POST /api/forecast", function() {
        it("should return status code 400 when an invalid city is received", function(done) {
            chai.request(server)
                .post("/api/forecast")
                .send()
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property("error");
                    done()
                })
        });

        it("should return a valid response when a valid city is received", function(done) {
            chai.request(server)
                .post("/api/forecast")
                .send({city: "95747"})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("current");
                    res.body.should.have.property("high");
                    res.body.should.have.property("low");
                    res.body.should.have.property("city");
                    res.body.should.have.property("city_id");
                    res.body.should.have.property("coords");
                    res.body.should.have.property("method");
                    done()
                });
        });

        it("should return method of `zip` when a zip code is specified", function(done) {
            chai.request(server)
                .post("/api/forecast")
                .send({city: "95747"})
                .end((err, res) => {
                    res.should.have.status(200);
                    assert(res.body.method === "zip");
                    done()
                });
        });

        it("should return method of `name` when a city name is specified", function(done) {
            chai.request(server)
                .post("/api/forecast")
                .send({city: "Roseville"})
                .end((err, res) => {
                    res.should.have.status(200);
                    assert(res.body.method === "name");
                    done()
                });
        });

        it("should return status code 404 for zip code of `1234`", function(done) {
            chai.request(server)
                .post("/api/forecast")
                .send({city: "1234"})
                .end((err, res) => {
                    res.should.have.status(404);
                    done()
                });
        });
    });
});