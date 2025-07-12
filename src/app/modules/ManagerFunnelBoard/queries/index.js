import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchThisWeekLeads = async (cursor, dates, user) => {
  const userRule = `{ column_id: "${columnIds.leads.assginee}", compare_value: ["person-${user}"], operator: any_of}`;
  const query = `query {
    boards(ids: [${env.boards.leads}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.leads.application_date}", compare_value: [${dates}], operator: between}
          ${user ? userRule : ''}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          group {
            id
            title
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

export const fetchThisWeekDeals = async (cursor, dates, user) => {
  const userRule = `{ column_id: "${columnIds.deals.assginee}", compare_value: ["person-${user}"], operator: any_of}`;
  const query = `query {
    boards(ids: [${env.boards.deals}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.deals.application_date}", compare_value: [${dates}], operator: between}
          ${user ? userRule : ''}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          group {
            id
            title
          }
          column_values{
            id
            text
            value
          }
          subitems {
            id
            name
            column_values (ids: ["${columnIds.subItem.status}"]) {
              id
              text
              value
            }
          }
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res;
};

export const getThisWeekLeadsDeals = async (dates, user) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchThisWeekLeads(
      res ? res.data.boards[0].items_page.cursor : null,
      dateArray,
      user,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchThisWeekDeals(
      res ? res.data.boards[0].items_page.cursor : null,
      dateArray,
      user,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);
  const data = itemsList.map((item) => {
    const columns = normalizeColumnValues(item.column_values);
    return {
      ...item,
      ..._.omit(columns, 'subitems'),
      isDeal: _.has(item, 'subitems'),
    };
  });
  return data;
};
