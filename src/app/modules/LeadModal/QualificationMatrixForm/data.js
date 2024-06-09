export const bankActivityColumns = [
  {
    title: 'Month',
    key: 'monthId',
    align: 'center',
  },
  {
    title: 'Starting Bal',
    key: 'startingBal',
    align: 'center',
    sumStartFrom: 1,
    sumOfColumns: ['startingBal', 'totalCredit', 'totalDebit'],
  },
  {
    title: 'Total Credits',
    key: 'totalCredit',
    align: 'center',
    totalCount: true,
    totalPrefix: '$',
  },
  {
    title: 'Total Debits',
    key: 'totalDebit',
    align: 'center',
    totalCount: true,
    totalPrefix: '$',
  },
  {
    title: 'Dep Cnt',
    key: 'depCnt',
    align: 'center',
  },
  {
    title: 'NSF',
    key: 'nsf',
    align: 'center',
  },
  {
    title: '-Days',
    key: 'days',
    align: 'center',
  },
];
export const activePositionsColumns = [
  {
    title: 'Funder Name',
    key: 'funderId',
    align: 'center',
  },
  {
    title: 'Remaining Term',
    key: 'remainingTerm',
    align: 'center',
  },
  {
    title: 'Daily',
    key: 'daily',
    align: 'center',
    totalCount: true,
    totalPrefix: '$',
  },
  {
    title: 'Weekly',
    key: 'weekly',
    align: 'center',
    totalCount: true,
    totalPrefix: '$',
  },
  {
    title: 'Monthly',
    key: 'monthly',
    align: 'center',
    totalCount: true,
    totalPrefix: '$',
  },
  {
    title: 'Payoff',
    key: 'payoff',
    align: 'center',
    totalCount: true,
    totalPrefix: '$',
  },
];

export const sampleRow = [
  {
    id: 1,
    monthId: 1,
  },
  {
    id: 2,
    monthId: 2,
  },
  {
    id: 3,
    monthId: 3,
  },
];
export const sampleRowFunders = [
  {
    id: 1,
    funderId: '',
  },
  {
    id: 2,
    funderId: '',
  },
  {
    id: 3,
    funderId: '',
  },
  {
    id: 4,
    funderId: '',
  },
  {
    id: 5,
    funderId: '',
  },
];

export const bankActivityKeys = [
  'business_start_date',
  'past_settled_defaults',
  'days-1',
  'days-2',
  'days-3',
  'depCnt-1',
  'depCnt-2',
  'depCnt-3',
  'minMonthlyDepositCount',
  'monthCashFlow',
  'monthId-1',
  'monthId-2',
  'monthId-3',
  'negativeDaysLast30',
  'negativeDaysLast90',
  'nsf-1',
  'nsf-2',
  'nsf-3',
  'nSFLast30Days',
  'nSFLast90Days',
  'numberOfPositions',
  'startingBal-1',
  'startingBal-2',
  'startingBal-3',
  'totalActivePositionsCounts',
  'totalBankActivityCounts',
  'totalCredit-1',
  'totalCredit-2',
  'totalCredit-3',
  'totalDebit-1',
  'totalDebit-2',
  'totalDebit-3',
];

export const activePositionKeys = [
  'daily-1',
  'daily-2',
  'daily-3',
  'daily-4',
  'daily-5',
  'funderId-1',
  'funderId-2',
  'funderId-3',
  'funderId-4',
  'funderId-5',
  'monthly-1',
  'monthly-2',
  'monthly-3',
  'monthly-4',
  'monthly-5',
  'payoff-1',
  'payoff-2',
  'payoff-3',
  'payoff-4',
  'payoff-5',
  'remainingTerm-1',
  'remainingTerm-2',
  'remainingTerm-3',
  'remainingTerm-4',
  'remainingTerm-5',
  'weekly-1',
  'weekly-2',
  'weekly-3',
  'weekly-4',
  'weekly-5',
  'monthlyTotal',
  'annualDebtToIncome',
  'annualRevenue',
  'remainingCashFlow',
  'existingMonthlyDebt',
];
