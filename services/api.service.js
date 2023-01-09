const axios = require('axios');
// require('dotenv').config();
const {MYKEY} = process.env;
class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: `https://house-plants.p.rapidapi.com/common`,
      headers: {
        'X-RapidAPI-Key': `${MYKEY}`,
        'X-RapidAPI-Host': 'house-plants.p.rapidapi.com'
      }
    });
  }

findPlant(name){
    return this.api.get(`/${name}`);
}

};

module.exports = ApiService;