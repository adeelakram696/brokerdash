/* eslint-disable react/no-array-index-key */
import {
  Modal, Flex, Button,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import styles from './SubmissionForm.module.scss';
import { docs, funders } from './data';
import SelectFunders from './SelectFundersForm';
import SelectDocuments from './SelectDocuments';

function SubmissionForm({ show, handleClose }) {
  const [selectedFunders, setSelectedFunders] = useState([]);
  const [selectedDocs, setSelectedFDoucments] = useState([]);
  const [showText, setShowText] = useState(false);
  const [textNote, setTextNote] = useState('');
  const [step, setStep] = useState(1);
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
  const handleNextStep = () => {
    if (selectedFunders.length > 0) {
      setStep(2);
    }
  };

  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          {step === 2
            ? (
              <Button onClick={() => { setStep(1); }} className={styles.footerBackBtn} shape="round">
                Back to Funder Selection
              </Button>
            ) : null}
          <Button onClick={handleNextStep} className={styles.footerSubmitCTA} type="primary" shape="round">
            {step === 1 ? 'Next Step' : 'Submit'}
          </Button>
        </Flex>
)}
      onCancel={handleClose}
      className="submissionForm"
      style={{ top: 20 }}
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24 }}>{step === 1 ? 'Select Funders' : 'Select documents to Submit'}</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400' }}>{step === 1 ? 'Select the funder(s) from the list below' : 'Select the file(2) below that you would like to submit'}</Flex>
        </Flex>
)}
    >
      {step === 1 ? (
        <SelectFunders
          selectedItems={selectedFunders}
          handleSelect={handleFunderSelect}
          data={funders}
        />
      ) : (
        <SelectDocuments
          selectedItems={selectedDocs}
          handleSelect={handleDocSelect}
          data={docs}
          showText={showText}
          handleShowText={setShowText}
          text={textNote}
          handleTextChange={setTextNote}
        />
      )}
    </Modal>
  );
}
export default SubmissionForm;
