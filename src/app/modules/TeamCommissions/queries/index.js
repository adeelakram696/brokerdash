import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { getColumnValue, normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchDealFunded = async (cursor, user, dates) => {
  const query = `query {
    totalFunds: boards(ids: [${env.boards.deals}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.deals.funded__date}", compare_value: [${dates}], operator: between}
          { column_id: "${columnIds.deals.assginee}", compare_value: ["person-${user}"], operator: any_of}
          { column_id: "${columnIds.deals.stage}", compare_value: [1], operator: any_of}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          column_values(ids: ["${columnIds.deals.assginee}", "${columnIds.deals.channel}", "${columnIds.deals.funded__date}","${columnIds.deals.default}","${columnIds.deals.assginee_gci}","${columnIds.deals.shared_gci}"]) {
            id
            text
            value
          }
          subitems {
            id
            name
            column_values {
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

export const getDealsFundedByMonth = async (employee, month) => {
  const dates = [`"${month.startOf('month').format('YYYY-MM-DD')}"`, `"${month.endOf('month').format('YYYY-MM-DD')}"`];
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchDealFunded(
      res ? res.data.totalFunds[0].items_page.cursor : null,
      employee,
      dates,
    );
    itemsList = [...itemsList, ...res.data.totalFunds[0].items_page.items];
  } while (res.data.totalFunds[0].items_page.cursor);
  const filteredDeals = itemsList.filter((item) => {
    const selected = item.subitems.find(
      (subItem) => subItem.column_values.find(
        (col) => (col.id === columnIds.subItem.status && col.text === 'Selected'),
      ),
    );
    if (!selected) return false;
    const owner = getColumnValue(item.column_values || [], columnIds.deals.assginee);
    if (_.isEmpty(owner)) return false;
    // eslint-disable-next-line no-param-reassign
    if (owner.personsAndTeams[0]?.id === Number(employee)) item.isOwner = true;
    // eslint-disable-next-line no-param-reassign
    if (owner.personsAndTeams[1]?.id === Number(employee)) item.isShared = true;
    return owner.personsAndTeams[0]?.id === Number(employee)
    || owner.personsAndTeams[1]?.id === Number(employee);
  });
  return filteredDeals;
};

export const getCommissionSettings = async (userId) => {
  const query = `query {
    comissionSettings: boards(ids: [${env.boards.commissionSettings}]) {
      items_page(
      query_params: {
        rules: [
          { column_id: "${columnIds.commissionSettings.person}", compare_value: ["person-${userId}"], operator: any_of}
       ]
       }
      ) {
        items {
          id
          name
          column_values {
            id
            text
            value
          }
        }
      }
    }
  }`;
  const res = await monday.api(query);
  const items = res.data.comissionSettings[0]?.items_page?.items;
  const itemsWithCols = items?.map((item) => {
    const columnValues = normalizeColumnValues(item.column_values || {});
    return { ...item, ...columnValues };
  }) || [];

  return itemsWithCols;
};
