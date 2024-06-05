import { createContext } from 'react';

export const LeadContext = createContext({
  details: {},
  funders: [],
  docs: [],
  importantMsg: '',
  getData: () => {},
  getDocs: () => {},
  getFunders: () => {},
  getMarkAsImportant: () => {},
  leadId: '',
  board: '',
  boardId: '',
  groupId: '',
});
export const MatrixContext = createContext({
  list: [],
  channels: [],
  goalTime: 60,
  getChannels: () => {},
  getNewLeadsData: () => {},
});
