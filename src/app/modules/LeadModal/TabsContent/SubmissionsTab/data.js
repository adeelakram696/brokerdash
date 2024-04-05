import {
  Flex,
} from 'antd';
import StatusSelect from 'app/components/Forms/StatusSelect';
import { DialCallIcon } from 'app/images/icons';

export const columns = [
  {
    title: 'Time & Date',
    flex: '0.2',
    key: 'time',
    align: 'center',
  },
  {
    title: 'Status',
    flex: '0.15',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Funder',
    flex: '0.25',
    key: 'funder',
    align: 'center',
  },
  {
    title: 'Funding Amt',
    flex: '0.1',
    key: 'funding',
    align: 'center',
  },
  {
    title: 'Factor rate',
    flex: '0.1',
    key: 'rate',
    align: 'center',
  },
  {
    title: 'ACH Amt',
    flex: '0.1',
    key: 'ach_amount',
    align: 'center',
  },
  {
    title: 'ACH Frequency',
    flex: '0.1',
    key: 'ach_frequency',
    align: 'center',
  },
];
const statusValues = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'recieved', label: 'Recieved' },
  { value: 'selected', label: 'Selected' },
  { value: 'approved', label: 'Approved' },
  { value: 'killedafc', label: 'Killed AFC' },
  { value: 'declined', label: 'declined' },
];
export const data = {
  key: '1',
  time: '12/16/24 2:30pm',
  status: <StatusSelect values={statusValues} />,
  funder: (
    <Flex>
      <Flex style={{ marginRight: 5 }}>
        <DialCallIcon />
      </Flex>
      {' '}
      Everest Business Funding
    </Flex>),
  funding: '$5000',
  rate: '1.4',
  ach_amount: '$1000',
  ach_frequency: 'Daily',
};
