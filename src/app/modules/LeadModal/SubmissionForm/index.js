/* eslint-disable react/no-array-index-key */
import { useContext, useEffect, useState } from 'react';
import {
  Modal, Flex, Button,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { sendSubmission } from 'app/apis/mutation';
import { getColumnValue } from 'utils/helpers';
import styles from './SubmissionForm.module.scss';
import {
  qualifications, stepData, steps,
} from './data';
import SelectFunders from './SelectFundersForm';
import SelectDocuments from './SelectDocuments';
import QualificationCheck from './QualificationCheck';

function SubmissionForm({ show, handleClose, type = 'funder' }) {
  const {
    leadId, boardId, board, details,
  } = useContext(LeadContext);
  const isContract = type === 'contract';
  const [loading, setLoading] = useState(false);
  const [submittedFunders, setSubmittedFunders] = useState([]);
  const [selectedFunders, setSelectedFunders] = useState([]);
  const [selectedDocs, setSelectedDoucments] = useState([]);
  const [showText, setShowText] = useState(false);
  const [textNote, setTextNote] = useState('');
  const [step, setStep] = useState(isContract ? steps.documents : steps.qualification);
  useEffect(() => {
    const preSelected = getColumnValue(details?.column_values, columnIds.deals.funders_dropdown);
    const ids = preSelected?.linkedPulseIds.map((v) => v.linkedPulseId.toString());
    setSelectedFunders(ids || []);
    setSubmittedFunders(ids || []);
  }, []);
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
    let cta = [columnIds[board].submit_offers];
    let payload = {
      [columnIds[board].funders_dropdown]: { linkedPulseIds },
      [columnIds[board].submit_offers_docs]: docs,
      [columnIds[board].additional_body_content]: textNote,
    };
    if (isContract) {
      payload = {
        [columnIds[board].submit_contract_docs]: docs,
        [columnIds[board].additional_request_contract_message]: textNote,
      };
      cta = [columnIds[board].request_contract];
    }
    setLoading(true);
    await sendSubmission(leadId, boardId, payload, cta);
    setSelectedFunders([]);
    setSelectedDoucments([]);
    setTextNote('');
    setStep(isContract ? steps.documents : steps.qualification);
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
          {stepData[step].prevStep && !isContract
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
            {stepData[step].nextStep ? 'Next Step' : `${isContract ? 'Send Contract' : 'Submit'}`}
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
          submittedItems={submittedFunders}
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
          isContract={isContract}
        />
      ) : null}
    </Modal>
  );
}
export default SubmissionForm;
