import {
  Flex,
} from 'antd';
import classNames from 'classnames';
import { numberWithCommas } from 'utils/helpers';
import styles from './TeamLeaderBoard.module.scss';
import { statuses } from './data';

function MainDataTable({ saleActivities }) {
  const sorted = Object.values(saleActivities).sort((a, b) => (b['fully funded'] || 0) - (a['fully funded'] || 0));
  return (
    <Flex flex={0.6} vertical className={styles.table} justify="space-between">
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <Flex flex={0.25} className={styles.headerColumnTitle}>Name</Flex>
        {statuses.map((status) => (
          <Flex flex={0.13} className={styles.headerColumnPerson} style={{ minWidth: status.width }} vertical justify="center" align="center">
            <Flex className={styles.rowStatusTitleText}>{status.title}</Flex>
            <Flex className={styles.rowStatusDurationText}>
              (
              {status.duration}
              )
            </Flex>
          </Flex>
        ))}
      </Flex>
      {sorted.map((activity, index) => (
        <Flex className={classNames(styles.dataRow, { [styles.alternateColor]: index % 2 })} justify="space-between">
          <Flex flex={0.25} className={styles.dataColumnTitle} align="center">
            {activity.person.name.split(' ')[0]}
            {' '}
            {activity.person.name.split(' ')[1][0].toUpperCase()}
          </Flex>
          {statuses.map((status) => (
            <Flex flex={0.13} className={styles.dataColumnPerson} style={{ minWidth: status.width }} justify="center" align="center">
              {activity[status.actionName.toLowerCase()] ? status.preFix : ''}
              {(numberWithCommas(activity[status.actionName.toLowerCase()]) || ' ')}
            </Flex>
          ))}
        </Flex>
      ))}

    </Flex>
  );
}

export default MainDataTable;
