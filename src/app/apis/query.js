import dayjs from 'dayjs';
import drawer from 'drawerjs';
import _ from 'lodash';
import { columnIds, env } from 'utils/constants';
import { getColumnValue, normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchUser = () => drawer.get('user');
export const fetchCurrentDate = () => dayjs().format('YYYY-MM-DD');

export const fetchCurrentUser = async () => {
  const res = await monday.api(`query {
    me {
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
  const query = `query {
    leads: items_page_by_column_values(
      limit: 500
      board_id: ${env.boards.leads}
      columns: [
        {
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me.name}"
        },
        {
          column_id: "${columnIds.leads.last_rep_assigned_date}",
          column_values: "${dayjs().format('YYYY-MM-DD')}"
        }
    ]
    ) {
      items {
        name
        id
        column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.last_lead_assigned}", "${columnIds.leads.new_lead_or_touched}"]) {
          id
          text
          value
        }
      }
    }
  }`;
  const res = await monday.api(query);
  const { items } = res.data.leads;
  return items;
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
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res;
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

export const fetchBoardColumnStrings = async (boardId, columnId) => {
  const query = `query {
    boards(ids: [${boardId}]) {
      columns(ids: ["${columnId}"]) {
        settings_str
      }
    }
  }`;
  const res = await monday.api(query);
  const column = JSON.parse(res.data.boards[0].columns[0].settings_str);
  return Object.values(column.labels);
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

export const fetchAllNewLeadsData = async (cursor) => {
  const query = `query {
    leads: items_page_by_column_values(
      limit: 500
      ${cursor ? `cursor: "${cursor}"` : ''}
      board_id: ${env.boards.leads}
      ${!cursor ? `columns: [
        {
          column_id: "${columnIds.leads.last_rep_assigned_date}",
          column_values: "${dayjs().format('YYYY-MM-DD')}"
        }
      ]` : ''}
    ) {
      cursor
      items {
        name
        id
        column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.last_lead_assigned}", "${columnIds.leads.new_lead_or_touched}", "${columnIds.leads.channel}", "${columnIds.leads.sales_rep}","${columnIds.leads.creation_date}","${columnIds.leads.minutes_5}"]) {
          id
          text
          value
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res.data.leads;
};

export const getAllNewLeadsPages = async () => {
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchAllNewLeadsData(res ? res.cursor : null);
    itemsList = [...itemsList, ...res.items];
  } while (res.cursor);
  return itemsList;
};
export const fetchAllSubmittedDeals = async (cursor) => {
  const query = `query {
    deals: items_page_by_column_values(
      limit: 500
      ${cursor ? `cursor: "${cursor}"` : ''}
      board_id: ${env.boards.deals}
      ${!cursor ? `columns: [
        {
          column_id: "${columnIds.deals.creation_date}",
          column_values: "${dayjs().format('YYYY-MM-DD')}"
        }
      ]` : ''}
    ) {
      cursor
      items {
        name
        id
        column_values(ids: ["${columnIds.deals.stage}", "${columnIds.deals.channel}","${columnIds.deals.pitched}"]) {
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
  }`;
  const res = await monday.api(query);
  return res.data.deals;
};

export const getAllSubmittedDeals = async () => {
  let res = null;
  let itemsList = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    res = await fetchAllSubmittedDeals(res ? res.cursor : null);
    itemsList = [...itemsList, ...res.items];
  } while (res.cursor);
  return itemsList;
};
