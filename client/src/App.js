import React from 'react';
import './App.css';

const request = require("request");

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayWeatherResult: false,
            temperature: null,
            temperatureHigh: null,
            temperatureLow: null,
            serverCityName: null,
            isResultCached: false,

            cityInput: null
        }
    }

    render() {
        return (
            <div className="App">
                <img src={"./logo.png"} alt="Forekast Zone" style={{
                    maxHeight: 75
                }}/>

                <br/>

                <div style={{
                    marginTop: 15
                }}>
                    {this.state.displayWeatherResult ? <div className="weatherResult">
                        <p>{this.state.serverCityName} is currently {this.state.temperature}&deg;F. The high is {this.state.temperatureHigh}&deg;F, and the low is {this.state.temperatureLow}&deg;F. {this.state.isResultCached ? "(Cached)" : null}</p>
                    </div> : null}

                    <input type="text"
                           placeholder="City Name or ZIP Code"
                           onChange={this.handleCityInputChange.bind(this)}
                           onKeyPress={(e) => {
                               if (e.key === "Enter") {
                                   this.sendForecastRequest(this.state.cityInput, true)
                               }
                           }}
                    />

                    <button onClick={(e) => {
                        e.preventDefault();
                        this.sendForecastRequest(this.state.cityInput, true)
                    }}>Get Forekast!</button>

                    {this.state.isResultCached ? <button onClick={(e) => {
                        e.preventDefault();
                        this.sendForecastRequest(this.state.cityInput, false)
                    }}>Clear Cache</button> : null}
                </div>
            </div>
        );
    }

    handleCityInputChange(event) {
        const currentState = this.state;
        currentState.cityInput = event.target.value;
        this.setState(currentState);
    }

    sendForecastRequest(cityInput, allowsCache) {
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

            const currentState = this.state;
            currentState.displayWeatherResult = true;
            currentState.temperature = body.current;
            currentState.temperatureHigh = body.high;
            currentState.temperatureLow = body.low;
            currentState.serverCityName = body.city;
            currentState.isResultCached = body.isCached;
            this.setState(currentState);
        })
    }

}
