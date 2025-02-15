/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import {
  useContext, useEffect, useState,
} from 'react';
import {
  Modal, Flex, Button,
  Spin,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { columnIds, env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { sendSubmission } from 'app/apis/mutation';
import { getColumnValue } from 'utils/helpers';
import { validateSubmission } from 'utils/validateSubmission';
import { resendSubmissionApplication, submissionApplication } from 'app/apis/reSubmitSubmission';
import monday from 'utils/mondaySdk';
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
  funderName, funderId,
}) {
  let newItemEventUnSubs;
  const {
    leadId, boardId, board, details, getData, setLoadingData,
  } = useContext(LeadContext);
  const isContract = type === 'contract';
  const isResubmit = type === 'renew';
  const [loading, setLoading] = useState(false);
  const [submittedFunders, setSubmittedFunders] = useState([]);
  const [selectedFunders, setSelectedFunders] = useState([]);
  const [selectedDocs, setSelectedDoucments] = useState([]);
  const [applicationDoc, setApplicationDoc] = useState();
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
      return (id || [])[0];
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
  const handleDocSelect = (key, docSelectId) => {
    let updated = [];
    if (selectedDocs.includes(key) && !(key === (applicationDoc || docSelectId))) {
      updated = selectedDocs.filter((item) => item !== key);
    } else {
      if (selectedDocs.includes(key)) return;
      updated = [...selectedDocs, key];
    }
    setSelectedDoucments(updated);
  };
  const handleNextStep = (nextStep) => {
    setStep(nextStep);
  };
  const submitDeal = ({ data }) => {
    if (((data?.itemIds || [])[0] || '').toString() === leadId && data.columnId === 'subitems') {
      const pulseId = (data?.columnValue?.added_pulse || [])[0]?.linkedPulseId;
      submissionApplication(pulseId);
      getData();
      setSelectedFunders([]);
      setSelectedDoucments([]);
      setTextNote('');
      setStep((isContract || isResubmit) ? steps.documents
        : (inputPrevSubmission ? steps.funders : steps.qualification));
      setLoading(false);
      setLoadingData(false);
      newItemEventUnSubs();
      handleClose();
    }
  };
  const handleSubmit = async () => {
    if (!isContract && !inputPrevSubmission) {
      const validation = await validateSubmission({
        funders: selectedFunders,
        alreadySubmitted: submittedFunders,
        details,
        isResubmit,
        resubmitFunderId: funderId,
        selectedDocs,
      });
      if (validation.length > 0) {
        setSubmissionErrors(validation);
        setShowErrors(true);
        return;
      }
    }
    // eslint-disable-next-line no-unreachable
    const linkedPulseIds = selectedFunders.map((id) => ({ linkedPulseId: Number(id) }))
      .filter(({ linkedPulseId }) => linkedPulseId);
    const docs = selectedDocs.join(',');
    // let cta = !inputPrevSubmission ? [columnIds[board].submit_offers] : null;
    let cta = null;
    let payload = {
      [columnIds[board].funders_dropdown]: { linkedPulseIds },
      [columnIds[board].additional_body_content]: textNote,
    };
    if (!inputPrevSubmission) {
      payload[columnIds[board].submit_offers_docs] = docs;
      payload[columnIds[board].application_doc_id] = applicationDoc;
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
        [columnIds[board].application_doc_id]: applicationDoc,
        [columnIds[board].additional_body_content]: textNote,
      };
      cta = null;
    }
    setLoading(true);
    await sendSubmission(leadId, boardId, payload, cta);
    if (!inputPrevSubmission && !isContract && !isResubmit) {
      payload = {};
      payload[columnIds[board].submit_offers_status] = 'Trigger';
      await sendSubmission(leadId, boardId, payload, cta);
      setLoadingData(true);
      newItemEventUnSubs = monday.listen(['change_column_values'], submitDeal);
    }
    if (inputPrevSubmission) {
      payload = {};
      payload[columnIds[board].input_previous_submission] = 'Trigger';
      await sendSubmission(leadId, boardId, payload, cta);
    }
    if (isResubmit) {
      await sendSubmission(
        resubmiteId,
        env.boards.submissions,
        { [columnIds.subItem.status]: statuses.new },
        null,
      );
      payload = {};
      payload[columnIds[board].submit_offers_status] = 'Trigger';
      await sendSubmission(leadId, boardId, payload, cta);
      resendSubmissionApplication(
        resubmiteId,
        funderName,
      );
    }
    if (inputPrevSubmission || isResubmit || isContract) {
      getData();
      setSelectedFunders([]);
      setSelectedDoucments([]);
      setTextNote('');
      setStep((isContract || isResubmit) ? steps.documents
        : (inputPrevSubmission ? steps.funders : steps.qualification));
      setLoading(false);
      handleClose();
    }
  };
  useEffect(() => () => {
    if (!newItemEventUnSubs) return;
    newItemEventUnSubs();
  }, []);
  const selectedValues = {
    [steps.qualification]: [1],
    [steps.funders]: selectedFunders,
    [steps.documents]: selectedDocs,
  };
  const isNextEnabled = selectedValues[step]?.length > 0 && (
    step === steps.documents ? applicationDoc : true
  );
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
      loading={loading}
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
      <Spin tip="Loading..." spinning={loading} fullscreen />
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
          applicationDoc={applicationDoc}
          setApplicationDoc={setApplicationDoc}
        />
      ) : null}
      {showErrors && (
      <SubmissionErrors
        show={showErrors}
        errors={submissionErrors}
        handleClose={() => setShowErrors(false)}
      />
      )}
    </Modal>
  );
}
export default SubmissionForm;
