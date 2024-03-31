'use client';

import { Card, Progress, Flex } from 'antd';
import styles from './ProgressCard.module.scss';

function ProgressText({ value, total }) {
  return (
    <Flex align="center" justify="center" vertical>
      <Flex className={styles.progressNumber}>{value}</Flex>
      <Flex className={styles.progressTotal}>
        Out of
        {' '}
        {total}
      </Flex>
    </Flex>
  );
}

function ProgressCard({
  value, total, title, subTitle, color, icon,
}) {
  const percent = (value * 100) / total;

  return (
    <Card className={styles.progressCard}>
      <Flex align="center" justify="center" vertical>
        <div className={styles.topText}>
          {subTitle}
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.icon}>{icon}</div>
          <Progress
            strokeColor={color}
            strokeWidth="10"
            className={styles.progressChart}
            type="circle"
            percent={percent}
            format={() => ProgressText({ value, total })}
            size={120}
          />
        </div>
        <div className={styles.titleText}>{title}</div>
      </Flex>
    </Card>
  );
}
export default ProgressCard;
