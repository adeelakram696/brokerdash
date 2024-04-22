/* eslint-disable react/no-array-index-key */
import {
  Modal, Flex, Button,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import styles from './SubmissionForm.module.scss';
import {
  qualifications, stepData, steps,
} from './data';
import SelectFunders from './SelectFundersForm';
import SelectDocuments from './SelectDocuments';
import QualificationCheck from './QualificationCheck';

function SubmissionForm({ show, handleClose }) {
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [selectedFunders, setSelectedFunders] = useState([]);
  const [selectedDocs, setSelectedFDoucments] = useState([]);
  const [showText, setShowText] = useState(false);
  const [textNote, setTextNote] = useState('');
  const [step, setStep] = useState(steps.qualification);
  const handleQualificationSelect = (key) => {
    let updated = [];
    if (selectedQualifications.includes(key)) {
      updated = selectedQualifications.filter((item) => item !== key);
    } else {
      updated = [...selectedQualifications, key];
    }
    setSelectedQualifications(updated);
  };
  const handleFunderSelect = (key) => {
    let updated = [];
    if (selectedFunders.includes(key)) {
      updated = selectedFunders.filter((item) => item !== key);
    } else {
      updated = [...selectedFunders, key];
    }
    setSelectedFunders(updated);
  };
  const handleDocSelect = (key) => {
    let updated = [];
    if (selectedDocs.includes(key)) {
      updated = selectedDocs.filter((item) => item !== key);
    } else {
      updated = [...selectedDocs, key];
    }
    setSelectedFDoucments(updated);
  };
  const handleNextStep = (nextStep) => {
    setStep(nextStep);
  };
  const handleSubmit = () => {
    console.log('submited');
  };
  const selectedValues = {
    [steps.qualification]: selectedQualifications,
    [steps.funders]: selectedFunders,
    [steps.documents]: selectedDocs,
  };
  const isNextEnabled = selectedValues[step].length > 0;
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          {stepData[step].prevStep
            ? (
              <Button onClick={() => { setStep(stepData[step].prevStep); }} className={styles.footerBackBtn} shape="round">
                Back
              </Button>
            ) : null}
          <Button
            onClick={
              () => (stepData[step].nextStep
                ? handleNextStep(stepData[step].nextStep)
                : handleSubmit())
            }
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
            disabled={!isNextEnabled}
          >
            {stepData[step].nextStep ? 'Next Step' : 'Submit'}
          </Button>
        </Flex>
)}
      onCancel={handleClose}
      className="submissionForm"
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24 }}>{stepData[step].title}</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400' }}>{stepData[step].subText}</Flex>
        </Flex>
)}
    >
      {step === steps.qualification ? (
        <QualificationCheck
          selectedItems={selectedQualifications}
          handleSelect={handleQualificationSelect}
          data={qualifications}
        />
      ) : null}
      {step === steps.funders ? (
        <SelectFunders
          selectedItems={selectedFunders}
          handleSelect={handleFunderSelect}
        />
      ) : null}
      {step === steps.documents ? (
        <SelectDocuments
          selectedItems={selectedDocs}
          handleSelect={handleDocSelect}
          showText={showText}
          handleShowText={setShowText}
          text={textNote}
          handleTextChange={setTextNote}
        />
      ) : null}
    </Modal>
  );
}
export default SubmissionForm;
