import monday from 'utils/mondaySdk';

export const updateStage = async (id, group) => {
  const mutation = `mutation {
  move_item_to_group(item_id: ${id}, group_id: "${group}") {
    id
  }
}`;
  const res = await monday.api(mutation);
  return res?.data?.move_item_to_group?.id || '';
};

export const ctaBtn = async (leadId, boardId, btnId) => {
  const sendMutation = `mutation {
    change_column_value(item_id: ${leadId}, board_id: ${boardId}, column_id: "${btnId}", value: "${JSON.stringify({ index: 0 }).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}") {
      id
    }
  }`;
  await monday.api(sendMutation);
};

export const updateClientInformation = async (leadId, boardId, updatedData) => {
  const mutation = `mutation {
    change_multiple_column_values(
      item_id: ${leadId}
      board_id: ${boardId}
      column_values: "${JSON.stringify(updatedData).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
      ) {
      id
    }
  }`;
  const res = await monday.api(mutation);
  return res;
};
export const createClientInformation = async (clientName, boardId, updatedData) => {
  const mutation = `mutation {
    create_item(
      item_name: "${clientName}"
      board_id: ${boardId}
      column_values: "${JSON.stringify(updatedData).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
      ) {
      id
    }
  }`;
  const res = await monday.api(mutation);
  return res;
};

export const updateSimpleColumnValue = async (leadId, boardId, value, column) => {
  const mutation = `mutation {
    change_simple_column_value(
      item_id: ${leadId}
      board_id: ${boardId}
      column_id: "${column}"
      value: "${value}"
      ) {
      id
    }
  }`;
  const res = await monday.api(mutation);
  return res;
};
