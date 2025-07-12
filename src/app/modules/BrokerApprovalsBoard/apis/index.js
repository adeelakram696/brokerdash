import axios from 'axios';
import { env } from 'utils/constants';

export const fetchBrokerUsers = async (userId) => {
  const res = await axios.get(`${env.apiBaseURL}/fetchBrokerUsers/${userId}`);
  return res?.data?.userIds || [userId];
};

export const fetchBrokerApprovals = async (userIds) => {
  const res = await axios.post(`${env.apiBaseURL}/fetchBrokerApprovals`, { userIds });
  return res?.data || [];
};

export const fetchUsersByIds = async (userIds) => {
  const res = await axios.post(`${env.apiBaseURL}/fetchUsersByIds`, { userIds });
  return res?.data || [];
};
