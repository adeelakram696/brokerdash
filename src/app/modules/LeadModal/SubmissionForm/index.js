/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import { useContext, useEffect, useState } from 'react';
import {
  Modal, Flex, Button,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { columnIds, env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { sendSubmission } from 'app/apis/mutation';
import { getColumnValue } from 'utils/helpers';
import { validateSubmission } from 'utils/validateSubmission';
import { resendSubmissionApplication } from 'app/apis/reSubmitSubmission';
import styles from './SubmissionForm.module.scss';
import {
  qualifications, stepData, steps,
} from './data';
import SelectFunders from './SelectFundersForm';
import SelectDocuments from './SelectDocuments';
import QualificationCheck from './QualificationCheck';
import { statuses } from '../TabsContent/Common/FundersList/data';
import { SubmissionErrors } from './SubmissionErrors';

function SubmissionForm({
  show, handleClose, type = 'funder', inputPrevSubmission, resubmiteId,
  funderName,
}) {
  const {
    leadId, boardId, board, details, getData,
  } = useContext(LeadContext);
  const isContract = type === 'contract';
  const isResubmit = type === 'renew';
  const [loading, setLoading] = useState(false);
  const [submittedFunders, setSubmittedFunders] = useState([]);
  const [selectedFunders, setSelectedFunders] = useState([]);
  const [selectedDocs, setSelectedDoucments] = useState([]);
  const [submissionErrors, setSubmissionErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [showText, setShowText] = useState(false);
  const [textNote, setTextNote] = useState('');
  const [step, setStep] = useState((isContract || isResubmit) ? steps.documents
    : (inputPrevSubmission ? steps.funders : steps.qualification));
  useEffect(() => {
    const ids = details?.subitems?.map((item) => {
      const preSelected = getColumnValue(item?.column_values, columnIds.subItem.funding_accounts);
      const id = preSelected?.linkedPulseIds?.map((v) => v.linkedPulseId.toString());
      return id[0];
    });
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
    if (!isContract) {
      const validation = await validateSubmission(
        selectedFunders,
        submittedFunders,
        details,
        isResubmit,
      );
      if (validation.length > 0) {
        setSubmissionErrors(validation);
        setShowErrors(true);
        return;
      }
    }
    // eslint-disable-next-line no-unreachable
    const linkedPulseIds = selectedFunders.map((id) => ({ linkedPulseId: Number(id) }));
    const docs = selectedDocs.join(',');
    let cta = !inputPrevSubmission ? [columnIds[board].submit_offers] : null;
    let payload = {
      [columnIds[board].funders_dropdown]: { linkedPulseIds },
      [columnIds[board].additional_body_content]: textNote,
    };
    if (!inputPrevSubmission) {
      payload[columnIds[board].submit_offers_docs] = docs;
    }
    if (inputPrevSubmission) {
      payload[columnIds[board].input_previous_submission] = 'Trigger';
    }
    if (isContract) {
      payload = {
        [columnIds[board].submit_contract_docs]: docs,
        [columnIds[board].additional_request_contract_message]: textNote,
      };
      cta = [columnIds[board].request_contract];
    }
    if (isResubmit) {
      payload = {
        [columnIds[board].submit_offers_docs]: docs,
        [columnIds[board].additional_body_content]: textNote,
      };
      cta = null;
    }
    setLoading(true);
    await sendSubmission(leadId, boardId, payload, cta);
    if (isResubmit) {
      await sendSubmission(
        resubmiteId,
        env.boards.submissions,
        { [columnIds.subItem.status]: statuses.new },
      );
      resendSubmissionApplication(
        resubmiteId,
        funderName,
      );
    }
    getData();
    setSelectedFunders([]);
    setSelectedDoucments([]);
    setTextNote('');
    setStep((isContract || isResubmit) ? steps.documents
      : (inputPrevSubmission ? steps.funders : steps.qualification));
    setLoading(false);
    handleClose();
  };
  const selectedValues = {
    [steps.qualification]: [1],
    [steps.funders]: selectedFunders,
    [steps.documents]: selectedDocs,
  };
  const isNextEnabled = selectedValues[step]?.length > 0;
  let ctaText = 'Submit';
  if ((stepData[step].nextStep && !inputPrevSubmission)) {
    ctaText = 'Next Step';
  } else if (isContract) {
    ctaText = 'Send Contract';
  } else if (isResubmit) {
    ctaText = 'Resubmit';
  } else if (inputPrevSubmission) {
    ctaText = 'Input Previous';
  }
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          {stepData[step].prevStep && !(isContract || isResubmit) && !inputPrevSubmission
            ? (
              <Button onClick={() => { setStep(stepData[step].prevStep); }} className={styles.footerBackBtn} shape="round">
                Back
              </Button>
            ) : null}
          <Button
            onClick={
              () => (stepData[step].nextStep && !inputPrevSubmission
                ? handleNextStep(stepData[step].nextStep)
                : handleSubmit())
            }
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
            disabled={!isNextEnabled}
            loading={loading}
          >
            {ctaText}
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
        />
      ) : null}
      <SubmissionErrors
        show={showErrors}
        errors={submissionErrors}
        handleClose={() => setShowErrors(false)}
      />
    </Modal>
  );
}
export default SubmissionForm;
