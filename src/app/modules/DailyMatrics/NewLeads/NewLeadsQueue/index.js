import {
  Card,
  Flex,
} from 'antd';
import DataTable from 'app/modules/DashboardCards/DataTable';
import { formatTimeIn, getAvgTimeColor } from 'utils/helpers';
import classNames from 'classnames';
import { MatrixContext } from 'utils/contexts';
import { useContext } from 'react';
import styles from './NewLeadsQueue.module.scss';
import { columns } from './data';

function NewLeadsQueue() {
  const {
    newLeads, goalTime, getNewLeadsData,
  } = useContext(MatrixContext);
  const onlyNewLeads = newLeads.filter((l) => l.isNew && !l.isAllPassedTimer);
  const onlyTouched = newLeads.filter((l) => l.isAllPassedTimer || l.isTouched);
  const sumTime = onlyTouched.reduce((prev, curr) => {
    // eslint-disable-next-line no-param-reassign
    prev += curr.timeToRespond;
    return prev;
  }, 0);
  const averageTime = sumTime / onlyTouched.length;
  const onFinishTimer = () => {
    getNewLeadsData();
  };
  return (
    <Card className={styles.card} title="Current Untouched Leads in Que">
      <Flex flex={1} vertical>
        <div className={styles.tableContainer}>
          <DataTable
            columns={columns(onFinishTimer, goalTime)}
            data={onlyNewLeads}
            disableClick
            disableNewTag
            board="leads"
          />
        </div>
        <Flex vertical>
          <Flex className={styles.avgQueTitle}>Average Que Time</Flex>
          <Flex flex={1}>
            <Flex flex={0.5} vertical align="center">
              <Flex className={styles.avgTitle}>Actual for Today</Flex>
              <Flex className={classNames(styles.avgTime, styles[getAvgTimeColor(averageTime, goalTime)])}>{onlyTouched.length ? formatTimeIn(averageTime) : '00:00'}</Flex>
            </Flex>
            <Flex flex={0.5} vertical align="center">
              <Flex className={styles.avgTitle}>Goal</Flex>
              <Flex className={styles.avgTime}>{formatTimeIn(goalTime)}</Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default NewLeadsQueue;
