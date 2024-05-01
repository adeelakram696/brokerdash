/* eslint-disable react/no-array-index-key */
import {
  Modal, Flex, Button,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useContext, useState } from 'react';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { sendSubmission } from 'app/apis/mutation';
import styles from './SubmissionForm.module.scss';
import {
  qualifications, stepData, steps,
} from './data';
import SelectFunders from './SelectFundersForm';
import SelectDocuments from './SelectDocuments';
import QualificationCheck from './QualificationCheck';

function SubmissionForm({ show, handleClose }) {
  const {
    leadId, boardId, board,
  } = useContext(LeadContext);
  const [loading, setLoading] = useState(false);
  const [selectedFunders, setSelectedFunders] = useState([]);
  const [selectedDocs, setSelectedDoucments] = useState([]);
  const [showText, setShowText] = useState(false);
  const [textNote, setTextNote] = useState('');
  const [step, setStep] = useState(steps.qualification);
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
    setSelectedDoucments(updated);
  };
  const handleNextStep = (nextStep) => {
    setStep(nextStep);
  };
  const handleSubmit = async () => {
    const linkedPulseIds = selectedFunders.map((id) => ({ linkedPulseId: Number(id) }));
    const docs = selectedDocs.join(',');
    const payload = {
      [columnIds[board].funders_dropdown]: { linkedPulseIds },
      [columnIds[board].submit_offers_docs]: docs,
      [columnIds[board].additional_body_content]: textNote,
    };
    setLoading(true);
    await sendSubmission(leadId, boardId, payload, [columnIds[board].submit_offers]);
    setSelectedFunders([]);
    setSelectedDoucments([]);
    setTextNote('');
    setStep(steps.qualification);
    setLoading(false);
    handleClose();
  };
  const selectedValues = {
    [steps.qualification]: [1],
    [steps.funders]: selectedFunders,
    [steps.documents]: selectedDocs,
  };
  const isNextEnabled = selectedValues[step]?.length > 0;
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
            loading={loading}
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
