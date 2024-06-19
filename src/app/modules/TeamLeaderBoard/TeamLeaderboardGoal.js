import { Flex } from 'antd';
import classNames from 'classnames';
import { getTotalSum, numberWithCommas } from 'utils/helpers';
import dayjs from 'dayjs';
import styles from './TeamLeaderBoard.module.scss';
import { statuses } from './data';

function TeamLeaderboardGoal({ saleActivities, saleFunds, goals }) {
  return (
    <Flex vertical className={styles.table}>
      <Flex className={styles.tableTitle}>
        Team LeaderBoard
        <Flex className={styles.tableTitleDate}>
          (
          {dayjs().format('MM/DD/YYYY')}
          )
        </Flex>
      </Flex>
      <Flex className={styles.rightTableData} vertical>
        <Flex justify="flex-end" className={styles.extraHeading}>
          <Flex flex={0.13}>Amount</Flex>
          <Flex flex={0.13}>Goal</Flex>
        </Flex>
        {statuses.map((status, index) => {
          const totalSum = status.actionName
            ? getTotalSum(
              (saleActivities[status.actionDuration] || {})[status.actionName.toLowerCase()] || {},
            )
            : `$${numberWithCommas(getTotalSum(saleFunds))}`;
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
              <Flex className={styles.rowStatusText} flex={0.8} vertical>
                <Flex className={styles.rowStatusTitleText}>{status.title}</Flex>
                <Flex className={styles.rowStatusDurationText}>
                  (
                  {status.duration}
                  )
                </Flex>
              </Flex>
              <Flex flex={0.13}>{totalSum}</Flex>
              <Flex flex={0.13}>{goals[status.goalColumn]}</Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default TeamLeaderboardGoal;
