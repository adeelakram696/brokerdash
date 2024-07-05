import { columnIds, env } from 'utils/constants';
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
export const updateStageToSubmission = async (id) => {
  const mutation = `mutation {
    change_simple_column_value(
      item_id: ${id}
      column_id: "${columnIds.leads.stage}"
      board_id: ${env.boards.leads}
      value: "Ready for Submission ->"
    ) {
      id
    }
  }`;
  const res = await monday.api(mutation);
  return res?.data?.change_simple_column_value?.id || '';
};

export const createNewUpdate = async (leadId, text) => {
  const mutation = `mutation {
    create_update(body: "${text}", item_id: "${leadId}") {
      creator_id
      id
      updated_at
      text_body
      body
      creator {
        name
      }
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
export const sendRequestContract = async (leadId, boardId, requestContractId) => {
  const sendMutation = `mutation {
    change_column_value(item_id: ${leadId}, board_id: ${boardId}, column_id: "${requestContractId}", value: "${JSON.stringify({ index: 0 }).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}") {
      id
    }
  }`;
  await monday.api(sendMutation);
};
export const sendSubmission = async (leadId, boardId, data, emailOfferBtnId) => {
  const updateMutation = `mutation {
    change_multiple_column_values(
      item_id: ${leadId}
      board_id: ${boardId}
      column_values: "${JSON.stringify(data).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
    ) {
    id    
    }
  }`;
  await monday.api(updateMutation);
  if (!emailOfferBtnId) return;
  const sendMutation = `mutation {
    change_column_value(item_id: ${leadId}, board_id: ${boardId}, column_id: "${emailOfferBtnId}", value: "${JSON.stringify({ index: 0 }).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}") {
      id
    }
  }`;
  await monday.api(sendMutation);
};

export const sendNotification = async (to, text, updateId) => {
  const mutation = `mutation {
    create_notification(
      user_id: ${to}
      text: "${text}"
      target_id: ${updateId}
      target_type: Post
    ) {
      id
      text
    }
  }`;
  await monday.api(mutation);
};
