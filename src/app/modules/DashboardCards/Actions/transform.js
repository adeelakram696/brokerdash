import dayjs from 'dayjs';
import _ from 'lodash';
import { columnIds } from 'utils/constants';

export function transformData(data) {
  return data.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'text');
    return {
      key: item.id,
      name: item.name,
      type: columns[columnIds.leads.last_activity],
      isNew: true,
      lastAction: dayjs(columns[columnIds.leads.last_updated]).fromNow(true),
    };
  });
}
