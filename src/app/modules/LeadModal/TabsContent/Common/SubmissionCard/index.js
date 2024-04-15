import {
  Flex, Button,
} from 'antd';
import SubmissionForm from 'app/modules/LeadModal/SubmissionForm';
import { useState } from 'react';
import styles from './SubmissionCard.module.scss';

function SubmissionCard() {
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState();
  const handleSubmissionClick = () => {
    setIsSubmissionFormOpen(true);
  };
  const handleClose = () => {
    setIsSubmissionFormOpen(false);
  };
  return (
    <Flex flex={0.4} className={styles.newSubmissionCard} vertical>
      <Flex className={styles.newSubmissionHeading}>
        Submissions
      </Flex>
      <Flex className={styles.newSubmissionSubText}>
        Submit applications to selected funders
      </Flex>
      <Flex className={styles.sendSubmissionBtnContainer}>
        <Button onClick={handleSubmissionClick} className={styles.sendSubmissionBtn} type="primary" shape="round">
          New Submission
        </Button>
      </Flex>
      <SubmissionForm show={isSubmissionFormOpen} handleClose={handleClose} />
    </Flex>
  );
}

export default SubmissionCard;
