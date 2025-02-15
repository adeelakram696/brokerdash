import axios from 'axios';
import { env } from 'utils/constants';

export const resendSubmissionApplication = async (pulseId, pulseName) => {
  const payload = {
    event: {
      pulseId,
      pulseName,
    },
  };
  const res = await axios.post(`${env.apiBaseURL}/resubmit`, payload);
  return res;
};

export const submissionApplication = async (pulseId, pulseName) => {
  const payload = {
    event: {
      pulseId,
      pulseName,
    },
  };
  const res = await axios.post(`${env.apiBaseURL}/webhook/subItemCreated`, payload);
  return res;
};
