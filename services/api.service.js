const axios = require('axios');
// require('dotenv').config();
const {MYKEY} = process.env;
class ApiService {
  constructor() {
    this.api = axios.create({
baseURL: `https://house-plants2.p.rapidapi.com/`,
headers: {
  'X-RapidAPI-Key': `${MYKEY}`,
  'X-RapidAPI-Host': 'house-plants2.p.rapidapi.com'
}
});
}

findPlant(){
return this.api.get();
}

};

module.exports = ApiService;

