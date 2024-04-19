import { Progress, Flex } from 'antd';
import { formatTimeIn } from 'utils/helpers';
import styles from './GoalProgressBar.module.scss';

const progressText = () => (
  <Flex className={styles.progressText} justify="space-between">
    <div>0S</div>
    <div>1Min Goal</div>
    <div>5MIN</div>
  </Flex>
);

function GoalProgressBar({ time = 150, max = 300, goal = 150 }) {
  const strokeColor = {
    '0%': '#FD3737',
    '100%': '#D43838',
  };
  const successPerc = (goal * 100) / max;
  const progressPrec = (time * 100) / max;
  return (
    <Flex className={styles.goalProgressContainer} flex="1" vertical justify="center" align="center">
      <Flex className={styles.progressTime}>
        {formatTimeIn(time)}
        s
      </Flex>
      <Progress
        className="goal-progress-bar"
        percent={progressPrec}
        success={{ percent: successPerc, strokeColor: '#EFEFEF' }}
        size="small"
        trailColor="#EFEFEF"
        strokeColor={strokeColor}
        format={() => progressText()}
      />
    </Flex>
  );
}

export default GoalProgressBar;
