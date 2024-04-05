import {
  Flex, Button,
} from 'antd';
import styles from './style.module.scss';

function SubmissionCard() {
  return (
    <Flex flex={0.4} className={styles.newSubmissionCard} vertical>
      <Flex className={styles.newSubmissionHeading}>
        Submissions
      </Flex>
      <Flex className={styles.newSubmissionSubText}>
        Submit applications to selected funders
      </Flex>
      <Flex className={styles.sendSubmissionBtnContainer}>
        <Button className={styles.sendSubmissionBtn} type="primary" shape="round">
          New Submission
        </Button>
      </Flex>
    </Flex>
  );
}

export default SubmissionCard;
