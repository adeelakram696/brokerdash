import { useEffect, useState } from 'react';
import { Modal, Flex } from 'antd';
import {
  fetchFunders,
  fetchLeadClientDetails,
  fetchLeadDocs,
  fetchMarkAsImportant,
} from 'app/apis/query';
import { columnIds, env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import styles from './LeadModal.module.scss';
import ModalHeader from './Header';
import ActionRow from './ActionsRow';
import Content from './Content';
import ActivityLog from './ActivityLog';

function LeadModal({
  show,
  handleClose,
  leadId,
  board,
}) {
  const [details, setDetails] = useState({});
  const [funders, setFunders] = useState({});
  const [docs, setDocs] = useState({});
  const [importantMsg, setImportantMsg] = useState();
  const getData = async () => {
    const { res, columns, subitems } = await fetchLeadClientDetails(leadId);
    setDetails({ ...res.data.details[0], ...columns, subitems });
  };
  const getDocs = async () => {
    const res = await fetchLeadDocs(leadId);
    setDocs(res.data.docs[0]);
  };
  const getFunders = async () => {
    const res = await fetchFunders(env.boards.funders);
    setFunders(res.data.funders[0].items_page?.items);
  };
  const getMarkAsImportant = async () => {
    const importantUpdate = await fetchMarkAsImportant(leadId, columnIds[board].mark_as_important);
    setImportantMsg(importantUpdate?.text_body);
  };
  useEffect(() => {
    getData();
    getDocs();
    getMarkAsImportant();
    getFunders();
  }, [leadId]);
  const onClose = () => {
    handleClose();
  };
  return (
    <Modal
      open={show}
      footer={null}
      onCancel={onClose}
      width="100%"
      className="leadModal"
      style={{ top: 20 }}
    >
      <LeadContext.Provider
        value={{
          details,
          funders,
          docs,
          importantMsg,
          getData,
          getDocs,
          getFunders,
          getMarkAsImportant,
          leadId,
          board,
          boardId: details?.board?.id,
          groupId: details?.group?.id,
        }}
      >
        <Flex className={styles.modalBody} vertical>
          <ModalHeader />
          <ActionRow />
          <Flex className={styles.mainContentContainer} flex={1}>
            <Content />
            <ActivityLog />
          </Flex>
        </Flex>
      </LeadContext.Provider>
    </Modal>
  );
}

export default LeadModal;
