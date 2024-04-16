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

export const createNewUpdate = async (leadId, text) => {
  const mutation = `mutation {
    create_update(body: "${text}", item_id: "${leadId}") {
      creator_id
      id
      updated_at
      text_body
    }
  }`;
  const res = await monday.api(mutation);
  return res;
};

export const updateClientInformation = async (leadId, boardId, updatedData) => {
  const mutation = `mutation {
    change_multiple_column_values(
      item_id: ${leadId}
      board_id: ${boardId}
      column_values: "${JSON.stringify(updatedData).replace(/"/g, '\\"')}"
      ) {
      id
    }
  }`;
  const res = await monday.api(mutation);
  return res;
};
