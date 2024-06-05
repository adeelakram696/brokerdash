import { Card, Flex } from 'antd';
import { useContext } from 'react';
import { MatrixContext } from 'utils/contexts';
import { normalizeColumnValues } from 'utils/helpers';
import { columnIds } from 'utils/constants';
import styles from './TotalDeclines.module.scss';

function TotalDeclines() {
  const {
    submittedDeals,
  } = useContext(MatrixContext);
  const DQDeals = submittedDeals.filter((deal) => {
    const columns = normalizeColumnValues(deal.column_values);
    return columns[columnIds.deals.stage] === 'DQ';
  });
  const outOfSubmission = submittedDeals.length > 0
    ? (DQDeals.length / submittedDeals.length) * 100 : 0;
  return (
    <Card className={styles.card} title="Total Declines">
      <Flex vertical align="center">
        <Flex className={styles.dealCount}>{DQDeals.length}</Flex>
        <Flex className={styles.dealsGoal}>
          (
          {outOfSubmission.toFixed(2)}
          % of Subs)
        </Flex>
      </Flex>
    </Card>
  );
}

export default TotalDeclines;
