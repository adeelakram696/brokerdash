import dayjs from 'dayjs';
import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { containsDate, getColumnValue, normalizeColumnValues } from 'utils/helpers';
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

export const getAllOpenApprovals = async () => {
  const dateArray = [`"${dayjs().subtract(7, 'days').format('YYYY-MM-DD')}"`, `"${dayjs().format('YYYY-MM-DD')}"`];
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
    const approvalDateTime = getColumnValue(
      curr.parent_item.column_values,
      columnIds.deals.approval_date,
    );
    const channel = curr.parent_item.column_values.find(
      (col) => col.id === columnIds.deals.channel,
    )?.text;
    const isOutBound = channel === 'Phoneburner' || channel === 'Referral';
    // if its outbound then check approvalDateTime.changed_at to exclude if its under 48hr
    if (isOutBound && approvalDateTime && dayjs(approvalDateTime.changed_at).isAfter(dayjs().subtract(48, 'hour'))) return prev;
    // exclude if approvalDateTime.changed_at(e.g format 2025-06-20T15:09:49.694Z) is under 24hr
    if (approvalDateTime && dayjs(approvalDateTime.changed_at).isAfter(dayjs().subtract(24, 'hour'))) return prev;
    const group = curr.parent_item.group.title;
    const isFunded = group === 'Funded' || group === 'Offers Ready/Approved (Expired)'
    || group === 'Client Rejected - Expired' || group === 'Contracts Requested'
    || group === 'Contract Out' || group === 'Contract Signed'
    || group === 'Declined' || group === 'Lost Deals' || group === 'DQ'
    || group === 'DNC';
    const isRenew = containsDate(curr.parent_item.name);
    if (isFunded || isRenew) return prev;
    const obj = prev;
    const item = { ...curr.parent_item, subitems: [_.omit(curr, 'parent_item')] };
    if (obj[item.id]) {
      obj[item.id] = { ...item, subitems: [...obj[item.id].subitems, ...item.subitems] };
    } else obj[item.id] = item;
    return obj;
  }, {});
  const data = Object.values(reduced).map((item) => {
    const columns = normalizeColumnValues(item.column_values);
    const approvalDateTime = getColumnValue(item.column_values, columnIds.deals.approval_date);
    return {
      ...item,
      ...columns,
      approvalDateTime,
    };
  });
  return data;
};
