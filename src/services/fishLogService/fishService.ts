import axios from 'axios';
const config = require('../../../config');

const fishLogService = axios.create({
  baseURL: `https://fish-log-2022-1.herokuapp.com`,
  timeout: 120000
});

export { fishLogService };
