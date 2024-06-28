import dayjs from 'dayjs';
import { columnIds } from 'utils/constants';

export function transformData(data) {
  return data.map((list) => {
    const submittedData = list.subitems.find((subitem) => {
      const isSubmitted = subitem.column_values.find((cValue) => cValue.id === 'status' && cValue.text === 'Submitted');
      return isSubmitted;
    });
    const time = submittedData.column_values.find(
      (col) => col.id === columnIds.subItem.date_received,
    ).text;
    return {
      key: list.id,
      name: list.name,
      funder: submittedData.name || '-',
      maxApproved: submittedData.column_values.find((col) => col.id === columnIds.subItem.funding_amount).text || '-',
      time: dayjs(time).fromNow(),
    };
  });
}
