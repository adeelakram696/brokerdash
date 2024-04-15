import drawer from 'drawerjs';
import monday from './mondaySdk';

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

export const removeBoardHeader = () => {
  const header = document.getElementById('mf-header');
  header?.remove();
};
