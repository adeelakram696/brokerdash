import {
  Flex,
} from 'antd';
import StatusSelect from 'app/components/Forms/StatusSelect';
import { DialCallIcon } from 'app/images/icons';
import dayjs from 'dayjs';
import { numberWithCommas } from 'utils/helpers';

export const statuses = {
  submitted: 'Submitted',
  responseRecieved: 'Response Received',
  selected: 'Selected',
  approved: 'Approved',
  killedAtFundingCall: 'Killed at Funding call',
  declined: 'Declined',
  new: 'New',
  waitingForAdmin: 'Waiting for Admin to Submit',
};
export const statusValues = [
  { value: statuses.submitted, label: statuses.submitted },
  { value: statuses.responseRecieved, label: statuses.responseRecieved },
  { value: statuses.selected, label: statuses.selected },
  { value: statuses.approved, label: statuses.approved },
  { value: statuses.killedAtFundingCall, label: statuses.killedAtFundingCall },
  { value: statuses.declined, label: statuses.declined },
  { value: statuses.new, label: statuses.new },
  { value: statuses.waitingForAdmin, label: statuses.waitingForAdmin },
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
  {
    value: 'Reverse Consolidation', label: 'Reverse Consolidation', color: '#76b52d', color2: '#0f4d05',
  },
];

export const commissionOnValues = {
  selectOne: 'Select One',
  onPayback: 'On Payback',
  onFundingAmount: 'On Funding Amount',
};
export const achFrequencyValues = {
  selectOne: 'Select One',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};
export const achFrequency = [
  { value: achFrequencyValues.selectOne, label: achFrequencyValues.selectOne },
  { value: achFrequencyValues.daily, label: achFrequencyValues.daily },
  { value: achFrequencyValues.weekly, label: achFrequencyValues.weekly },
  { value: achFrequencyValues.monthly, label: achFrequencyValues.monthly },
];
export const commissionOn = [
  { value: commissionOnValues.selectOne, label: commissionOnValues.selectOne },
  { value: commissionOnValues.onPayback, label: commissionOnValues.onPayback },
  { value: commissionOnValues.onFundingAmount, label: commissionOnValues.onFundingAmount },
];

export const columns = [
  {
    title: 'Time & Date',
    flex: '0.2',
    key: 'updated_at',
    align: 'center',
    render: (value) => dayjs(value).format('MM/DD/YY hh:mm A'),
  },
  {
    title: 'Status',
    flex: '0.15',
    key: 'status',
    align: 'center',
    render: (value, onChange) => (
      <StatusSelect values={statusValues} value={value} onChange={onChange} />
    ),
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
        {data ? numberWithCommas(data) : 0}
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
    render: (data) => (
      <Flex>
        {'$ '}
        {data ? numberWithCommas(data) : 0}
      </Flex>
    ),
  },
  {
    title: 'ACH Frequency',
    flex: '0.1',
    key: 'status_1',
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
