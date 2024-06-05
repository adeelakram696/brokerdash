import {
  Flex,
} from 'antd';
import NewLeadsChart from './NewLeadsChart';
import NewLeadsQueue from './NewLeadsQueue';

function NewLeads() {
  return (
    <Flex>
      <NewLeadsChart />
      <NewLeadsQueue />
    </Flex>
  );
}

export default NewLeads;
