import { uploadFileToMonday } from 'utils/helpers';
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
      body
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
      column_values: "${JSON.stringify(updatedData).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
      ) {
      id
    }
  }`;
  const res = await monday.api(mutation);
  return res;
};

export const updateMarkImportant = async (leadId, boardId, value, column) => {
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

export const addFilesToLead = async (leadId, column, file) => {
  const mutation = `mutation addFileToColumn($file: File!) {
    add_file_to_column(file: $file, item_id: ${leadId}, column_id: "${column}") {
      id
    }
  }`;
  const res = await uploadFileToMonday(file, mutation);
  return res;
};

export const sendSmsToClient = async (leadId, boardId, smsBtncolumnId, textColumnId, text) => {
  const setTextMutation = `mutation {
    change_simple_column_value(item_id: ${leadId}, board_id: ${boardId}, column_id: "${textColumnId}", value: "${text}") {
      id
    }
  }`;
  await monday.api(setTextMutation);
  const sendMutation = `mutation {
    change_column_value(item_id: ${leadId}, board_id: ${boardId}, column_id: "${smsBtncolumnId}", value: "${JSON.stringify({ index: 0 }).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}") {
      id
    }
  }`;
  await monday.api(sendMutation);
};
