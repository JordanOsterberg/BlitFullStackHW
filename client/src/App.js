import React from 'react';
import './App.css';

const request = require("request");

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayWeatherResult: false,
            temperature: null,
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
                        <p>{this.state.serverCityName} is currently {this.state.temperature}&deg;F {this.state.isResultCached ? "(Cached)" : null}</p>
                    </div> : null}

                    <input type="text"
                           placeholder="City Name or ZIP Code"
                           onChange={this.handleCityInputChange.bind(this)}/>

                    <button onClick={(e) => {
                        e.preventDefault();
                        this.sendForecastRequest(this.state.cityInput, false)
                    }}>Get Forekast!</button>
                </div>
            </div>
        );
    }

    handleCityInputChange(event) {
        const currentState = this.state;
        currentState.cityInput = event.target.value;
        this.setState(currentState);

        this.sendForecastRequest(currentState.cityInput, true);
    }

    sendForecastRequest(cityInput, allowsCache) {
        request({
            method: 'POST',
            uri: 'http://localhost:3000/api/forecast',
            body: {
                city: cityInput,
                allowsCache: allowsCache || true
            },
            json: true
        }, (error, response, body) => {
            if (error || body.err !== undefined) {

                return;
            }

            const currentState = this.state;
            currentState.displayWeatherResult = true;
            currentState.temperature = body.current;
            currentState.serverCityName = body.city;
            currentState.isResultCached = body.isCached;
            this.setState(currentState);
        })
    }

}
