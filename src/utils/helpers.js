import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { commissionOnValues } from 'app/modules/LeadModal/TabsContent/Common/FundersList/data';
import { columnIds, env } from './constants';

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
  return `${env.boardBaseURL}${boardId}/views/${viewId}`;
}

function getCommisionAmt({
  paybackAmt, fundingAmt, commissionPerc, commisionCalcOn,
}) {
  let result = 0;
  if (commisionCalcOn === commissionOnValues.onPayback) {
    result = paybackAmt
    * commissionPerc;
  } else if (commisionCalcOn === commissionOnValues.onFundingAmount) {
    result = fundingAmt
    * commissionPerc;
  }
  return result;
}

export function getFormulaValues(values) {
  const fundingAmt = Number(values[columnIds.subItem.funding_amount]);
  const ProfessionalServFee = fundingAmt
  * Number(values[columnIds.subItem.professional_fee_perc] / 100);
  const funderFee = fundingAmt
  * Number(values[columnIds.subItem.funder_fee_perc] / 100);
  const netFundingAmt = fundingAmt
  - ProfessionalServFee
  - funderFee;
  const paybackAmt = fundingAmt * Number(values[columnIds.subItem.factor_rate]);
  const paybackPeriod = paybackAmt / Number(values[columnIds.subItem.ach_amount]);
  return {
    [columnIds.subItem.funder_fee]: funderFee,
    [columnIds.subItem.net_funding_amt]: netFundingAmt,
    [columnIds.subItem.payback_amount]: paybackAmt,
    [columnIds.subItem.payback_period]: paybackPeriod?.toFixed(3),
    [columnIds.subItem.comission_amt]: getCommisionAmt({
      paybackAmt,
      fundingAmt,
      commissionPerc: Number(values[columnIds.subItem.commission_perc]) / 100,
      commisionCalcOn: values[columnIds.subItem.commission_calc_on],
    }),
    [columnIds.subItem.professional_service_fee]: ProfessionalServFee,
  };
}

export function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

export function splitActionFromUpdate(str) {
  const regex = /^\[(.*?)\]\s*(.*)$/;
  const match = str.match(regex);
  if (match) {
    const text = match[2].replace(/<br><br>/g, '');
    return { action: match[1], text };
  }
  return { action: '', text: str };
}

export function extractUrl(str) {
  const regex = /(https?:\/\/[^\s]+)/g;
  const matches = str.match(regex);
  return matches ? matches[0] : null;
}
export function extractLeastNumber(input) {
  if (!input) return 0;
  const numbers = input.match(/\d+/g);
  return numbers ? parseInt(numbers[0], 10) : null;
}

export const getColumnValue = (obj, col) => {
  const objCol = obj?.find((c) => c.id === col);
  const objVal = JSON.parse(objCol.value);
  return objVal;
};

export function isNineAMPassed() {
  const now = dayjs();
  const nineAMToday = dayjs().hour(9).minute(0).second(0);
  return now.isAfter(nineAMToday);
}
export function convertSequenceNameToKey(name) {
  const outputString = name
    .replace(/[/:]/g, '') // Replace all slashes and colons with blank
    .replace(/\s/g, '_') // Replace all spaces with underscores
    .replace(/&/g, '') // Remove all ampersands
    .replace(/__/g, '_') // Remove all ampersands
    .toLowerCase(); // Convert the string to lowercase
  return outputString;
}
