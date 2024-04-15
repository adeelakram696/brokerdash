import dayjs from 'dayjs';

export function transformData(data) {
  return data.map((list) => {
    const submittedData = list.subitems.find((subitem) => {
      const isSubmitted = subitem.column_values.find((cValue) => cValue.id === 'status' && cValue.text === 'Selected');
      return isSubmitted;
    });
    const time = submittedData.column_values.find((col) => col.id === 'date0').text;
    return {
      key: list.id,
      name: list.name,
      funder: submittedData.name,
      contractAmount: submittedData.column_values.find((col) => col.id === 'numbers0').text || '0',
      time: dayjs(time).fromNow(),
    };
  });
}
