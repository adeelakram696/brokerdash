import { Card, Flex } from 'antd';
import { MatrixContext } from 'utils/contexts';
import { useContext } from 'react';
import { normalizeColumnValues, numberWithCommas } from 'utils/helpers';
import { columnIds } from 'utils/constants';
import styles from './FundedDealsAmount.module.scss';

function FundedDealsAmount() {
  const {
    submittedDeals,
  } = useContext(MatrixContext);
  const fundedAmount = submittedDeals.reduce((prev, deal) => {
    let amt = prev;
    const subItem = deal.subitems.find((item) => {
      const columns = normalizeColumnValues(item.column_values);
      return columns[columnIds.subItem.status] === 'Selected';
    });
    if (subItem) {
      const columns = normalizeColumnValues(subItem.column_values);
      amt += Number(columns[columnIds.subItem.funding_amount]);
    }
    return amt;
  }, 0);
  return (
    <Card className={styles.card} title="Funded Amount">
      <Flex vertical align="center">
        <Flex className={styles.dealCount}>
          $
          {numberWithCommas(fundedAmount)}
        </Flex>
      </Flex>
    </Card>
  );
}

export default FundedDealsAmount;
