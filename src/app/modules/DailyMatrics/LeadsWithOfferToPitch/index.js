import { Card, Flex } from 'antd';
import { MatrixContext } from 'utils/contexts';
import { useContext } from 'react';
import { normalizeColumnValues } from 'utils/helpers';
import { columnIds } from 'utils/constants';
import styles from './LeadsWithOfferToPitch.module.scss';

function LeadsWithOfferToPitch() {
  const {
    submittedDeals,
  } = useContext(MatrixContext);
  const offeredDeals = submittedDeals.filter((deal) => {
    const columns = normalizeColumnValues(deal.column_values);
    return columns[columnIds.deals.stage] === 'Offers Ready/Approved';
  });
  const outOfSubmission = submittedDeals.length > 0
    ? (offeredDeals.length / submittedDeals.length) * 100 : 0;
  return (
    <Card className={styles.card} title="Leads with offer to pitch">
      <Flex vertical align="center">
        <Flex className={styles.dealCount}>{offeredDeals.length}</Flex>
        <Flex className={styles.dealsGoal}>
          (
          {outOfSubmission.toFixed(2)}
          % of Subs)
        </Flex>
      </Flex>
    </Card>
  );
}

export default LeadsWithOfferToPitch;
