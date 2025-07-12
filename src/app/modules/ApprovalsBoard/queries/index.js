import dayjs from 'dayjs';
import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchApprovals = async (cursor, dates) => {
  const query = `query {
    boards(ids: [${env.boards.submissions}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "__last_updated__", compare_value: [${dates}], operator: between, compare_attribute:"UPDATED_AT"}
          {column_id: "status" compare_value:[1] operator:any_of}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          updated_at
          parent_item {
            id
            name
            group {
              title
            }
            column_values(ids: ["${columnIds.deals.agent}","${columnIds.deals.client_name}","${columnIds.deals.phone_local}","${columnIds.deals.phone}", "${columnIds.deals.stage}", "${columnIds.deals.last_touched}","${columnIds.deals.approval_date}","${columnIds.deals.channel}"]){
              id
              text
              value
              ... on BoardRelationValue {  
                display_value
              } 
            }
          }
          column_values{
            id
            text
            value
          }
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res;
};

export const getAllApprovals = async () => {
  const dateArray = [`"${dayjs().subtract(31, 'days').format('YYYY-MM-DD')}"`, `"${dayjs().add(1, 'day').format('YYYY-MM-DD')}"`];
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchApprovals(
      res ? res.data.boards[0].items_page.cursor : null,
      dateArray,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);
  const reduced = itemsList.reduce((prev, curr) => {
    const isFunded = curr.parent_item?.column_values?.find(
      (c) => c.id === columnIds.deals.stage && (
        c.text === 'Funded'
    || c.text === 'DQ'
    || c.text === 'Lost Deals'
      ),
    );
    if (isFunded) return prev;
    const obj = prev;
    const item = { ...curr.parent_item, subitems: [_.omit(curr, 'parent_item')] };
    if (obj[item.id]) {
      obj[item.id] = { ...item, subitems: [...obj[item.id].subitems, ...item.subitems] };
    } else obj[item.id] = item;
    return obj;
  }, {});
  const data = Object.values(reduced).map((item) => {
    const columns = normalizeColumnValues(item.column_values);
    return {
      ...item,
      ...columns,
    };
  });
  return data;
};
