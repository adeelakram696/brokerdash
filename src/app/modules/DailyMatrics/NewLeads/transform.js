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
    const leadCreationTime = getColumnValue(item.column_values, columnIds.leads.creation_date);
    const leadTouchedTime = getColumnValue(item.column_values, columnIds.leads.new_lead_or_touched);
    const timerEndData = getColumnValue(item.column_values, columnIds.leads.minutes_5);
    const isNew = columns[columnIds.leads.new_lead_or_touched] === 'Not Touched yet';
    const isAllPassed = columns[columnIds.leads.new_lead_or_touched] === 'Passed through all options';
    const isAllPassedTimer = columns[columnIds.leads.minutes_5] !== null;
    const isTouched = columns[columnIds.leads.new_lead_or_touched] === 'Touched';
    let time = 0;
    if (isNew && lastLeadAssigned?.changed_at) {
      time = dayjs().diff(dayjs(lastLeadAssigned?.changed_at), 'seconds');
    }
    let timeToRespond = 0;
    // for average calculation
    if (isAllPassedTimer) {
      timeToRespond = dayjs(timerEndData?.changed_at).diff(dayjs(leadCreationTime?.changed_at), 'seconds');
    } else if (isTouched) {
      timeToRespond = dayjs(leadTouchedTime?.changed_at).diff(dayjs(leadCreationTime?.changed_at), 'seconds');
    }
    return {
      key: item.id,
      name: item.name,
      stage: columns[columnIds.leads.stage],
      isNew,
      isAllPassed,
      isAllPassedTimer,
      isTouched,
      reassingTime: time <= 300 ? 300 - time : 0,
      time,
      queueTime: columns[columnIds.leads.time_in_the_que],
      channel: columns[columnIds.leads.channel],
      timeToRespond,
      assignedTo: columns[columnIds.leads.sales_rep],
    };
  });
  return _.sortBy(list, 'isNew').reverse();
}
