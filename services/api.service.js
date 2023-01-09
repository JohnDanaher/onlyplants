const axios = require('axios');
// require('dotenv').config();
// const myKey = 'GtwvOFPOA8yth1ZlegGDYzNUZWbm80Y-LHrNZXi318k'

// class ApiService {
//   constructor() {
//     this.api = axios.create({
//       baseURL: `https://trefle.io/api/v1/`
//     });
//   }

// findPlantName(name){
//     return this.api.get(`plants?token=${myKey}&filter%5Bcommon_name%5D=${name}`);

// } 
// };

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: `https://house-plants.p.rapidapi.com/common`,
      headers: {
        'X-RapidAPI-Key': 'ff98b136f1msh9608992364213e3p199f36jsn97d68b2dfb30',
        'X-RapidAPI-Host': 'house-plants.p.rapidapi.com'
      }
    });
  }

findPlant(name){
    return this.api.get(`/${name}`);
}

};

module.exports = ApiService;