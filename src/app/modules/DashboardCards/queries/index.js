import dayjs from 'dayjs';
import drawer from 'drawerjs';
import { columnIds, env } from 'utils/constants';
import monday from 'utils/mondaySdk';

export const fetchUser = () => drawer.get('user');

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

export const fetchLeadsRotatedData = async () => {
  const me = fetchUser();
  const query1 = `query {
    leadRotate: boards(ids: [${env.boards.leads}]) {
      groups(ids: ["new_group79229", "new_group42384", "new_group7612", "new_group96588"]){
        items_page(
          query_params: {
            rules: [
              { column_id: "${columnIds.leads.sales_rep}" compare_value:"${me.name}" operator:contains_text }
              { column_id: "${columnIds.leads.date_last_rotated}" compare_value:"YESTERDAY" operator:any_of }
            ]
          }
          limit: 500
        ) {
          items {
            name
            id
            board {
              id
            }
            column_values(ids: ["${columnIds.leads.stage}"]) {
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
  const items1 = res1.data.leadRotate[0].groups.reduce((prev, curr) => (
    [...prev, ...curr.items_page.items]
  ), []);
  const query2 = `query {
    dealRotate: boards(ids: [${env.boards.deals}]) {
      groups(ids: ["new_group40775", "new_group1842__1", "new_group748", "new_group54418", "new_group61375", "new_group59616", "new_group26835"]){
        items_page(
          query_params: {
            rules: [
              { column_id: "${columnIds.deals.agent}" compare_value:"${me.name}" operator:contains_text }
              { column_id: "${columnIds.deals.date_last_rotated}" compare_value:"YESTERDAY" operator:greater_than_or_equals }
            ]
          }
          limit: 500
        ) {
          items {
            name
            id
            board {
              id
            }
            column_values(ids: ["${columnIds.deals.stage}"]) {
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
  const items2 = res2.data.dealRotate[0].groups.reduce((prev, curr) => (
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
          limit: 500
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
      items_page(
        limit: 500
        query_params:{
          rules: [
              { column_id: "${columnIds.leads.sales_rep}", compare_value: "${me.name}", operator: contains_text }
              { column_id: "${columnIds.leads.next_followup}", compare_value: "TODAY", operator: lower_than_or_equal}
              { column_id: "${columnIds.leads.next_followup}",compare_value: "", operator: is_not_empty }
            ]
          }
        ){
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
      items_page(
      limit: 500
        query_params:{
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
          limit: 500
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
          limit: 500
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
