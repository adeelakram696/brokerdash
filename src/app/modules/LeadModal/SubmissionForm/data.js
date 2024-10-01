import { openStateUrl } from 'utils/helpers';

export const qualifications = [
  {
    key: 'NYSCEF',
    name: 'NYSCEF',
    handleClick: () => {
      window.open('https://iapps.courts.state.ny.us/nyscef/CaseSearch?TAB=name', '_blank');
    },
  },
  {
    key: 'Secretary of State',
    name: 'Secretary of State',
    handleClick: ({ state }) => { openStateUrl(state); },
  },
];
export const docs = [
  {
    key: '1',
    name: 'March Bank Statements_9238133.png',
    extension: 'png',
  },
  {
    key: '2',
    name: 'March Bank Statements_9238133.pdf',
    extension: 'pdf',
  },
  {
    key: '3',
    name: 'March Bank Statements_9238133.ppt',
    extension: 'ppt',
  },
  {
    key: '4',
    name: 'March Bank Statements_9238133.pptx',
    extension: 'pptx',
  },
  {
    key: '5',
    name: 'March Bank Statements_9238133.xls',
    extension: 'xlsx',
  },
  {
    key: '6',
    name: 'March Bank Statements_9238133.doc',
    extension: 'doc',
  },
  {
    key: '7',
    name: 'March Bank Statements_9238133.jpg',
    extension: 'jpg',
  },
];

export const funders = [
  {
    key: '1',
    isStar: true,
    name: 'Arena Funding Source',
    status: 'Declined',
  },
  {
    key: '2',
    isStar: false,
    name: 'BITY',
    status: '',
  },
  {
    key: '3',
    isStar: false,
    name: 'FOX',
    status: '',
  },
  {
    key: '4',
    isStar: true,
    name: 'CFGMS',
    status: 'Approved',
  },
  {
    key: '5',
    isStar: false,
    name: 'Elevate funding',
    status: '',
  },
  {
    key: '6',
    isStar: false,
    name: 'Family Bussiness fund',
    status: '',
  },
  {
    key: '7',
    isStar: true,
    name: 'Credibly',
    status: '',
  },
];

export const steps = {
  qualification: 'qualification',
  funders: 'funders',
  documents: 'documents',
};
export const stepData = {
  [steps.qualification]: {
    title: 'Qualification Check',
    subText: 'Please confirm that you checked the below items',
    nextStep: steps.funders,
  },
  [steps.funders]: {
    title: 'Select Funders',
    subText: 'Select the funder(s) from the list below',
    nextStep: steps.documents,
    prevStep: steps.qualification,
  },
  [steps.documents]: {
    title: 'Select documents to Submit',
    subText: 'Select the file(s) below that you would like to submit',
    prevStep: steps.funders,
  },
};

export const disqualificationReasosns = {
  minAnnualRevenue: 'Minimum annual revenue is less then funder requirement',
  creditScoreSuitability: 'Fico score is less the funder minimum credit score ',
  minimumMonthlyDeposits: 'Minimum monthly deposit is less then funder requirement',
  nSFLast30Days: 'Too many NSFS’s for last 30 days',
  nSFLast90Days: 'Too many NSFS’s for last 90 days',
  negativeDaysLast30: 'Too many negative days for last 30 days',
  negativeDaysLast90: 'Too many negative days for last 30 days',
  maximumPositions: 'Too many positions',
  firstPosition: 'First Position',
  industryType: 'Restricted Industry',
  state: 'Restricted State',
  timeInBusiness: 'Minimum time in business not fulfilled',
  minDailybalnce: 'Minimum daily balance is not sufficient',
};
