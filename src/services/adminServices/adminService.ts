import axios from 'axios';
const config = require('../../../config');

const adminService = axios.create({
  baseURL: `http://${config.IP_ADDRESS}:4000`,
});

export { adminService };
