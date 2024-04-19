import {
  Flex,
} from 'antd';
import StatusSelect from 'app/components/Forms/StatusSelect';
import { DialCallIcon } from 'app/images/icons';
import dayjs from 'dayjs';

export const statusValues = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Response Recieved', label: 'Response Recieved' },
  { value: 'Selected', label: 'Selected' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Killed at Funding call', label: 'Killed at Funding call' },
  { value: 'Declined', label: 'Declined' },
  { value: 'New', label: 'New' },
];

export const productTypes = [
  {
    value: '', label: 'None', color: '#EAEAEA', color2: '#B0B0B0', fontColor: '#B0B0B0',
  },
  {
    value: 'MCA', label: 'MCA', color: '#6B9DAD', color2: '#39778B',
  },
  {
    value: 'Credit Line', label: 'Credit Line', color: '#52B172', color2: '#218D59',
  },
  {
    value: 'SBA LOAN', label: 'SBA LOAN', color: '#AD6B6B', color2: '#983D3D',
  },
  {
    value: 'Business Term', label: 'Business Term', color: '#892A8B', color2: '#6C0A6E',
  },
];

export const achFrequency = [
  { value: 'Select One', label: 'Select One' },
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
];
export const commissionOn = [
  { value: 'Select One', label: 'Select One' },
  { value: 'On Payback', label: 'On Payback' },
  { value: 'On Funding Amount', label: 'On Funding Amount' },
];

export const columns = [
  {
    title: 'Time & Date',
    flex: '0.2',
    key: 'updated_at',
    align: 'center',
    render: (value) => dayjs(value).format('MM/DD/YY HH:mm A'),
  },
  {
    title: 'Status',
    flex: '0.15',
    key: 'status',
    align: 'center',
    render: (value) => (<StatusSelect values={statusValues} value={value} />),
  },
  {
    title: 'Funder',
    flex: '0.25',
    key: 'name',
    align: 'center',
    render: (data) => (
      <Flex>
        <Flex style={{ marginRight: 5 }}>
          <DialCallIcon />
        </Flex>
        {' '}
        {data}
      </Flex>
    ),
  },
  {
    title: 'Funding Amt',
    flex: '0.1',
    key: 'numbers0',
    align: 'center',
    render: (data) => (
      <Flex>
        {'$ '}
        {data || 0}
      </Flex>
    ),
  },
  {
    title: 'Factor rate',
    flex: '0.1',
    key: 'text6',
    align: 'center',
  },
  {
    title: 'ACH Amt',
    flex: '0.1',
    key: 'numbers07',
    align: 'center',
  },
  {
    title: 'ACH Frequency',
    flex: '0.1',
    key: 'ach_frequency',
    align: 'center',
  },
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
