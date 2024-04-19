import dayjs from 'dayjs';
import _ from 'lodash';
import { columnIds } from 'utils/constants';

export const getSeconds = (value) => {
  const [hours, minutes, seconds] = value.split(':');
  const timeInSeconds = dayjs.duration({ hours, minutes, seconds }).asSeconds();
  return timeInSeconds;
};
export const getFormated = (value) => {
  const [hours, minutes, seconds] = value.split(':');
  const timeInSeconds = dayjs.duration({ hours, minutes, seconds }).format('mm:ss');
  return timeInSeconds;
};
export function transformData(data) {
  return data.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'text');
    const reassingTime = getSeconds(columns[columnIds.leads.time_in_the_que]);
    const isNew = columns[columnIds.leads.new_lead_or_touched] === 'Not Touched yet';
    return {
      key: item.id,
      name: item.name,
      stage: columns[columnIds.leads.stage],
      isNew,
      reassingTime,
      time: 300 - reassingTime,
      queueTime: columns[columnIds.leads.time_in_the_que],
    };
  });
}
