import axios from 'axios';
import { env } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';

export const fetchCommissionSettings = async (userId) => {
  const res = await axios.get(`${env.apiBaseURL}/fetchCommissionSettings/${userId}`);
  const items = res?.data?.data?.comissionSettings[0]?.items_page?.items;
  const itemsWithCols = items?.map((item) => {
    const columnValues = normalizeColumnValues(item.column_values || {});
    return { ...item, ...columnValues };
  }) || [];

  return itemsWithCols;
};
