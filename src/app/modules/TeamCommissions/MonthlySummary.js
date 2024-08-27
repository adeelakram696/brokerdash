import {
  Flex,
} from 'antd';
import classNames from 'classnames';
import { columnIds } from 'utils/constants';
import { numberWithCommas } from 'utils/helpers';
import styles from './TeamCommissions.module.scss';

function MonthlySummary({ data, selectedTier, totalGCI }) {
  const inBoundGCI = data.reduce((prev, curr) => (
    !curr.isOutbound ? prev + Number(curr.total_gross) : prev
  ), 0);
  const outBoundGCI = data.reduce((prev, curr) => (
    curr.isOutbound ? prev + Number(curr.total_gross) : prev
  ), 0);
  const monthlyCommission = (
    Number(selectedTier[columnIds?.commissionSettings?.inbound]) * Number(inBoundGCI))
  + (Number(selectedTier[columnIds?.commissionSettings?.outbound]) * Number(outBoundGCI)
  );
  return (
    <Flex flex={0.3} className={styles.card} vertical>
      <Flex
        className={classNames(styles.headerRow, styles.heading)}
        justify="center"
      >
        Total Monthly Summary
      </Flex>
      <Flex vertical>
        <Flex flex={1} justify="space-between" className={styles.itemRow}>
          <Flex>Total GCI</Flex>
          <Flex>
            $
            {numberWithCommas(totalGCI)}
          </Flex>
        </Flex>
        <Flex flex={1} justify="space-between" className={styles.itemRow}>
          <Flex>Inbound GCI</Flex>
          <Flex>
            $
            {numberWithCommas(inBoundGCI)}
          </Flex>
        </Flex>
        <Flex flex={1} justify="space-between" className={styles.itemRow}>
          <Flex>Outbound GCI</Flex>
          <Flex>
            $
            {numberWithCommas(outBoundGCI)}
          </Flex>
        </Flex>
        <Flex flex={1} justify="space-between" className={styles.itemRow}>
          <Flex>Inbound Tier Hit</Flex>
          <Flex>
            {selectedTier[columnIds.commissionSettings.inbound]
              ? (selectedTier[columnIds.commissionSettings.inbound] * 100) : 0}
            %
          </Flex>
        </Flex>
        <Flex flex={1} justify="space-between" className={styles.itemRow}>
          <Flex>Outbound Tier Hit</Flex>
          <Flex>
            {selectedTier[columnIds.commissionSettings.outbound]
              ? (selectedTier[columnIds.commissionSettings.outbound] * 100) : 0}
            %
          </Flex>
        </Flex>
        <Flex flex={1} justify="space-between" align="center" className={styles.itemRow}>
          <Flex>Monthly Commission</Flex>
          <Flex className={styles.highlight}>
            $
            {monthlyCommission ? numberWithCommas(monthlyCommission.toFixed(1)) : 0}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default MonthlySummary;
