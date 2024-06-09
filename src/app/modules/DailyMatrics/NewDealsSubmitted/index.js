import { Card, Flex } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MatrixContext } from 'utils/contexts';
import Legends from 'app/components/Legends';
import { normalizeColumnValues } from 'utils/helpers';
import { columnIds } from 'utils/constants';
import styles from './NewDealsSubmitted.module.scss';

function NewDealsSubmitted() {
  const {
    newLeads, submittedDeals, dealGoal,
  } = useContext(MatrixContext);
  const [dealsChannel, setDealsChannel] = useState({});
  useEffect(() => {
    if (!(submittedDeals)) return;
    const formatedList = submittedDeals?.reduce((prev, curr) => {
      const obj = prev;
      const cols = normalizeColumnValues(curr.column_values);
      const channel = cols[columnIds.deals.channel] === null ? 'None' : cols[columnIds.deals.channel];
      if (obj[channel]) {
        obj[channel] += 1;
      } else {
        obj[channel] = 1;
      }
      return obj;
    }, {});
    setDealsChannel(formatedList);
  }, [submittedDeals]);
  const dealPercent = newLeads.length > 0 ? (submittedDeals.length / newLeads.length) * 100 : 0;
  const dealGoalPercent = (submittedDeals.length / dealGoal) * 100;
  return (
    <Card className={styles.card} title="New Deals Submitted">
      <Flex justify="space-around">
        <Flex vertical align="center">
          <Flex className={styles.dealCount}>
            {submittedDeals.length}
          </Flex>
          <Flex className={styles.dealsPercent}>
            {`${dealPercent.toFixed(2)}% of Leads`}
          </Flex>
          <Flex className={styles.dealsGoal}>
            Goal:
            {' '}
            {dealGoalPercent.toFixed(2)}
            %
          </Flex>
        </Flex>
        <Flex>
          <Legends data={dealsChannel} />
        </Flex>
      </Flex>
    </Card>
  );
}

export default NewDealsSubmitted;
