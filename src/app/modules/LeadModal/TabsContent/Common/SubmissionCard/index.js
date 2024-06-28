import {
  Flex, Button,
} from 'antd';
import SubmissionForm from 'app/modules/LeadModal/SubmissionForm';
import { useState } from 'react';
import styles from './SubmissionCard.module.scss';

function SubmissionCard() {
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
  const [isInputPreviousSubmissionOpen, setInputPreviousSubmissionOpen] = useState(false);
  const handleSubmissionClick = () => {
    setIsSubmissionFormOpen(true);
  };
  const handleClose = () => {
    setIsSubmissionFormOpen(false);
    setInputPreviousSubmissionOpen(false);
  };
  const handlePreviSubmissionClick = () => {
    setInputPreviousSubmissionOpen(true);
  };
  return (
    <Flex flex={0.4} className={styles.newSubmissionCard} vertical>
      <Flex className={styles.newSubmissionHeading}>
        Submissions
      </Flex>
      <Flex className={styles.newSubmissionSubText}>
        Submit applications to selected funders
      </Flex>
      <Flex className={styles.sendSubmissionBtnContainer} justify="space-between">
        <Button onClick={handleSubmissionClick} className={styles.sendSubmissionBtn} type="primary" shape="round">
          New Submission
        </Button>
        <Button onClick={handlePreviSubmissionClick} className={styles.inputSubmissionBtn} type="primary" shape="round">
          Input Previous Submission
        </Button>
      </Flex>
      {(isSubmissionFormOpen || isInputPreviousSubmissionOpen)
        && (
        <SubmissionForm
          show={isSubmissionFormOpen || isInputPreviousSubmissionOpen}
          handleClose={handleClose}
          inputPrevSubmission={isInputPreviousSubmissionOpen}
        />
        )}
    </Flex>
  );
}

export default SubmissionCard;
