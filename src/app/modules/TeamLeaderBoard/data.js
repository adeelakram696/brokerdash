import { columnIds } from 'utils/constants';

export const durations = {
  daily: 'TODAY',
  weekly: 'THIS_WEEK',
  monthly: 'THIS_MONTH',
};
export const statuses = [
  {
    title: 'New Leads Spoken To',
    duration: 'Today',
    width: 170.4,
    actionName: 'New Leads Spoken To',
    goalColumn: columnIds.teamLeaderBaord.newLeadSpokenTo,
    actionDuration: durations.daily,
  },
  {
    title: 'Follow Up Calls',
    duration: 'Today',
    width: 124.2,
    actionName: 'Follow up call',
    goalColumn: columnIds.teamLeaderBaord.followUpCalls,
    actionDuration: durations.daily,
  },
  {
    title: 'Submissions',
    duration: 'This Week',
    width: 107.8,
    actionName: 'Deal Submitted',
    goalColumn: columnIds.teamLeaderBaord.submissions,
    actionDuration: durations.weekly,
  },
  {
    title: 'Approvals',
    duration: 'This Week',
    width: 90.63,
    actionName: 'Offer Received Back',
    goalColumn: columnIds.teamLeaderBaord.approvals,
    actionDuration: durations.weekly,
  },
  {
    title: 'Deals Funded',
    duration: 'This Month',
    width: 115.13,
    actionName: 'Fully Funded',
    goalColumn: columnIds.teamLeaderBaord.dealsFunded,
    actionDuration: durations.monthly,
  },
  {
    title: 'Total Funded',
    duration: 'This Month',
    width: 110.90,
    actionName: 'totalFunds',
    preFix: '$',
    goalColumn: columnIds.teamLeaderBaord.totalFunded,
    actionDuration: durations.monthly,
  },
];
