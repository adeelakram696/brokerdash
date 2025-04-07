export const actionTypesList = [
  'Follow up call',
  'Deal Submitted',
  'Offer Received Back',
  'Fully funded',
  // 'Contract out',
  // 'Contract signed',
  // 'Client Rejected',
  // 'Declined',
  // 'Disqualified',
];
export const actionTypesTitles = {
  'total leads assigned': '# of Active Leads Assigned',
  'leads assigned': '# of Leads Assigned',
  'disqualified leads': '# of Leads Disqualified',
  'follow up call': 'Attempted Calls',
  'deal submitted': 'Deal Submitted',
  'offer received back': 'Approvals',
  'contract out': 'Contract out',
  'contract signed': 'Contract Signed',
  'fully funded': 'Deals Funded',
  'client rejected': 'Client Rejected',
  declined: 'Declined',
  disqualified: 'Disqualified',
  'conversion ratio': 'Conversion Ratio (Funded/Approvals)',
  'avg deal size': 'Avg Funded Deal Size',
  'avg time to fund': 'Avg Time from Application to Funded',
};

export const conversions = {
  'deal submitted': 'leads assigned',
  'offer received back': 'deal submitted',
  'fully funded': 'offer received back',
};

export const mergeTeamData = (
  leadsAssigned,
  dealsFunded,
  allLeadsAssigned,
  allLeadsDisqualified,
  activities,
  members,
) => {
  const mergedData = {};
  // Merge `activities`
  Object.keys(activities).forEach((personId) => {
    mergedData[personId] = { ...activities[personId] };
  });
  // Merge `leadsAssigned`
  Object.keys(leadsAssigned).forEach((personId) => {
    if (!mergedData[personId]) {
      mergedData[personId] = { person: members.find((m) => m.id === personId) };
    }
    mergedData[personId].leadsAssigned = leadsAssigned[personId]?.count || 0;
  });
  // Merge `allLeadsAssigned`
  Object.keys(allLeadsAssigned).forEach((personId) => {
    if (!mergedData[personId]) {
      mergedData[personId] = { person: members.find((m) => m.id === personId) };
    }
    mergedData[personId].allLeadsAssigned = allLeadsAssigned[personId] || 0;
  });
  // Merge `allLeadsDisqualified`
  Object.keys(allLeadsDisqualified).forEach((personId) => {
    if (!mergedData[personId]) {
      mergedData[personId] = { person: members.find((m) => m.id === personId) };
    }
    mergedData[personId].allLeadsDisqualified = allLeadsDisqualified[personId] || 0;
  });

  // Merge `dealsFunded`
  Object.keys(dealsFunded).forEach((personId) => {
    if (!mergedData[personId]) {
      mergedData[personId] = { person: { id: personId } };
    }
    mergedData[personId] = {
      ...mergedData[personId],
      ...dealsFunded[personId], // Add deal data
    };
  });
  Object.keys(mergedData).forEach((personId) => {
    const broker = mergedData[personId];

    const offerReceived = broker['offer received back'] || 0;
    const fullyFunded = broker['fully funded'] || 0;

    // Avoid division by zero
    broker.conversionRatio = offerReceived > 0 ? `${((fullyFunded / offerReceived) * 100).toFixed(2)}%` : '0%';
  });
  return mergedData;
};
