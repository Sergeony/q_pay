import {configuredAxios} from './configuredAxios';
const API_URL = 'http://localhost:8000/api/v1/trader/advertisements/';

const fetch = () => {
  return configuredAxios.get(API_URL);
};


export const advertisementsService = {
  fetch,
};
