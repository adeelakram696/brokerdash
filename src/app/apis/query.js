import { transformFundersforQM } from 'app/modules/LeadModal/QualificationMatrixForm/matrixData';
import dayjs from 'dayjs';
import drawer from 'drawerjs';
import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { convertToNumber, getColumnValue, normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchUser = () => drawer.get('user');
export const fetchCurrentDate = () => dayjs().format('YYYY-MM-DD');

export const fetchCurrentUser = async () => {
  const res = await monday.api(`query {
    me {
      id
      name
      is_admin
    }
  }`);
  const value = res?.data ? res.data.me : '';
  drawer.set({ user: value });
  return value;
};
export const fetchGroups = async () => {
  const res = await monday.api(`query {
    deals: boards(ids: [${env.boards.deals}]) {
      groups{
        id
        title
      }
    }
    leads: boards(ids: [${env.boards.leads}]) {
      groups{
        id
        title
      }
    }
  }`);
  const dealGroups = res.data.deals[0].groups?.map(
    (group) => ({ value: group.id, label: group.title }),
  );
  const leadGroups = res.data.leads[0].groups?.map(
    (group) => ({ value: group.id, label: group.title }),
  );
  const stages = {
    deals: dealGroups,
    leads: leadGroups,
  };
  drawer.set({
    stages,
  });
  return true;
};

export const fetchApprovalsList = async () => {
  const me = fetchUser();
  const query = `query {
      boards(ids: [${env.boards.deals}]) {
        offersReadyApproval: groups(ids: "${env.pages.offersReadyApproved}"){
         items_page(
           limit: 500
           query_params:{
             rules: [
               { column_id: "${columnIds.deals.agent}", compare_value: "${me.name}", operator:contains_text}
               { column_id: "${columnIds.deals.pitched}", compare_value: "", operator:is_empty}
             ]
             operator:and
           }
         ) {
           items {
             id
             name
             subitems {
               id
               name
               column_values(ids: ["status", "numbers0", "date0"]) {
                 id
                 text
               }
             }
           }
         }
       }
       }
    }`;
  const res = await monday.api(query);
  const { items } = res.data.boards[0].offersReadyApproval[0].items_page;
  const filterd = items?.filter((item) => {
    const statusSubmitted = item.subitems.find((subitem) => {
      const isSubmitted = subitem.column_values.find((cValue) => cValue.id === 'status' && cValue.text === 'Submitted');
      return isSubmitted;
    });
    return statusSubmitted;
  });
  return filterd;
};

export const fetchPitchedCount = async () => {
  const me = fetchUser();
  const query = `query {
      boards(ids: [${env.boards.deals}]) {
        offersReadyApproval: groups(ids: "${env.pages.offersReadyApproved}"){
         items_page(
           limit: 500
           query_params:{
             rules: [
               { column_id: "${columnIds.deals.agent}", compare_value: "${me.name}", operator:contains_text}
               { column_id: "${columnIds.deals.pitched}", compare_value: "", operator:is_not_empty}
             ]
             operator:and
           }
         ) {
           items {
             id
           }
         }
       }
       }
    }`;
  const res = await monday.api(query);
  const { items } = res.data.boards[0].offersReadyApproval[0].items_page;

  return items;
};

export const fetchContractsOutData = async () => {
  const me = fetchUser();
  const query = `query {
    boards(ids: [${env.boards.deals}]) {
      contractsOut: groups(ids: "${env.pages.contractsOut}"){
       items_page(
         limit: 500
         query_params:{
           rules: [
             { column_id: "${columnIds.deals.agent}", compare_value: "${me.name}", operator:contains_text}
           ]
         }
       ) {
         items {
           id
           name
           subitems {
             id
             name
             column_values(ids: ["status", "numbers0", "date0"]) {
               id
               text
             }
           }
         }
       }
     }
     }
  }`;
  const res = await monday.api(query);
  const { items } = res.data.boards[0].contractsOut[0].items_page;
  const filterd = items?.filter((item) => {
    const statusSubmitted = item.subitems.find((subitem) => {
      const isSubmitted = subitem.column_values.find((cValue) => cValue.id === 'status' && cValue.text === 'Selected');
      return isSubmitted;
    });
    return statusSubmitted;
  });
  return filterd;
};
export const fetchContractsSignedCount = async () => {
  const me = fetchUser();
  const query = `query {
      boards(ids: [${env.boards.deals}]) {
        contractsSigned: groups(ids: "${env.pages.contractsSigned}"){
         items_page(
           limit: 500
           query_params:{
             rules: [
               { column_id: "deal_owner", compare_value: "${me.name}", operator:contains_text}
             ]
             operator:and
           }
         ) {
           items {
             id
           }
         }
       }
       }
    }`;
  const res = await monday.api(query);
  const { items } = res.data.boards[0].contractsSigned[0].items_page;

  return items;
};

export const fetchNewLeadsData = async () => {
  const me = fetchUser();
  const query1 = `query {
    leads: boards(ids: [${env.boards.leads}]) {
      groups(ids: ["new_group79229", "new_group42384", "new_group7612", "new_group96588"]){
        items_page(
          query_params: {
            rules: [
              { column_id: "${columnIds.leads.sales_rep}" compare_value:"${me.name}" operator:contains_text }
              { column_id: "${columnIds.leads.last_rep_assigned_date}" compare_value:"TODAY" operator:any_of }
            ]
          }
          limit: 500
        ) {
          items {
            name
            id
            column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.last_lead_assigned}", "${columnIds.leads.new_lead_or_touched}", "${columnIds.leads.channel}"]) {
              id
              text
              value
            }
          }
        }
      }
    }     
  }`;
  const res1 = await monday.api(query1);
  const query2 = `query {
    leads: boards(ids: [${env.boards.leads}]) {
      groups(ids: ["new_group79229", "new_group42384", "new_group7612", "new_group96588"]){
        items_page(
          query_params: {
            rules: [
              { column_id: "${columnIds.leads.sales_rep}" compare_value:"${me.name}" operator:contains_text }
              { column_id: "${columnIds.leads.last_rep_assigned_date}" compare_value:"YESTERDAY" operator:any_of }
              { column_id: "${columnIds.leads.new_lead_or_touched}" compare_value:[2] operator:any_of }
            ]
          }
          limit: 500
        ) {
          items {
            name
            id
            column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.last_lead_assigned}", "${columnIds.leads.new_lead_or_touched}", "${columnIds.leads.channel}"]) {
              id
              text
              value
            }
          }
        }
      }
    }     
  }`;
  const res2 = await monday.api(query2);
  const items1 = res1.data.leads[0].groups.reduce((prev, curr) => (
    [...prev, ...curr.items_page.items]
  ), []);
  const items2 = res2.data.leads[0].groups.reduce((prev, curr) => (
    [...prev, ...curr.items_page.items]
  ), []);
  return [...items1, ...items2];
};
export const fetchActionsNeededLeadsData = async () => {
  const me = fetchUser();
  const query = `query {
    email:items_page_by_column_values(
      board_id: ${env.boards.leads}
      limit: 500
      columns: [
        {
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me.name}"
        },
        {
          column_id: "${columnIds.leads.action_required_emails}", column_values: "Action Required"
        }
      ]
    ) {
      items{
        id
        name
        column_values(ids: ["${columnIds.leads.action_required_emails}"]){
          id
          text
          value
        }
      }
    }
    
    sms: items_page_by_column_values(
      board_id: ${env.boards.leads}
      limit: 500
      columns: [
        {
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me.name}"
        },
        {
          column_id: "${columnIds.leads.action_required_sms}", column_values: "Action Required"
        }
      ]
    ) {
      items{
        id
        name
        column_values(ids: ["${columnIds.leads.action_required_sms}"]){
          id
          text
          value
        }
      }
    }
    
    file:items_page_by_column_values(
      board_id: ${env.boards.leads}
      limit: 500
      columns: [
        {
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me.name}"
        },
        {
          column_id: "${columnIds.leads.action_required_files}", column_values: "Action Required"
        }
      ]
    ) {
      items{
        id
        name
        column_values(ids: ["${columnIds.leads.action_required_files}"]){
          id
          text
          value
        }
      }
    }
  }`;
  const res = await monday.api(query);
  const emailItems = res.data.email.items;
  const smsItems = res.data.sms.items;
  const filesItems = res.data.file.items;
  const merged = { email: emailItems, sms: smsItems, file: filesItems };
  return merged;
};

export const fetchColdProspectings = async () => {
  const me = fetchUser();
  const res = await monday.api(`query {
    coldP: items_page_by_column_values(
      limit: 500
      board_id: ${env.boards.coldProspecting}
      columns: [
        { column_id: "${columnIds.coldProspecting.dialer}", column_values: "${me.name}"}
      ]
    ) {
      items {
        id
        column_values(ids: ["${columnIds.coldProspecting.last_called}"]){
          id
          text
        }
      }
    }
  }`);
  const data = res?.data ? res.data.coldP.items : [];
  const filteredItems = data.filter(((item) => {
    if (!item.column_values[0].text) return true;
    return !dayjs().isSame(item.column_values[0].text, 'day');
  }));
  return filteredItems.length;
};

export const fetchDocReviews = async () => {
  const me = fetchUser();
  const res = await monday.api(`query {
    boards(ids: [${env.boards.leads}]) {
      docReview: groups(ids: ["${env.pages.docReview}"]) {
        items_page(
          query_params:{
            rules: [
              { column_id: "${columnIds.leads.sales_rep}", compare_value: "${me.name}", operator:contains_text}
            ]
            operator:and
          }
        ) {
          items {
            id
          }
        }
      }
    }
  }`);
  const value = res?.data ? res.data.boards[0]
    .docReview[0].items_page.items.length : 0;
  return value;
};

export const fetchLeadsFollowUps = async () => {
  const me = fetchUser();
  const res = await monday.api(`query {
    leads: boards(ids: [${env.boards.leads}]){
      items_page(query_params:{
        rules: [
          { column_id: "${columnIds.leads.sales_rep}", compare_value: "${me.name}", operator: contains_text }
          { column_id: "${columnIds.leads.next_followup}", compare_value: "TODAY", operator: lower_than_or_equal}
          { column_id: "${columnIds.leads.next_followup}",compare_value: "", operator: is_not_empty }
        ]
      }){
        items {
          id
        }
      }
    }
  }`);
  const leadsItem = res?.data ? res.data.leads[0].items_page.items.length : 0;
  return leadsItem;
};

export const fetchDealsFollowUps = async () => {
  const me = fetchUser();
  const res = await monday.api(`query {
    deals: boards(ids: [${env.boards.deals}]){
      items_page(query_params:{
        rules: [
          { column_id: "${columnIds.deals.agent}", compare_value: "${me.name}", operator: contains_text }
          { column_id: "${columnIds.deals.next_followup}", compare_value: "TODAY", operator: lower_than_or_equal}
          { column_id: "${columnIds.deals.next_followup}",compare_value: "", operator: is_not_empty }
        ]
      }){
        items {
          id
        }
      }
    }
  }`);
  const dealsItem = res?.data ? res.data.deals[0].items_page.items.length : 0;
  return dealsItem;
};

export const fetchReadyForSubmissions = async () => {
  const me = fetchUser();
  const res = await monday.api(`query {
    boards(ids: [${env.boards.deals}]) {
      readyForSubmission: groups(ids: ["${env.pages.readyForSubmission}"]) {
        items_page(
          query_params:{
            rules: [
              { column_id: "${columnIds.deals.agent}", compare_value: "${me.name}", operator:contains_text}
            ]
            operator:and
          }
        ) {
          items {
            id
          }
        }
      }
    }
  }`);
  const value = res?.data ? res.data.boards[0]
    .readyForSubmission[0].items_page.items.length : 0;
  return value;
};

export const fetchWaitingForOffer = async () => {
  const me = fetchUser();
  const res = await monday.api(`query {
    boards(ids: [${env.boards.deals}]) {
     waitingForOffer: groups(ids: ["${env.pages.waitingForOffer}"]) {
        items_page(
          query_params:{
            rules: [
              { column_id: "${columnIds.deals.agent}", compare_value: "${me.name}", operator:contains_text}
            ]
            operator:and
          }
        ) {
          items {
            id
          }
        }
      }
    }
  }`);
  const value = res?.data ? res.data.boards[0]
    .waitingForOffer[0].items_page.items.length : 0;
  return value;
};
export const fetchItem = async (clientId) => {
  const query = `query {
    items(ids: [${clientId}]) {
      id
      name
      board {
        id
      }
      column_values {
        id
        text
        value
      }
    }
  }`;
  const res = await monday.api(query);
  const columns = normalizeColumnValues(res.data.items[0].column_values);
  return { ...(res.data.items || [])[0], ...columns };
};
export const fetchLeadClientDetails = async (leadId) => {
  const query = `query {
    details: items(ids: [${leadId}]) {
      id
      name
      email
      board {
        id
      }
      group {
        id
      }
      column_values {
        id
        text
        value
      }
      subitems {
        id
        name
        email
        updated_at
        board {
          id
        }
        column_values {
          id
          text
          value
        }
      }
    }
  }`;
  const res = await monday.api(query);
  const columns = normalizeColumnValues(res.data.details[0].column_values);
  const subitems = res.data.details[0]?.subitems?.map((item) => {
    const subItemcolumns = normalizeColumnValues(item.column_values);
    return {
      ...item,
      ...subItemcolumns,
    };
  });
  let client = {};
  let partner = {};
  let clientAccount = {};
  if (res.data.details[0].board.id === env.boards.deals) {
    const clientCol = res.data.details[0].column_values.find(
      (c) => c.id === columnIds.deals.client_name,
    );
    const clientObj = JSON.parse(clientCol.value);
    if (clientObj?.linkedPulseIds?.length > 0) {
      client = await fetchItem(clientObj.linkedPulseIds[0].linkedPulseId);
    }
    const partnerCol = res.data.details[0].column_values.find(
      (c) => c.id === columnIds.deals.partner,
    );
    const partnerObj = JSON.parse(partnerCol.value);
    if (partnerObj?.linkedPulseIds?.length > 0) {
      partner = await fetchItem(partnerObj?.linkedPulseIds[0].linkedPulseId);
    }
    const clientAccountCol = client?.column_values?.find(
      (c) => c.id === columnIds.clients.account,
    );
    const clientAccountObj = JSON.parse(clientAccountCol?.value || '{}');
    if (clientAccountObj?.linkedPulseIds?.length > 0) {
      clientAccount = await fetchItem(clientAccountObj?.linkedPulseIds[0].linkedPulseId);
    }
  }
  return {
    ...res.data.details[0], ...columns, subitems, client, partner, clientAccount,
  };
};

export const fetchLeadDocs = async (leadId) => {
  const query = `query {
    docs: items(ids:["${leadId}"]) {
      name
      assets {
        id
        name
        file_size
        file_extension
        created_at
        url
      }
    }
  }`;
  const res = await monday.api(query);
  return res;
};

export const fetchFunders = async (boardId) => {
  const query = `query {
    funders: boards(ids: ["${boardId}"]) {
      items_page(limit: 500) {
        items {
          id
          name
          column_values{
            id
            text
          }
        }
      }
    }
  }`;
  const res = await monday.api(query);
  const formated = res.data.funders[0].items_page?.items.map((funder) => {
    const columns = normalizeColumnValues(funder.column_values);
    const qmKeys = transformFundersforQM(funder, columns);
    return { ...funder, ...columns, ...qmKeys };
  });
  return formated;
};

export const fetchUsers = async () => {
  const query = `query {
    users {
      id
      name
      url
    }
  }`;
  const res = await monday.api(query);
  return res.data.users;
};

export const fetchLeadUpdates = async (leadId) => {
  const query = `query {
    users {
      id
      name
      url
    }
    items(ids:["${leadId}"]) {
      name
      board {
        id
      }
      updates (limit: 500) {
        creator_id
        id
        updated_at
        created_at
        body
        text_body
        creator{
          name
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res;
};
export const fetchMarkAsImportant = async (leadId, column) => {
  const query1 = `query {
    items(ids:["${leadId}"]) {
      column_values(ids: ["${column}"]) {
        id
        text
      }
    }
  }`;
  const res = await monday.api(query1);
  const updateId = (res.data.items[0].column_values || [])[0]?.text;
  if (!updateId) return '';
  const query2 = `query {
    updates(ids: [${updateId}]) {
      id
      text_body
    }
  }`;
  const res2 = await monday.api(query2);
  return (res2.data?.updates || [])[0];
};

export const fetchBoardValuesForSelect = async (boardId) => {
  const query = `query {
    boards(ids: [${boardId}]){
      items_page(limit: 500){
        items{
          id
          name
        }
      }
    }
    }`;
  const res = await monday.api(query);
  const values = (res.data.boards[0].items_page.items || []).map(
    (item) => ({ value: item.id, label: item.name }),
  );
  return values;
};

/* ---- LEADERS BOARD --------- */

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
export const fetchAllUsers = async () => {
  const usersQuery = `query {
    teams(ids: [1070128]) {
      users {
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

export const fetchBoardColorColumnStrings = async (boardId, columnId) => {
  const query = `query {
    boards(ids: [${boardId}]) {
      columns(ids: ["${columnId}"]) {
        settings_str
      }
    }
  }`;
  const res = await monday.api(query);
  const column = JSON.parse(res.data.boards[0].columns[0].settings_str);
  return column.labels;
};
export const fetchBoardColorColumnStringsWithColors = async (boardId, columnId) => {
  const query = `query {
    boards(ids: [${boardId}]) {
      columns(ids: ["${columnId}"]) {
        settings_str
      }
    }
  }`;
  const res = await monday.api(query);
  const column = JSON.parse(res.data.boards[0].columns[0].settings_str);
  const withColor = Object.entries(column.labels).map(
    ([key, title]) => ({ label: title, color: column.labels_colors[key].color }),
  );
  return withColor;
};
export const fetchBoardDropDownColumnStrings = async (boardId, columnId) => {
  const query = `query {
    boards(ids: [${boardId}]) {
      columns(ids: ["${columnId}"]) {
        settings_str
      }
    }
  }`;
  const res = await monday.api(query);
  const column = JSON.parse(res.data.boards[0].columns[0].settings_str);
  return column.labels.map((v) => v.name);
};

export const fetchSaleActivities = async (cursor, dates) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  const query = `query {
    boards(ids: [${env.boards.salesActivities}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "date__1", compare_value:[${dateArray}], operator:between}
       ]
       }` : ''}
        limit: 500
        ${cursor ? `cursor: "${cursor}"` : ''}
      ) {
        cursor
        items {
          id
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

export const getTotalActivities = async (dates) => {
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchSaleActivities(res ? res.data.boards[0].items_page.cursor : null, dates);
    itemsList = [...itemsList, ...res.data.boards[0].items_page.items];
  } while (res.data.boards[0].items_page.cursor);
  const activities = itemsList.reduce((prev, curr) => {
    const type = curr?.column_values?.find((col) => col.id === 'status');
    const owner = getColumnValue(curr.column_values || [], 'person');
    const obj = prev;
    if (_.isEmpty(owner)) return obj;
    const actionType = type.text.toLowerCase();
    if (!obj[actionType]) {
      obj[actionType] = { [owner.personsAndTeams[0].id]: 1 };
    } else if (!obj[actionType][owner.personsAndTeams[0].id]) {
      obj[actionType] = { ...obj[actionType], [owner.personsAndTeams[0].id]: 1 };
    } else {
      obj[actionType][owner.personsAndTeams[0].id] += 1;
    }
    return obj;
  }, {});
  return activities;
};

/* ---- Daily Matrics --------- */

export const fetchAllNewLeadsData = async (cursor, dates) => {
  const dateArray = dates.map((date) => `"${date.format('YYYY-MM-DD')}"`);
  const query = `query {
    boards(ids: [${env.boards.leads}]) {
      items_page(
      ${!cursor ? `query_params: {
        rules: [
          { column_id: "${columnIds.leads.creation_date}", compare_value:[${dateArray}], operator:between}
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
          { column_id: "${columnIds.deals.lead_creation_date}", compare_value:[${dateArray}], operator:between}
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

/* ---- TEAM LEADERS BOARD --------- */

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

export const fetchUTeamSaleActivities = async (cursor, duration, actionIds, empIds) => {
  const query = `query {
    saleActivities: boards(ids: [${env.boards.salesActivities}]) {
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
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchUTeamSaleActivities(
      res ? res.data.saleActivities[0].items_page.cursor : null,
      duration,
      actionIds,
      empIds,
    );
    itemsList = [...itemsList, ...res.data.saleActivities[0].items_page.items];
  } while (res.data.saleActivities[0].items_page.cursor);
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
      res ? res.data.totalFunds[0].items_page.cursor : null,
      employees,
    );
    itemsList = [...itemsList, ...res.data.totalFunds[0].items_page.items];
  } while (res.data.totalFunds[0].items_page.cursor);
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
    if (!obj[person.id]) {
      obj[person.id] = { [actionType]: convertToNumber(selected.column_values[1].text), person };
    } else if (!obj[person.id][actionType]) {
      obj[person.id] = {
        ...obj[person.id],
        [actionType]: convertToNumber(selected.column_values[1].text),
      };
    } else {
      obj[person.id][actionType] += convertToNumber(selected.column_values[1].text);
    }
    return obj;
  }, {});
  return funds;
};

/* ---- Manager Board Funnel --------- */

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

/* ---- Approvals Board Funnel --------- */

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
            column_values(ids: ["${columnIds.deals.agent}", "${columnIds.deals.stage}", "${columnIds.deals.last_touched}"]){
              id
              text
              value
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
  const dateArray = [`"${dayjs().subtract(30, 'days').format('YYYY-MM-DD')}"`, `"${dayjs().format('YYYY-MM-DD')}"`];
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
    const isFunded = curr.parent_item.column_values.find((c) => c.id === columnIds.deals.stage && (
      c.text === 'Funded'
    || c.text === 'DQ'
    || c.text === 'Lost Deals'
    ));
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
