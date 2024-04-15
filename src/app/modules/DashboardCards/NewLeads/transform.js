import _ from 'lodash';
import { columnIds } from 'utils/constants';

export function transformData(data) {
  return data.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'text');
    return {
      key: item.id,
      name: item.name,
      stage: columns[columnIds.leads.stage],
      isNew: columns[columnIds.leads.new_lead_or_touched],
      reassingTime: columns[columnIds.leads.time_in_the_que],
      time: columns[columnIds.leads.time_in_the_que],
    };
  });
}
