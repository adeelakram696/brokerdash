import { Card, Flex } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MatrixContext } from 'utils/contexts';
import Legends from 'app/components/Legends';
import { normalizeColumnValues } from 'utils/helpers';
import { columnIds } from 'utils/constants';
import styles from './NewDealsPitched.module.scss';

function NewDealsPitched() {
  const {
    submittedDeals, pitchedGoal,
  } = useContext(MatrixContext);
  const [dealsChannel, setDealsChannel] = useState({});
  const dealsPitched = submittedDeals.filter((deal) => {
    const columns = normalizeColumnValues(deal.column_values);
    return columns[columnIds.deals.pitched] === 'v';
  });
  useEffect(() => {
    if (!(dealsPitched)) return;
    const formatedList = dealsPitched?.reduce((prev, curr) => {
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
  const dealPercent = submittedDeals.length > 0
    ? (dealsPitched.length / submittedDeals.length) * 100 : 0;
  const dealGoalPercent = (dealsPitched.length / pitchedGoal) * 100;
  return (
    <Card className={styles.card} title="New Deals Pitched">
      <Flex justify="space-around">
        <Flex vertical align="center">
          <Flex className={styles.dealCount}>
            {dealsPitched.length}
          </Flex>
          <Flex className={styles.dealsPercent}>
            {`${dealPercent.toFixed(2)}% of Deals`}
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

export default NewDealsPitched;
