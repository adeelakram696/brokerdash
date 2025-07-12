import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { convertToNumber, getColumnValue, normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchTeamLeadersBoardEmployees = async () => {
  const query = `query {
    items(ids: [${env.teamLeaderBoardGoalItemId}]) {
      column_values(ids: ["person"]){
        value
      }
    }
  }`;
  const res = await monday.api(query);
  const resValue = JSON.parse(res.data.items[0].column_values[0].value);
  const personIds = resValue.personsAndTeams.map((persons) => persons.id);
  const usersQuery = `query {
    teams(ids: [1070128]) {
      users(ids: [${personIds}]) {
        id
        name
        photo_thumb
      }
    }
  }`;
  const usersResp = await monday.api(usersQuery);
  const usersList = usersResp.data.teams[0].users;
  return usersList;
};

export const fetchTeamGoals = async () => {
  const query = `query {
    items(ids: [${env.teamLeaderBoardGoalItemId}]) {
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

export const fetchUTeamSaleActivities = async (cursor, duration, actionIds, empIds, boardId) => {
  const query = `query {
    saleActivities: boards(ids: [${boardId}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "date__1", compare_value: ${duration}, operator: any_of}
          { column_id: "status", compare_value: [${actionIds}], operator: any_of}
          { column_id: "person", compare_value: [${empIds}], operator: any_of}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          name
          column_values(ids: ["person", "status", "date4", "date__1"]) {
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

export const getTeamTotalActivities = async (duration, actionIds, employees) => {
  const empIds = employees.map((emp) => (`"person-${emp.id}"`));
  let res = null;
  let itemsList = [];
  res = null;
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchUTeamSaleActivities(
      res ? res.data.saleActivities[0]?.items_page?.cursor : null,
      duration,
      actionIds,
      empIds,
      env.boards.salesActivities3,
    );
    itemsList = [...itemsList, ...((res.data?.saleActivities || [])[0]?.items_page?.items || [])];
  } while ((res.data?.saleActivities || [])[0]?.items_page?.cursor);
  const activities = itemsList.reduce((prev, curr) => {
    const type = curr?.column_values?.find((col) => col.id === 'status');
    const owner = getColumnValue(curr.column_values || [], 'person');
    const obj = prev;
    if (_.isEmpty(owner)) return obj;
    const person = employees.find(
      (emp) => owner.personsAndTeams[0].id === Number(emp.id),
    );
    if (!person) return obj;
    const actionType = type.text.toLowerCase();
    if (!obj[person.id]) {
      obj[person.id] = { [actionType]: 1, person };
    } else if (!obj[person.id][actionType]) {
      obj[person.id] = { ...obj[person.id], [actionType]: 1 };
    } else {
      obj[person.id][actionType] += 1;
    }
    return obj;
  }, {});
  return activities;
};

export const fetchDealFunds = async (cursor, employees) => {
  const empIds = employees.map((emp) => (`"person-${emp.id}"`));
  const query = `query {
    totalFunds: boards(ids: [${env.boards.deals}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.deals.funded__date}", compare_value: "THIS_MONTH", operator: any_of}
          { column_id: "${columnIds.deals.assginee}", compare_value: [${empIds}], operator: any_of}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          column_values(ids: ["${columnIds.deals.assginee}"]) {
            id
            text
            value
          }
          subitems {
            id
            name
            column_values (ids: ["${columnIds.subItem.status}", "${columnIds.subItem.funding_amount}"]) {
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

export const getDealFunds = async (employees) => {
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchDealFunds(
      res ? (res.data?.totalFunds || [])[0].items_page.cursor : null,
      employees,
    );
    itemsList = [...itemsList, ...(res.data?.totalFunds || [])[0].items_page.items];
  } while ((res.data?.totalFunds || [])[0].items_page.cursor);
  const funds = itemsList.reduce((prev, curr) => {
    const obj = prev;
    const selected = curr.subitems.find(
      (item) => item.column_values.find(
        (col) => (col.id === columnIds.subItem.status && col.text === 'Selected'),
      ),
    );
    if (!selected) return obj;
    const owner = getColumnValue(curr.column_values || [], columnIds.deals.assginee);
    if (_.isEmpty(owner)) return obj;
    const person = employees.find(
      (emp) => owner.personsAndTeams[0].id === Number(emp.id),
    );
    if (!person) return obj;
    const actionType = 'totalfunds';
    const actionTypeDeals = 'fully funded';
    if (!obj[person.id]) {
      obj[person.id] = {
        [actionType]: convertToNumber(selected.column_values[1].text),
        [actionTypeDeals]: 1,
        person,
      };
    } else if (!obj[person.id][actionType]) {
      obj[person.id] = {
        ...obj[person.id],
        [actionType]: convertToNumber(selected.column_values[1].text),
        [actionTypeDeals]: 1,
      };
    } else {
      obj[person.id][actionType] += convertToNumber(selected.column_values[1].text);
      obj[person.id][actionTypeDeals] += 1;
    }
    return obj;
  }, {});
  return funds;
};
