export const actionTypesList = [
  'Deal Submitted',
  'Offer Received Back',
  'Contract out',
  'Contract signed',
  'Fully funded',
  'Client Rejected',
  'Declined',
  'Disqualified',
];
export const actionTypesTitles = {
  'leads assigned': 'Leads Assinged',
  'deal submitted': 'Deal Submitted',
  'offer received back': 'Offers Ready',
  'contract out': 'Contract out',
  'contract signed': 'Contract Signed',
  'fully funded': 'Funded',
  'client rejected': 'Client Rejected',
  declined: 'Declined',
  disqualified: 'Disqualified',
};

export const conversions = {
  'deal submitted': 'leads assigned',
  'offer received back': 'deal submitted',
  'contract out': 'offer received back',
  'contract signed': 'contract out',
  'fully funded': 'contract signed',
  'client rejected': 'deal submitted',
  declined: 'deal submitted',
  disqualified: 'deal submitted',
};
