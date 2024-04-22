import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { env } from './constants';

export const removeBoardHeader = () => {
  const header = document.getElementById('mf-header');
  header?.remove();
};

export const uploadFileToMonday = async (options, query) => {
  const {
    onSuccess, onError, file, onProgress,
  } = options;
  let res = null;
  const apiKey = process.env.REACT_APP_API_KEY;
  const formData = new FormData();
  formData.append('query', query);
  formData.append('variables[file]', file);
  const config = {
    headers: {
      Authorization: apiKey,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      onProgress({ percent: (event.loaded / event.total) * 100 });
    },
  };
  try {
    const response = await axios.post(
      'https://api.monday.com/v2/file',
      formData,
      config,
    );

    res = response.data.data.id;
    onSuccess('Ok');
  } catch (error) {
    onError({ error });
  }
  return res;
};

export function downloadFiles(docs) {
  const downloadLinks = [];
  for (let i = 0; i < docs.length; i += 1) {
    const link = document.createElement('a');
    link.href = docs[i].url;
    link.target = '_blank'; // Example filename, you can use a more meaningful name
    link.style.display = 'none';
    document.body.appendChild(link);
    downloadLinks.push(link);
  }
  return downloadLinks;
}

export function normalizeColumnValues(columnsValues) {
  let columns = _.mapKeys(columnsValues, 'id');
  columns = _.mapValues(columns, 'text');
  return columns;
}

export const formatTimeIn = (seconds) => dayjs().startOf('day').add(seconds, 'second').format('mm:ss');

export function createViewURL(viewId, boardId) {
  return `${env.boardBaseURL}${boardId}/views${viewId}`;
}
