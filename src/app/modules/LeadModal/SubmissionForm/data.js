export const qualifications = [
  {
    key: 'NYSCEF',
    name: 'NYSCEF',
  },
  {
    key: 'Secretary of State',
    name: 'Secretary of State',
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
