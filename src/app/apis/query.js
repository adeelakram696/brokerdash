import dayjs from 'dayjs';
import drawer from 'drawerjs';
import { env } from 'utils/constants';
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
