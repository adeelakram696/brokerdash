/* eslint-disable radix */
import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { commissionOnValues } from 'app/modules/LeadModal/TabsContent/Common/FundersList/data';
import { columnIds, env, stateSOS } from './constants';

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
export function numberWithCommas(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
  return numberWithCommas(result?.toFixed(2));
}
export function convertToNumber(input, returnIfBlank = false) {
  let value = input;
  if (returnIfBlank && value === '') return value;
  if (typeof value === 'string') {
    value = value?.replace(/,/g, '');
  }
  // Check if input is null, undefined, or a blank string
  if (typeof value !== 'number' && (value === null || value === undefined || value?.trim() === '')) {
    return 0;
  }

  // Convert the input to a number
  const number = Number(value);

  // Check if the result is a valid number
  if (Number.isNaN(number)) {
    return 0;
  }

  return number;
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
    [columnIds.subItem.funder_fee]: numberWithCommas(funderFee?.toFixed(2)),
    [columnIds.subItem.net_funding_amt]: numberWithCommas(netFundingAmt?.toFixed(2)),
    [columnIds.subItem.payback_amount]: numberWithCommas(paybackAmt.toFixed(2)),
    [columnIds.subItem.payback_period]: convertToNumber(paybackPeriod)?.toFixed(2),
    [columnIds.subItem.comission_amt]: getCommisionAmt({
      paybackAmt,
      fundingAmt,
      commissionPerc: Number(values[columnIds.subItem.commission_perc]) / 100,
      commisionCalcOn: values[columnIds.subItem.commission_calc_on],
    }),
    [columnIds.subItem.professional_service_fee]: ProfessionalServFee?.toFixed(2),
  };
}

export function getQueryParams(location) {
  return Object.fromEntries(new URLSearchParams(location.search));
}

