import mondaySdk from 'monday-sdk-js';

const monday = mondaySdk();
monday.setApiVersion('2025-01');
const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);
const params = {};
// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of queryParams.entries()) {
  params[key] = value;
}
if (!params.sessionToken) {
  monday.setToken(process.env.REACT_APP_API_KEY);
}

export default monday;
