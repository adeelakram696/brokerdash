import _ from 'lodash';
import { columnIds, env } from 'utils/constants';

export function transformData(data) {
  const list = data.map((item) => {
    let columns = _.mapKeys(item.column_values, 'id');
    columns = _.mapValues(columns, 'text');
    const board = env.boards[item.board.id];
    return {
      key: item.id,
      name: item.name,
      stage: columns[columnIds[board].stage],
      board,
    };
  });
  return list;
}
