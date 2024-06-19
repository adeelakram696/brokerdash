import {
  Flex,
} from 'antd';
import classNames from 'classnames';
import { numberWithCommas } from 'utils/helpers';
import styles from './TeamLeaderBoard.module.scss';
import { statuses } from './data';

function MainDataTable({ saleActivities, employees, saleFunds }) {
  return (
    <Flex flex={0.6} vertical className={styles.table}>
      <Flex className={styles.headerRow} align="center">
        <Flex className={styles.headerColumnTitle}>Name</Flex>
        {statuses.map((status) => (
          <Flex className={styles.headerColumnPerson} style={{ minWidth: status.width }} vertical justify="center" align="center">
            <Flex className={styles.rowStatusTitleText}>{status.title}</Flex>
            <Flex className={styles.rowStatusDurationText}>
              (
              {status.duration}
              )
            </Flex>
          </Flex>
        ))}
      </Flex>
      {employees.map((emp, index) => (
        <Flex className={classNames(styles.dataRow, { [styles.alternateColor]: index % 2 })}>
          <Flex className={styles.dataColumnTitle} align="center">{emp.name.split(' ')[0]}</Flex>
          {statuses.map((status) => (
            <Flex className={styles.dataColumnPerson} style={{ minWidth: status.width }} justify="center" align="center">
              {status.actionName || !saleFunds[emp.id] ? '' : '$'}
              {status.actionName ? ((((saleActivities[status.actionDuration] || {})[status.actionName.toLowerCase()] || {})[emp.id]) || ' ') : (numberWithCommas(saleFunds[emp.id]) || ' ')}
            </Flex>
          ))}
        </Flex>
      ))}

    </Flex>
  );
}

export default MainDataTable;
