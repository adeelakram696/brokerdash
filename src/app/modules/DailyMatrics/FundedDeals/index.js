import { Card, Flex } from 'antd';
import { MatrixContext } from 'utils/contexts';
import { useContext } from 'react';
import { normalizeColumnValues } from 'utils/helpers';
import { columnIds } from 'utils/constants';
import styles from './FundedDeals.module.scss';

function FundedDeals() {
  const {
    submittedDeals,
  } = useContext(MatrixContext);
  const fundedDeals = submittedDeals.filter((deal) => {
    const subItem = deal.subitems.find((item) => {
      const columns = normalizeColumnValues(item.column_values);
      return columns[columnIds.subItem.status] === 'Selected';
    });
    return subItem;
  });
  const outOfSubmission = submittedDeals.length > 0
    ? (fundedDeals.length / submittedDeals.length) * 100 : 0;
  return (
    <Card className={styles.card} title="Funded">
      <Flex vertical align="center">
        <Flex className={styles.dealCount}>{fundedDeals.length}</Flex>
        <Flex className={styles.dealsGoal}>
          (
          {outOfSubmission.toFixed(2)}
          % of Subs)
        </Flex>
      </Flex>
    </Card>
  );
}

export default FundedDeals;
