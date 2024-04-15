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
  const query = `mutation {
    create_update(body: "${text}", item_id: "${leadId}") {
      creator_id
      id
      updated_at
      text_body
    }
  }`;
  const res = await monday.api(query);
  return res;
};
