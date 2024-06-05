import Timer from 'app/components/Timer';
import { formatTimeIn } from 'utils/helpers';

export const columns = (onFinish, goalTime) => [
  {
    title: 'Lead Name',
    dataIndex: 'name',
    key: 'name',
    maxLength: 30,
  },
  {
    title: 'Time in',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    render: (value, item) => (item.isNew
      ? (
        <Timer
          startSeconds={value}
          limit={300}
          goalTime={goalTime}
        />
      )
      : formatTimeIn(value)),
  },
  {
    title: 'Reassigned in',
    dataIndex: 'reassingTime',
    key: 'reassingTime',
    align: 'center',
    render: (value, item) => (
      item.isNew ? (
        <Timer
          startSeconds={value}
          isReverse
          limit={0}
          onFinish={onFinish}
        />
      ) : formatTimeIn(value)
    ),
  },
  {
    title: 'Assigned To',
    dataIndex: 'assignedTo',
    key: 'assignedTo',
    align: 'center',
  },
];
