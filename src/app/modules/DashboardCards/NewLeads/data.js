import Timer from 'app/components/Timer';
import { formatTimeIn } from 'utils/helpers';

export const columns = (onFinish, updateTimerForTopLead, topLeadId) => [
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
    title: 'Reassigned in',
    dataIndex: 'reassingTime',
    key: 'reassingTime',
    align: 'center',
    render: (value, item) => (item.isNew
      ? (
        <Timer
          startSeconds={value}
          limit={300}
          onFinish={onFinish}
          updateTime={topLeadId === item.id ? updateTimerForTopLead : undefined}
        />
      )
      : formatTimeIn(value)),
  },
  {
    title: 'Stage',
    dataIndex: 'stage',
    key: 'stage',
    align: 'center',
  },
];
