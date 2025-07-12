import { transformFundersforQM } from 'app/modules/LeadModal/QualificationMatrixForm/matrixData';
import { columnIds, env } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';
import monday from 'utils/mondaySdk';

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
         ... on BoardRelationValue {  
            linked_item_ids  
          }
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
        ... on BoardRelationValue {  
            linked_item_ids  
          }  
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
          ... on BoardRelationValue {  
            linked_item_ids  
          }  
        }
      }
    }
  }`;
  const res = await monday.api(query);
  const columns = normalizeColumnValues(res.data.details[0]?.column_values);
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
    const clientObj = clientCol.linked_item_ids;
    if (clientObj?.length > 0) {
      client = await fetchItem(clientObj[0]);
    }
    const partnerCol = res.data.details[0].column_values.find(
      (c) => c.id === columnIds.deals.partner,
    );
    const partnerObj = partnerCol.linked_item_ids;
    if (partnerObj?.length > 0) {
      partner = await fetchItem(partnerObj[0]);
    }
    const clientAccountCol = client?.column_values?.find(
      (c) => c.id === columnIds.clients.account,
    );
    const clientAccountObj = clientAccountCol?.linked_item_ids;
    if (clientAccountObj?.length > 0) {
      clientAccount = await fetchItem(clientAccountObj[0]);
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
        creator {
          name
        }
      }
    }
  }`;
  const res = await monday.api(query);
  return res;
};

export const fetchNewItemBaseInfo = async (leadIds, name) => {
  const query1 = `query {
    items(ids:${leadIds}) {
      id
      name
    }
  }`;
  const res = await monday.api(query1);
  const item = res.data.items.find((obj) => obj.name.includes(name));
  return item;
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
      created_at
    }
  }`;
  const res2 = await monday.api(query2);
  return (res2.data?.updates || [])[0];
};
