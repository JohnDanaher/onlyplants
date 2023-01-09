// const axios = require('axios');
const cities = require('../data/cities.json');

class CitiesCustomApi {

    // constructor() {
    //     this.api = axios.create({
    //         baseURL: '../data/cities.json'
    //     })
    // }

    getCitiesSuggestions = (string) => {
        console.log(cities[0]);
    }

}

module.exports = CitiesCustomApi;