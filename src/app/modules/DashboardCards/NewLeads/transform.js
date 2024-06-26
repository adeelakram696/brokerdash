import dayjs from 'dayjs';
import _ from 'lodash';
import { columnIds } from 'utils/constants';
import { getColumnValue } from 'utils/helpers';

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
  const list = data.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'text');
    const lastLeadAssigned = getColumnValue(item.column_values, columnIds.leads.last_lead_assigned);
    const leadTouchedTime = getColumnValue(item.column_values, columnIds.leads.new_lead_or_touched);
    const isNew = columns[columnIds.leads.new_lead_or_touched] === 'Not Touched yet' && columns[columnIds.leads.channel] !== 'Phoneburner';
    const isAllPassed = columns[columnIds.leads.new_lead_or_touched] === 'Passed through all options';
    const isTouched = columns[columnIds.leads.new_lead_or_touched] === 'Touched';
    let time = 0;
    if (isNew && lastLeadAssigned?.changed_at) {
      time = dayjs().diff(dayjs(lastLeadAssigned?.changed_at), 'seconds');
    } else if (isTouched) {
      time = dayjs(leadTouchedTime?.changed_at).diff(dayjs(lastLeadAssigned?.changed_at), 'seconds');
    }
    return {
      key: item.id,
      name: item.name,
      stage: columns[columnIds.leads.stage],
      isNew,
      isAllPassed,
      isTouched,
      reassingTime: isNew || isTouched ? 300 - time : time,
      time,
      queueTime: columns[columnIds.leads.time_in_the_que],
    };
  });
  return _.sortBy(list, 'isNew').reverse();
}
