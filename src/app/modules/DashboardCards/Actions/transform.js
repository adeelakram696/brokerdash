import dayjs from 'dayjs';
import _ from 'lodash';
import { columnIds } from 'utils/constants';

export function transformData(data) {
  const email = data.email.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'value');
    const lastChanged = JSON.parse(columns[columnIds.leads.action_required_emails]).changed_at;
    return {
      key: item.id,
      name: item.name,
      type: 'Email',
      isNew: true,
      lastAction: dayjs(lastChanged).fromNow(true),
    };
  });
  const sms = data.sms.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'value');
    const lastChanged = JSON.parse(columns[columnIds.leads.action_required_sms]).changed_at;
    return {
      key: item.id,
      name: item.name,
      type: 'SMS',
      isNew: true,
      lastAction: dayjs(lastChanged).fromNow(true),
    };
  });
  const file = data.file.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'value');
    const lastChanged = JSON.parse(columns[columnIds.leads.action_required_files]).changed_at;
    return {
      key: item.id,
      name: item.name,
      type: 'File Uploaded',
      isNew: true,
      lastAction: dayjs(lastChanged).fromNow(true),
    };
  });
  return _.sortBy([...email, ...sms, ...file], ['lastUpdated'], ['desc']);
}
