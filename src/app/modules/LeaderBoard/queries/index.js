/* eslint-disable no-await-in-loop */
import _ from 'lodash';
import { boardNames, columnIds, env } from 'utils/constants';
import { calculateDateDifference, convertToNumber, getColumnValue } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchLeadersBoardEmployees = async () => {
  const query = `query {
    items(ids: [${env.leaderEmployeeItemId}]) {
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

const fetchAssignedLeads = async (cursor, dates, users, board) => {
  const empIds = users.map((emp) => (`"person-${emp.id}"`));
  const userRule = `{ column_id: "${columnIds[board].assginee}", compare_value: [${empIds}], operator: any_of}`;
  const query = `query {
    boards(ids: [${env.boards[board]}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds[board].last_rep_assigned_date}", compare_value: [${dates}], operator: between}
          ${users.length > 0 ? userRule : ''}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          board{
            id
          }
          column_values(ids: ["${columnIds[board].assginee}"]) {
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

export const getAllLeadsAssigned = async (dates, users) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchAssignedLeads(
      res ? res.data.boards[0].items_page.cursor : null,
      dateArray,
      users,
      boardNames.leads,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchAssignedLeads(
      res ? res.data.boards[0].items_page.cursor : null,
      dateArray,
      users,
      boardNames.deals,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);
  const data = itemsList.reduce((prev, curr) => {
    const obj = prev;
    const owner = getColumnValue(
      curr.column_values || [],
      columnIds[env.boards[curr.board.id]].assginee,
    );
    if (_.isEmpty(owner)) return obj;
    const person = users.find(
      (emp) => owner.personsAndTeams[0].id === Number(emp.id),
    );
    if (!person) return obj;
    if (!obj[person.id]) {
      obj[person.id] = {
        // items: [curr],
        count: 1,
        person,
      };
    } else {
      // obj[person.id].items += [...obj[person.id].items, curr];
      obj[person.id].count += 1;
    }
    return obj;
  }, {});
  return data;
};

export const fetchAllLeadsAssigned = async (cursor, employees) => {
  const empIds = employees.map((emp) => `"person-${emp.id}"`);
  const query = `query {
    boards(ids: [${env.boards.leads}]) {
      items_page(
        ${!cursor ? `query_params: {
          rules: [
            { column_id: "${columnIds.leads.assginee}", compare_value: [${empIds}], operator: any_of}
            { column_id: "${columnIds.leads.stage}", compare_value: [11,14], operator: not_any_of}
          ]
        }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          column_values(ids: ["${columnIds.leads.assginee}"]) {
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

export const fetchAllDealsAssigned = async (cursor, employees) => {
  const empIds = employees.map((emp) => `"person-${emp.id}"`);
  const query = `query {
    boards(ids: [${env.boards.deals}]) {
      items_page(
        ${!cursor ? `query_params: {
          rules: [
            { column_id: "${columnIds.deals.assginee}", compare_value: [${empIds}], operator: any_of}
            { column_id: "${columnIds.deals.stage}", compare_value: [1,5,6,8,9,10,11,14], operator: not_any_of}
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
        }
      }
    }
  }`;
  const res = await monday.api(query);
  if (res?.data?.boards?.[0]?.items_page?.items) {
    res.data.boards[0].items_page.items = res.data.boards[0].items_page.items.map((item) => ({
      ...item,
      isDeal: true,
    }));
  }
  return res;
};

export const getAllAssignedLeadsDeals = async (employees) => {
  let res = null;
  let itemsList = [];
  do {
    res = await fetchAllLeadsAssigned(
      res ? res.data.boards[0].items_page.cursor : null,
      employees,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);

  do {
    res = await fetchAllDealsAssigned(
      res ? res.data.boards[0].items_page.cursor : null,
      employees,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);

  const data = itemsList.reduce((prev, curr) => {
    const owner = getColumnValue(
      curr.column_values || [],
      curr.isDeal ? columnIds.deals.assginee : columnIds.leads.assginee,
    );
    const obj = prev;
    if (_.isEmpty(owner)) return obj;
    const person = employees.find((emp) => owner.personsAndTeams[0].id === Number(emp.id));
    if (!person) return obj;
    if (!obj[person.id]) {
      obj[person.id] = 1;
    } else {
      obj[person.id] += 1;
    }
    return obj;
  }, {});
  return data;
};

export const fetchLeadsDisqualified = async (cursor, employees, duration) => {
  const empIds = employees.map((emp) => `"person-${emp.id}"`);
  const query = `query {
    boards(ids: [${env.boards.leads}]) {
      items_page(
        ${!cursor ? `query_params: {
          rules: [
            { column_id: "${columnIds.deals.last_rep_assigned_date}", compare_value: [${duration}], operator: between }
            { column_id: "${columnIds.leads.assginee}", compare_value: [${empIds}], operator: any_of}
            { column_id: "${columnIds.leads.stage}", compare_value: [11], operator: any_of}
          ]
        }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
          name
          column_values(ids: ["${columnIds.leads.assginee}"]) {
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

export const fetchDealsDisqualified = async (cursor, employees, duration) => {
  const empIds = employees.map((emp) => `"person-${emp.id}"`);
  const query = `query {
    boards(ids: [${env.boards.deals}]) {
      items_page(
        ${!cursor ? `query_params: {
          rules: [
            { column_id: "${columnIds.deals.last_rep_assigned_date}", compare_value: [${duration}], operator: between }
            { column_id: "${columnIds.deals.assginee}", compare_value: [${empIds}], operator: any_of}
            { column_id: "${columnIds.deals.stage}", compare_value: [9], operator: any_of}
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
        }
      }
    }
  }`;
  const res = await monday.api(query);
  if (res?.data?.boards?.[0]?.items_page?.items) {
    res.data.boards[0].items_page.items = res.data.boards[0].items_page.items.map((item) => ({
      ...item,
      isDeal: true,
    }));
  }
  return res;
};

export const getDisqualifiedLeadsDeals = async (employees, dates) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  let res = null;
  let itemsList = [];
  do {
    res = await fetchLeadsDisqualified(
      res ? res.data.boards[0].items_page.cursor : null,
      employees,
      dateArray,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);

  do {
    res = await fetchDealsDisqualified(
      res ? res.data.boards[0].items_page.cursor : null,
      employees,
      dateArray,
    );
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);

  const data = itemsList.reduce((prev, curr) => {
    const owner = getColumnValue(
      curr.column_values || [],
      curr.isDeal ? columnIds.deals.assginee : columnIds.leads.assginee,
    );
    const obj = prev;
    if (_.isEmpty(owner)) return obj;
    const person = employees.find((emp) => owner.personsAndTeams[0].id === Number(emp.id));
    if (!person) return obj;
    if (!obj[person.id]) {
      obj[person.id] = 1;
    } else {
      obj[person.id] += 1;
    }
    return obj;
  }, {});
  return data;
};

export const fetchDealFunds = async (cursor, employees, duration) => {
  const empIds = employees.map((emp) => (`"person-${emp.id}"`));
  const query = `query {
    totalFunds: boards(ids: [${env.boards.deals}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.deals.funded__date}", compare_value: [${duration}], operator: between}
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
          column_values(ids: ["${columnIds.deals.assginee}", "${columnIds.deals.last_rep_assigned_date}", "${columnIds.deals.funded__date}"]) {
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

export const getDealFunds = async (employees, dates) => {
  let res = null;
  let itemsList = [];
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  // Fetch all deals from API
  do {
    res = await fetchDealFunds(
      res ? (res.data?.totalFunds || [])[0].items_page.cursor : null,
      employees,
      dateArray,
    );
    itemsList = [...itemsList, ...(res.data?.totalFunds || [])[0].items_page.items];
  } while ((res.data?.totalFunds || [])[0].items_page.cursor);
  // Reduce function to process deals
  const funds = itemsList.reduce((prev, curr) => {
    const obj = prev;

    // Check if the deal is selected
    const selected = curr.subitems.find(
      (item) => item.column_values.find(
        (col) => col.id === columnIds.subItem.status && col.text === 'Selected',
      ),
    );
    if (!selected) return obj;

    // Get deal owner
    const owner = getColumnValue(curr.column_values || [], columnIds.deals.assginee);
    if (_.isEmpty(owner)) return obj;
    const person = employees.find(
      (emp) => owner.personsAndTeams[0].id === Number(emp.id),
    );
    if (!person) return obj;

    // Extract deal values
    const actionType = 'totalfunds';
    const actionTypeDeals = 'fully funded';
    const lastRepAssignedDate = getColumnValue(
      curr.column_values || [],
      columnIds.deals.last_rep_assigned_date,
    );
    const fundedDate = getColumnValue(curr.column_values || [], columnIds.deals.funded__date);
    const fundAmount = convertToNumber(selected.column_values[1].text);

    // Calculate date difference (days)
    const daysDifference = calculateDateDifference(lastRepAssignedDate?.date, fundedDate?.date);

    // Initialize person object if not present
    if (!obj[person.id]) {
      obj[person.id] = {
        [actionType]: fundAmount,
        [actionTypeDeals]: 1,
        totalDaysDifference: daysDifference,
        totalDeals: 1,
        person,
      };
    } else {
      // Update person's stats
      obj[person.id][actionType] += fundAmount;
      obj[person.id][actionTypeDeals] += 1;
      obj[person.id].totalDaysDifference += daysDifference;
      obj[person.id].totalDeals += 1;
    }

    return obj;
  }, {});

  // ✅ Compute averages per person
  Object.keys(funds).forEach((personId) => {
    const personData = funds[personId];
    const averageFunds = personData.totalfunds / personData.totalDeals;
    const averageDaysDifference = personData.totalDaysDifference / personData.totalDeals;

    funds[personId] = {
      ...personData,
      averageFunds: averageFunds.toFixed(2), // Format to 2 decimals
      averageDaysDifference: Math.round(averageDaysDifference), // Round to nearest whole number
    };
  });

  return funds;
};

export const fetchTeamSaleActivities = async (cursor, duration, actionIds, empIds, boardId) => {
  const query = `query {
    saleActivities: boards(ids: [${boardId}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "date__1", compare_value: [${duration}], operator: between}
          { column_id: "status", compare_value: [${actionIds}], operator: any_of}
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
  const dateArray = duration.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  let res = null;
  let itemsList = [];
  res = null;
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchTeamSaleActivities(
      res ? res.data?.saleActivities[0]?.items_page?.cursor : null,
      dateArray,
      actionIds,
      empIds,
      env.boards.salesActivities,
    );
    itemsList = [...itemsList, ...((res.data?.saleActivities || [])[0]?.items_page?.items || [])];
  } while ((res.data?.saleActivities || [])[0]?.items_page?.cursor);
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchTeamSaleActivities(
      res ? res.data?.saleActivities[0]?.items_page?.cursor : null,
      dateArray,
      actionIds,
      empIds,
      env.boards.salesActivities2,
    );
    itemsList = [...itemsList, ...((res.data?.saleActivities || [])[0]?.items_page?.items || [])];
  } while ((res.data?.saleActivities || [])[0]?.items_page?.cursor);
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchTeamSaleActivities(
      res ? res.data?.saleActivities[0]?.items_page?.cursor : null,
      dateArray,
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
