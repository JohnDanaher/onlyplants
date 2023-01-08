const axios = require('axios');

class WeatherApi {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://api.m3o.com/v1/',
            headers: {
              'Authorization': `Bearer ${process.env.M30WEATHER_API_KEY}`,
              'Content-Type': 'application/json'
            }
        })
    }

    getWeather = (location) => {
      return this.api.post('weather/Now',
      {
          'location': location
      })
    }

}

module.exports = WeatherApi;