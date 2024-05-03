import mondaySdk from 'monday-sdk-js';
import { getQueryParams } from './helpers';

const monday = mondaySdk();
const { sessionToken } = getQueryParams();
if (sessionToken) {
  monday.setToken(sessionToken);
} else {
  monday.setToken(process.env.REACT_APP_API_KEY);
}

export default monday;
