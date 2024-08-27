/* eslint-disable no-unused-vars */
import {
  Flex,
} from 'antd';
import { columnIds } from 'utils/constants';
import { numberWithCommas } from 'utils/helpers';
import classNames from 'classnames';
import styles from './TeamCommissions.module.scss';

function TierTable({ commissionTier, selectedTier }) {
  return (
    <Flex flex={0.3} className={styles.card}>
      <Flex flex={1} vertical>
        <Flex justify="space-between" className={styles.headerRow}>
          <Flex flex={0.3}>
            Min CGI
          </Flex>
          <Flex flex={0.3}>
            Max CGI
          </Flex>
          <Flex flex={0.3}>
            InBound
          </Flex>
          <Flex flex={0.3}>
            OutBound
          </Flex>
        </Flex>
        {commissionTier.map((tierData) => (
          <Flex
            flex={1}
            justify="space-between"
            className={classNames(
              styles.itemRow,
              { [styles.selectedTier]: selectedTier.id === tierData.id },
            )}
          >
            <Flex flex={0.3}>
              $
              {numberWithCommas(tierData[columnIds.commissionSettings.min_cgi])}
            </Flex>
            <Flex flex={0.3}>
              $
              {numberWithCommas(tierData[columnIds.commissionSettings.max_cgi])}
            </Flex>
            <Flex flex={0.3}>
              {tierData[columnIds.commissionSettings.inbound] * 100}
              %
            </Flex>
            <Flex flex={0.3}>
              {tierData[columnIds.commissionSettings.outbound] * 100}
              %
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default TierTable;