export function splitActionFromUpdate(str, isAutomation) {
  const regex = /\[(.*?)\](.*)/s; // "s" flag allows dot to match newlines too
  const match = str.match(regex);

  if (match) {
    const action = isAutomation ? 'System Action' : match[1];
    const text = match[2].replace(/<br><br>/g, '').trim();
    return { action, text };
  }

  return { action: isAutomation ? 'System Action' : '', text: str };
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
  const objVal = JSON.parse(objCol.value || '{}');
  return objVal;
};
export const getColumnLinkedIds = (obj, col) => {
  const objCol = obj?.find((c) => c.id === col);
  return objCol.linked_item_ids;
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

export function getAvgTimeColor(avgTime, goalTime) {
  if (avgTime > goalTime) return 'red';
  if (avgTime + 15 >= goalTime) return 'orange';
  return 'green';
}
export function customSort(array, customOrder, exclude = false) {
  const orderMap = new Map();
  let data = array;
  if (exclude) {
    data = array.filter((val) => customOrder.includes(val));
  }
  // Create a map of custom order
  customOrder.forEach((item, index) => {
    orderMap.set(item, index);
  });

  // Sort the array based on the custom order
  return data.sort((a, b) => {
    const indexA = orderMap.has(a) ? orderMap.get(a) : customOrder.length;
    const indexB = orderMap.has(b) ? orderMap.get(b) : customOrder.length;
    return indexA - indexB;
  });
}
export function toSentenceCase(str) {
  if (!str) return str; // Return the string if it's empty or null
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024; // 1 KB = 1024 Bytes
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedBytes = parseFloat((bytes / k ** i).toFixed(2));

  return `${formattedBytes} ${sizes[i]}`;
}
export function getMostValue(obj, status) {
  return Object.values(obj).reduce((prev, curr) => {
    // eslint-disable-next-line no-param-reassign
    if (curr[status] > (prev[status] || 0)) prev = curr;
    return prev;
  }, {});
}
export function getTotalSum(obj, status) {
  return Object.values(obj).reduce((prev, curr) => {
    // eslint-disable-next-line no-param-reassign
    prev += (curr[status] || 0);
    return prev;
  }, 0);
}

export function maskNumber(input, showMask) {
  if (showMask || !input) return input;
  // Remove all non-digit characters
  const digits = input?.replace(/\D/g, '');
  const { length } = digits;

  if (length <= 4) {
    return digits;
  }

  // Mask all but the last 4 digits
  // const maskedPart = '*'.repeat(length - 4);
  const visiblePart = digits.slice(-4);

  // Reconstruct the masked number with original dashes
  let maskedInput = '';
  let maskedIndex = 0;
  let visibleIndex = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (/\D/.test(input[i])) { // if it's a non-digit character
      maskedInput += input[i];
    } else if (maskedIndex < length - 4) {
      maskedInput += '*';
      maskedIndex += 1;
    } else {
      maskedInput += visiblePart[visibleIndex];
      visibleIndex += 1;
    }
  }

  return maskedInput;
}
export function verifyDateFormat(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;

  // Trim whitespace
  const trimmedDate = dateString.trim();

  // Try to intelligently parse different date formats
  // Split the date by common delimiters
  const delimiters = ['-', '/', '.', ' '];
  let delimiter = '';
  let parts = [];

  // Use traditional for loop instead of for...of to avoid regenerator-runtime
  for (let i = 0; i < delimiters.length; i += 1) {
    const del = delimiters[i];
    if (trimmedDate.includes(del)) {
      delimiter = del;
      parts = trimmedDate.split(del).map((p) => p.trim());
      break;
    }
  }

  // If no delimiter found, check if it's a compact format
  if (parts.length === 0) {
    // Check for compact formats like YYYYMMDD or DDMMYYYY
    if (/^\d{8}$/.test(trimmedDate)) {
      // Try YYYYMMDD first
      const year1 = trimmedDate.substring(0, 4);
      const month1 = trimmedDate.substring(4, 6);
      const day1 = trimmedDate.substring(6, 8);
      if (parseInt(year1) >= 1900 && parseInt(year1) <= 2100
          && parseInt(month1) >= 1 && parseInt(month1) <= 12
          && parseInt(day1) >= 1 && parseInt(day1) <= 31) {
        return 'YYYYMMDD';
      }
      // Try DDMMYYYY
      const day2 = trimmedDate.substring(0, 2);
      const month2 = trimmedDate.substring(2, 4);
      const year2 = trimmedDate.substring(4, 8);
      if (parseInt(year2) >= 1900 && parseInt(year2) <= 2100
          && parseInt(month2) >= 1 && parseInt(month2) <= 12
          && parseInt(day2) >= 1 && parseInt(day2) <= 31) {
        return 'DDMMYYYY';
      }
    }
    return null;
  }

  // Must have exactly 3 parts for a valid date
  if (parts.length !== 3) return null;

  // Convert parts to numbers for validation
  const nums = parts.map((p) => parseInt(p));
  if (nums.some((n) => Number.isNaN(n) || n <= 0)) return null;

  // Determine the format based on the values
  const [first, second, third] = nums;

  // Helper to get the delimiter character for format string
  const getDelimiterChar = () => {
    if (delimiter === '/') return '/';
    if (delimiter === '.') return '.';
    if (delimiter === ' ') return ' ';
    return '-';
  };
  const del = getDelimiterChar();

  // Check if first part is definitely a year (4 digits or > 31)
  if (parts[0].length === 4 || first > 31) {
    // Year is first (YYYY-MM-DD or YYYY-DD-MM)
    if (second > 12 && second <= 31 && third >= 1 && third <= 12) {
      // YYYY-DD-MM format (day > 12, so it can't be month)
      return `YYYY${del}D${del}M`;
    } if (second >= 1 && second <= 12 && third >= 1 && third <= 31) {
      // YYYY-MM-DD format (standard ISO)
      return `YYYY${del}M${del}D`;
    }
  }

  // Check if last part is definitely a year (4 digits or > 31)
  if (parts[2].length === 4 || third > 31) {
    // Year is last (MM-DD-YYYY or DD-MM-YYYY)
    if (first > 12 && first <= 31 && second >= 1 && second <= 12) {
      // DD-MM-YYYY format (first > 12, so it can't be month)
      return `D${del}M${del}YYYY`;
    } if (first >= 1 && first <= 12 && second > 12 && second <= 31) {
      // MM-DD-YYYY format (second > 12, so it can't be month)
      return `M${del}D${del}YYYY`;
    } if (first >= 1 && first <= 12 && second >= 1 && second <= 12) {
      // Ambiguous case - both could be month or day
      // Default to US format (MM-DD-YYYY) for slash delimiter, EU format (DD-MM-YYYY) for others
      if (delimiter === '/') {
        return `M${del}D${del}YYYY`;
      }
      return `D${del}M${del}YYYY`;
    }
  }

  // Check for 2-digit year formats
  if (parts[2].length <= 2 && third >= 0 && third <= 99) {
    // Assume 2-digit year
    const yearSuffix = parts[2].length === 2 ? 'YY' : 'Y';
    if (first > 12 && first <= 31 && second >= 1 && second <= 12) {
      // DD-MM-YY format
      return `D${del}M${del}${yearSuffix}`;
    } if (first >= 1 && first <= 12 && second > 12 && second <= 31) {
      // MM-DD-YY format
      return `M${del}D${del}${yearSuffix}`;
    } if (first >= 1 && first <= 12 && second >= 1 && second <= 12) {
      // Ambiguous - default based on delimiter
      if (delimiter === '/') {
        return `M${del}D${del}${yearSuffix}`;
      }
      return `D${del}M${del}${yearSuffix}`;
    }
  }

  // Middle year format (rare but possible)
  if (parts[1].length === 4 || second > 31) {
    if (first >= 1 && first <= 12 && third >= 1 && third <= 31) {
      // MM-YYYY-DD format
      return `M${del}YYYY${del}D`;
    } if (first >= 1 && first <= 31 && third >= 1 && third <= 12) {
      // DD-YYYY-MM format
      return `D${del}YYYY${del}M`;
    }
  }

  // If we couldn't determine the format, return null
  return null;
}
export const sortData = (data, columnName, columnType, order) => data.sort((a, b) => {
  const valueA = a[columnName];
  const valueB = b[columnName];
  let comparison = 0;

  switch (columnType) {
    case 'string':
      comparison = valueA.localeCompare(valueB);
      break;

    case 'number':
      comparison = valueA - valueB;
      break;

    case 'date':
      // eslint-disable-next-line no-case-declarations
      const dateA = new Date(valueA.split('/').reverse().join('-'));
      // eslint-disable-next-line no-case-declarations
      const dateB = new Date(valueB.split('/').reverse().join('-'));
      comparison = dateA - dateB;
      break;

    default:
      throw new Error('Unsupported column type');
  }

  return order ? comparison : -comparison;
});

