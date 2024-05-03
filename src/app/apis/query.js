import dayjs from 'dayjs';
import drawer from 'drawerjs';
import { columnIds, env } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

export const fetchUser = () => drawer.get('userName');
export const fetchCurrentDate = () => dayjs().format('YYYY-MM-DD');

export const fetchUserName = async () => {
  const res = await monday.api(`query {
    me {
      name
    }
  }`);
  const value = res?.data ? res.data.me.name : '';
  drawer.set({ userName: value });
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
               { column_id: "${columnIds.deals.agent}", compare_value: "${me}", operator:contains_text}
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
               { column_id: "${columnIds.deals.agent}", compare_value: "${me}", operator:contains_text}
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
             { column_id: "${columnIds.deals.agent}", compare_value: "${me}", operator:contains_text}
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
               { column_id: "deal_owner", compare_value: "${me}", operator:contains_text}
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
          column_values: "${me}"
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
        column_values(ids: ["${columnIds.leads.stage}","${columnIds.leads.time_in_the_que}", "${columnIds.leads.new_lead_or_touched}"]) {
          id
          text
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
          column_values: "${me}"
        },
        {
          column_id: "${columnIds.leads.action_required_emails}", column_values: "Action Required"
        }
      ]
    ) {
      items{
        id
        name
        column_values(ids: ["${columnIds.leads.last_updated}"]){
          id
          text
        }
      }
    }
    
    sms: items_page_by_column_values(
      board_id: ${env.boards.leads}
      limit: 500
      columns: [
        {
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me}"
        },
        {
          column_id: "${columnIds.leads.action_required_sms}", column_values: "Action Required"
        }
      ]
    ) {
      items{
        id
        name
        column_values(ids: ["${columnIds.leads.last_updated}"]){
          id
          text
        }
      }
    }
    
    file:items_page_by_column_values(
      board_id: ${env.boards.leads}
      limit: 500
      columns: [
        {
          column_id: "${columnIds.leads.sales_rep}",
          column_values: "${me}"
        },
        {
          column_id: "${columnIds.leads.action_required_files}", column_values: "Action Required"
        }
      ]
    ) {
      items{
        id
        name
        column_values(ids: ["${columnIds.leads.last_updated}"]){
          id
          text
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
        { column_id: "${columnIds.coldProspecting.dialer}", column_values: "${me}"}
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
              { column_id: "${columnIds.leads.sales_rep}", compare_value: "${me}", operator:contains_text}
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

export const fetchFollowUps = async () => {
  const me = fetchUser();
  const currentDate = fetchCurrentDate();
  const res = await monday.api(`query {
    deals: items_page_by_column_values(
      limit: 500
      board_id: ${env.boards.deals}
      columns: [
        { column_id: "date_1", column_values: "${currentDate}"},
        { column_id: "deal_owner", column_values: "${me}"}
      ]
    ) {
      items {
        id
      }
    }
    leads: items_page_by_column_values(
      limit: 500
      board_id: ${env.boards.leads}
      columns: [
        { column_id: "date_1", column_values: "${currentDate}"},
        { column_id: "dialer", column_values: "${me}"}
      ]
    ) {
      items {
        id
      }
    }
  }`);
  const dealsItem = res?.data ? res.data.deals.items.length : 0;
  const leadsItem = res?.data ? res.data.leads.items.length : 0;
  const value = dealsItem + leadsItem;
  return value;
};

export const fetchReadyForSubmissions = async () => {
  const me = fetchUser();
  const currentDate = fetchCurrentDate();
  const res = await monday.api(`query {
    boards(ids: [${env.boards.deals}]) {
      readyForSubmission: groups(ids: ["${env.pages.readyForSubmission}"]) {
        items_page(
          query_params:{
            rules: [
              { column_id: "${columnIds.deals.next_followup}", compare_value: ["${currentDate}", "${currentDate}"], operator:between},
              { column_id: "${columnIds.deals.agent}", compare_value: "${me}", operator:contains_text}
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
  const currentDate = fetchCurrentDate();
  const res = await monday.api(`query {
    boards(ids: [${env.boards.deals}]) {
     waitingForOffer: groups(ids: ["${env.pages.waitingForOffer}"]) {
        items_page(
          query_params:{
            rules: [
              { column_id: "${columnIds.deals.next_followup}", compare_value: ["${currentDate}", "${currentDate}"], operator:between},
              { column_id: "${columnIds.deals.agent}", compare_value: "${me}", operator:contains_text}
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
  return { res, columns, subitems };
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

export const fetchLeadUpdates = async (leadId) => {
  const query = `query {
    users {
      id
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
