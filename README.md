# BlitFullstackHW

A working version of the project is deployed at https://forekast.zone, in case there is some issue in getting the local copy to run, or you don't want to deal with getting an API key for OpenWeatherMap.

Instructions:
1. Get an OpenWeatherMap API key (https://openweathermap.org/)
2. Create a new .env file for the server that contains this API key. See example.env for an example env file.
3. Run server/app.js: 
    ```
    cd server
    node app.js
    ```
   
4. Run client frontend:
    ```
    cd client
    npm start
    ```