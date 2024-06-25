import dayjs from 'dayjs';

export const durations = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'thisWeek', label: 'This Week' },
  {
    value: 'lastWeek',
    label: 'Last Week',
  },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
];

export const durationsDates = {
  today: [dayjs().startOf('d'), dayjs().endOf('d')],
  yesterday: [dayjs().startOf('d').subtract(1, 'day'), dayjs().endOf('d').subtract(1, 'day')],
  thisWeek: [dayjs().startOf('d').weekday(1), dayjs().endOf('d')],
  lastWeek: [dayjs().weekday(1).startOf('d').subtract(1, 'week'), dayjs().weekday(1).endOf('d').subtract(1, 'day')],
  thisMonth: [dayjs().startOf('M').startOf('d'), dayjs().endOf('d')],
  lastMonth: [dayjs().startOf('M').subtract(1, 'month').startOf('d'), dayjs().subtract(1, 'month').endOf('M').endOf('d')],
};
