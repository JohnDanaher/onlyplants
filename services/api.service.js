const axios = require('axios');

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://ih-crud-api.herokuapp.com'
    });
  }
};

module.exports = ApiService;