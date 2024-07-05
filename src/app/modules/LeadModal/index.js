import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Modal, Flex, Spin, message,
  Skeleton,
} from 'antd';
import {
  fetchBoardColorColumnStrings,
  fetchBoardDropDownColumnStrings,
  fetchFunders,
  fetchLeadClientDetails,
  fetchLeadDocs,
  fetchLeadUpdates,
  fetchMarkAsImportant,
} from 'app/apis/query';
import { columnIds, env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { updateStageToSubmission } from 'app/apis/mutation';
import { getColumnValue, getQueryParams } from 'utils/helpers';
import monday from 'utils/mondaySdk';
import styles from './LeadModal.module.scss';
import ModalHeader from './Header';
import ActionRow from './ActionsRow';
import Content from './Content';
import ActivityLog from './ActivityLog';

function LeadModal({
  show,
  handleClose,
  leadId,
  closeIcon = true,
}) {
  let unsubscribe;
  let unsubscribe1;
  let timeoutId;
  const location = useLocation();
  const [details, setDetails] = useState({});
  const [funders, setFunders] = useState([]);
  const [states, setStates] = useState([]);
  const [industries, setRestIndustries] = useState([]);
  const [users, setUsers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [currentTab, setCurrentTab] = useState([]);
  const [docs, setDocs] = useState({});
  const [board, setBoard] = useState('');
  const [channels, setChannels] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [importantMsg, setImportantMsg] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const getData = async () => {
    clearTimeout(timeoutId);
    const data = await fetchLeadClientDetails(leadId);
    setDetails(data);
    setBoard(env.boards[data.board.id]);
  };
  const getDocs = async () => {
    const res = await fetchLeadDocs(leadId);
    setDocs(res.data.docs[0]);
  };
  const getFunders = async () => {
    const res = await fetchFunders(env.boards.funders);
    setFunders(res);
  };
  const getStates = async () => {
    const res = await fetchBoardDropDownColumnStrings(
      env.boards.funders,
      columnIds.funders.state_restrictions,
    );
    setStates(res);
  };
  const getIndustries = async () => {
    const res = await fetchBoardDropDownColumnStrings(
      env.boards.funders,
      columnIds.funders.rest_industries,
    );
    setRestIndustries(res);
  };
  const getMarkAsImportant = async () => {
    const importantUpdate = await fetchMarkAsImportant(leadId, columnIds[board].mark_as_important);
    setImportantMsg(importantUpdate?.text_body);
  };
  const getUpdates = async () => {
    const res = await fetchLeadUpdates(leadId);
    setUpdates(res.data.items[0]?.updates);
    setUsers(res.data.users);
  };
  const getChannels = async () => {
    const res = await fetchBoardColorColumnStrings(details?.board?.id, columnIds[board].channel);
    setChannels(res);
  };
  const refetchAllData = async () => {
    setLoadingData(true);
    await getData();
    await getDocs();
    await getFunders();
    await getMarkAsImportant();
    await getUpdates();
    setLoadingData(false);
  };
  const refetchData = ({ data }) => {
    if (data.itemIds.includes(Number(leadId))) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        getData();
        getDocs();
      }, 1000 * 3);
    }
  };
  const redirectToDeals = ({ data }) => {
    const isMoved = data.itemIds[0] === Number(leadId)
    && data.columnId === columnIds.leads.move_to_deals;
    if (isMoved) {
      const url = `${env.boardBaseURL}${env.boards.deals}/pulses/${leadId}`;
      window.open(url, '_blank');
    }
  };
  const validateData = () => {
    const companyName = details[columnIds.leads.company_name];
    const email = details[columnIds.leads.email];
    const industry = details[columnIds.leads.industry];
    const stateIncorporated = details[columnIds.leads.state_incorporated];
    const incoming_files = getColumnValue(details.column_values, columnIds.leads.incoming_files);
    const errorFields = [];
    if (!companyName) { errorFields.push('Lead Company name'); }
    if (!email) { errorFields.push('Email'); }
    if (!industry) { errorFields.push('Industry'); }
    if (!stateIncorporated) { errorFields.push('State Incorporated'); }
    if (!incoming_files) { errorFields.push('Incoming Files'); }
    if (errorFields.length > 0) messageApi.error(`${errorFields.join(', ')} is required before Ready for Submission`);
    return errorFields.length === 0;
  };
  const handleReadyForSubmission = async () => {
    const isValidated = validateData();
    if (isValidated) {
      const res = await updateStageToSubmission(leadId);
      if (res) messageApi.success('Successfully updated');
      const { itemId, boardId } = getQueryParams(location);
      if (itemId && boardId) {
        unsubscribe = monday.listen('events', redirectToDeals);
      }
      setTimeout(refetchAllData, 1000 * 5);
      setTimeout(refetchAllData, 1000 * 10);
    }
  };
  useEffect(() => {
    getData();
    getDocs();
    getFunders();
    getStates();
    getIndustries();
  }, [leadId]);
  useEffect(() => {
    if (!board) return;
    getMarkAsImportant();
    getChannels();
  }, [board]);
  useEffect(() => () => {
    if (!unsubscribe) return;
    unsubscribe();
  }, []);
  useEffect(() => {
    unsubscribe1 = monday.listen('events', refetchData);
    return () => {
      if (!unsubscribe1) return;
      unsubscribe1();
    };
  }, []);
  const onClose = () => {
    handleClose();
  };
  return (
    <Modal
      open={show}
      footer={null}
      onCancel={onClose}
      width="100%"
      height="900px"
      className="leadModal"
      style={{ top: 20 }}
      closeIcon={closeIcon}
    >
      <LeadContext.Provider
        value={{
          details,
          funders,
          docs,
          importantMsg,
          leadId,
          states,
          industries,
          board,
          boardId: details?.board?.id,
          groupId: details?.group?.id,
          loadingData,
          updates,
          users,
          messageApi,
          currentTab,
          channels,
          getData,
          getDocs,
          getFunders,
          getMarkAsImportant,
          onClose,
          getUpdates,
          setUpdates,
          refetchAllData,
          handleReadyForSubmission,
          setLoadingData,
          setCurrentTab,
        }}
      >
        <Spin tip="Loading..." spinning={!details.id || loadingData}>
          {contextHolder}
          <Flex className={styles.modalBody} vertical>
            {board ? (
              <>
                <ModalHeader />
                <ActionRow />
                <Flex className={styles.mainContentContainer} flex={1}>
                  <Content />
                  <ActivityLog />
                </Flex>
              </>
            ) : <Skeleton title />}
          </Flex>

        </Spin>
      </LeadContext.Provider>
    </Modal>
  );
}

export default LeadModal;
