import mondaySdk from 'monday-sdk-js';

const monday = mondaySdk();
monday.setToken(process.env.REACT_APP_API_KEY);

export default monday;
