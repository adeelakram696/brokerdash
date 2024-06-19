import { Flex } from 'antd';
import classNames from 'classnames';
import { getMostValue, numberWithCommas } from 'utils/helpers';
import dayjs from 'dayjs';
import styles from './TeamLeaderBoard.module.scss';
import { statuses } from './data';

function AgentLeaderBoard({ saleActivities, employees, saleFunds }) {
  return (
    <Flex vertical className={styles.table}>
      <Flex className={styles.tableTitle}>
        Agent LeaderBoard
        <Flex className={styles.tableTitleDate}>
          (
          {dayjs().format('MM/DD/YYYY')}
          )
        </Flex>
      </Flex>
      <Flex className={styles.rightTableData} vertical>
        {statuses.map((status, index) => {
          const val = status.actionName
            ? getMostValue(
              (saleActivities[status.actionDuration] || {})[status.actionName.toLowerCase()] || {},
            )
            : getMostValue((saleFunds));
          const emp = employees.find((e) => e.id.toString() === val[0]) || {};
          const preSign = status.actionName ? '' : '$';
          return (
            <Flex
              flex={1}
              className={classNames(
                styles.dataRow,
                styles.rowSpace,
                { [styles.alternateColor]: index % 2 },
              )}
              justify="space-between"
            >
              <Flex className={styles.rowStatusText} flex={0.5} vertical>
                <Flex className={styles.rowStatusTitleText}>
                  Most
                  {' '}
                  {status.title}
                </Flex>
                <Flex className={styles.rowStatusDurationText}>
                  (
                  {status.duration}
                  )
                </Flex>
              </Flex>
              <Flex flex={0.37}>{emp.name ? emp.name.split(' ')[0] : '-'}</Flex>
              <Flex flex={0.13}>
                {preSign}
                {numberWithCommas(val[1])}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default AgentLeaderBoard;
