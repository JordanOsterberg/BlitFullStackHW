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
            zipCode: null,
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
                    {this.state.displayWeatherResult ? this.renderForecast() : this.renderInputs()}
                </div>
            </div>
        );
    }

    renderInputs() {
        return <div className="inputHolder">
            <input type="text"
                   placeholder="ZIP Code or City Name"
                   onChange={this.handleCityInputChange.bind(this)}
                   onKeyPress={(e) => {
                       if (e.key === "Enter") {
                           this.sendForecastRequest(this.state.cityInput, true)
                       }
                   }}
            />

            <button className="button" style={{
                marginTop: 10,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block'
            }} onClick={(e) => {
                e.preventDefault();
                this.sendForecastRequest(this.state.cityInput, true)
            }}>Get Forekast!</button>
        </div>;
    }

    renderForecast() {
        return <div className="weatherResult">
            <h2 style={{
                color: 'rgba(0, 0, 0, 0.5)',
                fontSize: 26,
                marginBottom: 0
            }}>{this.state.serverCityName}{this.state.zipCode !== null ? " (" + this.state.zipCode + ")" : null}{this.state.isResultCached ? <p style={{marginLeft: 6, display: 'inline', fontSize: 12, color: 'rgba(0, 0, 0, 0.5)'}}>Cached</p> : null}</h2>

            <h1 style={{
                fontSize: 48,
                marginTop: 3,
                marginBottom: 3
            }}>{this.state.temperature}&deg;F</h1>

            <h2 style={{
                color: 'rgba(0, 0, 0, 0.5)',
                fontSize: 22,
                marginTop: 3,
                marginBottom: 0
            }}>High: {this.state.temperatureHigh}&deg;F</h2>

            <h2 style={{
                color: 'rgba(0, 0, 0, 0.5)',
                fontSize: 22,
                marginBottom: 12,
                marginTop: 0
            }}>Low: {this.state.temperatureLow}&deg;F</h2>

            <button style={{display: 'inline'}}
                    className="button"
                    onClick={(e) => {
                        e.preventDefault();

                        const currentState = this.state;
                        currentState.displayWeatherResult = false;
                        this.setState(currentState);
                    }}>
                Change Location
            </button>

            <button style={{display: 'inline', marginLeft: 12}}
                    className="button"
                    onClick={(e) => {
                        e.preventDefault();

                        this.sendForecastRequest(this.state.cityInput, false)
                    }}>
                Reset Cache
            </button>
        </div>;
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

            if (/^\d+$/.test(cityInput)) {
                currentState.zipCode = cityInput;
            } else {
                currentState.zipCode = null;
            }

            this.setState(currentState);
        })
    }

}
