import axios from 'axios';
const config = require('../../../config');

const adminService = axios.create({
  baseURL: `https://user-2022-1.herokuapp.com`,
});

export { adminService };