export function cutStringAfterLimit(text, limit) {
  if (text.length > limit) {
    return text.substring(0, limit);
  }
  return text;
}

export function formatDate(date, format) {
  const formattedDate = dayjs(date, ['YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'MM/DD/YYYY', 'MM-DD-YYYY', 'MM/DD/YYYY', 'M-D-YYYY', 'M/D/YYYY', 'M-D-YY', 'M/D/YY'], true);
  return formattedDate.isValid() ? formattedDate.format(format) : '';
}

export function cleanStrToNum(phoneNumber) {
  // Remove any non-digit characters using regex
  const cleanedNumber = phoneNumber?.replace(/\D/g, '');
  return cleanedNumber;
}
export function cleanPhoneNumber(phoneNumber) {
  // Check if the phone number starts with '+1' and remove it
  if (phoneNumber.startsWith('+1')) {
    // eslint-disable-next-line no-param-reassign
    phoneNumber = phoneNumber.substring(2);
  }
  return cleanStrToNum(phoneNumber);
}

export const openStateUrl = (st) => {
  const url = stateSOS[st];
  window.open(url, '_blank');
};

export function safeJsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return null; // Return null or a fallback value
  }
}

export const calculateDateDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

export function containsDate(str) {
  // Regex to match YYYY-MM-DD
  const datePattern = /\b\d{4}-\d{2}-\d{2}\b/;
  return datePattern.test(str);
}
