import { columnIds, env } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchAllNewLeadsData = async (cursor, dates) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  const query = `query {
    boards(ids: [${env.boards.leads}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.leads.application_date}", compare_value:[${dateArray}], operator:between}
          { column_id: "${columnIds.leads.phone_burner}", compare_value:"", operator:is_empty}
       ]
       operator: and
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          name
          id
          column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.last_lead_assigned}", "${columnIds.leads.new_lead_or_touched}", "${columnIds.leads.channel}", "${columnIds.leads.sales_rep}","${columnIds.leads.creation_date}","${columnIds.leads.minutes_5}", "${columnIds.leads.last_rep_assigned_date}"]) {
            id
            text
            value
          }
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res.data.boards[0].items_page;
};

export const getAllNewLeadsPages = async (dates) => {
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchAllNewLeadsData(res ? res.cursor : null, dates);
    itemsList = [...itemsList, ...res.items];
  } while (res.cursor);
  return itemsList;
};

export const fetchAllSubmittedDeals = async (cursor, dates) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  const query = `query {
    boards(ids: [${env.boards.deals}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.deals.application_date}", compare_value:[${dateArray}], operator:between}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          name
          id
          column_values(ids: ["${columnIds.deals.stage}", "${columnIds.deals.channel}","${columnIds.deals.pitched}", "${columnIds.deals.last_rep_assigned_date}"]) {
            id
            text
            value
          }
          subitems{
            id
            column_values (ids: ["${columnIds.subItem.status}", "${columnIds.subItem.funding_amount}"]){
              id
              text
            }
          }
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res.data.boards[0].items_page;
};

export const getAllSubmittedDeals = async (dates) => {
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchAllSubmittedDeals(res ? res.cursor : null, dates);
    itemsList = [...itemsList, ...res.items];
  } while (res.cursor);
  return itemsList;
};

export const fetchMetricsGoals = async () => {
  const query = `query {
    items(ids: [${env.metricsGoalItemId}]) {
      column_values{
        id
        text
      }
    }
  }`;
  const res = await monday.api(query);
  const columns = normalizeColumnValues(res.data.items[0].column_values);
  return columns;
};
