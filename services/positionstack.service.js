const axios = require('axios');
var WeatherApi = require('weather_api');
var defaultClient = WeatherApi.ApiClient.instance;

// Configure API key authorization: ApiKeyAuth
var ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = process.env_WEATHERAPI_KEY;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//ApiKeyAuth.apiKeyPrefix = 'Token';

var apiInstance = new WeatherApi.APIsApi();

var q = "q_example"; // String | Pass US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree) or city name. Visit [request parameter section](https://www.weatherapi.com/docs/#intro-request) to learn more.

var opts = { 
  'lang': "lang_example" // String | Returns 'condition:text' field in API in the desired language.<br /> Visit [request parameter section](https://www.weatherapi.com/docs/#intro-request) to check 'lang-code'.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.realtimeWeather(q, opts, callback);

class WeatherApiService {
    constructor() {
        this.api = axios.create({
            baseURL: 'http://api.weatherapi.com/v1';
        })
    }

    getLocation = () => {

    }

}