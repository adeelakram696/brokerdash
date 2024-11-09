import dayjs from 'dayjs';

export const dateDurations = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'not_today',
    label: 'Not Today',
  },
  {
    value: 'this_week',
    label: 'This Week',
  },
  {
    value: 'this_month',
    label: 'This Month',
  },
];

export const checkDateFilter = (inputDate, duration) => {
  const date = dayjs(inputDate);
  const today = dayjs();
  if (duration === 'today') {
    return date.isSame(today, 'day');
  }

  if (duration === 'not_today') {
    return !date.isSame(today, 'day');
  }

  if (duration === 'this_week') {
    const startOfWeek = today.startOf('week');
    const endOfWeek = today.endOf('week');
    return date.isBetween(startOfWeek, endOfWeek, null, '[]');
  }

  if (duration === 'this_month') {
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    return date.isBetween(startOfMonth, endOfMonth, null, '[]');
  }

  return false;
};

export const matchBroker = (brokers, selected) => {
  const stringArray = brokers.split(', ').map((item) => item.toLowerCase());

  const anyPresent = selected.some((item) => stringArray.includes(item.toLowerCase()));

  return anyPresent;
};
export const matchStages = (stage, selected) => {
  const stageLabels = selected.map((data) => data.label);
  const anyPresent = stageLabels.some((item) => stage.toLowerCase() === item.toLowerCase());

  return anyPresent;
};
