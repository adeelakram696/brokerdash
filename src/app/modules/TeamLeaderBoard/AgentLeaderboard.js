import { Flex } from 'antd';
import classNames from 'classnames';
import { getMostValue, numberWithCommas } from 'utils/helpers';
import dayjs from 'dayjs';
import styles from './TeamLeaderBoard.module.scss';
import { statuses } from './data';

function AgentLeaderBoard({ saleActivities, showTotals }) {
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
        {statuses.filter((st) => !(st.actionName === 'totalFunds' && !showTotals)).map((status, index) => {
          const activity = getMostValue(saleActivities || {}, status.actionName.toLowerCase());
          const preSign = activity.person ? status.preFix : '';
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
              <Flex flex={0.37} className={styles.personName}>{activity?.person ? (`${activity.person?.name.split(' ')[0]} ${activity.person.name.split(' ')[1][0].toUpperCase()}`) : '-'}</Flex>
              <Flex flex={0.13}>
                {preSign}
                {numberWithCommas(activity[status.actionName.toLowerCase()]) || '-'}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default AgentLeaderBoard;
