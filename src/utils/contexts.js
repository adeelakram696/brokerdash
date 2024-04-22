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
