export const bankActivityColumns = [
  {
    title: 'Month',
    key: 'month',
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
    key: 'name',
    align: 'center',
    disabled: true,
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
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
];
