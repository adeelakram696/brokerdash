import { useEffect, useState } from 'react';
import { Modal, Flex } from 'antd';
import { fetchLeadClientDetails, fetchMarkAsImportant } from 'app/apis/query';
import { columnIds } from 'utils/constants';
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
  const [importantMsg, setImportantMsg] = useState();
  const getData = async () => {
    const { res, columns, subitems } = await fetchLeadClientDetails(leadId);
    setDetails({ ...res.data.details[0], ...columns, subitems });
  };
  const getMarkAsImportant = async () => {
    const importantUpdate = await fetchMarkAsImportant(leadId, columnIds[board].mark_as_important);
    setImportantMsg(importantUpdate?.text_body);
  };
  useEffect(() => {
    getData();
    getMarkAsImportant();
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
      <Flex className={styles.modalBody} vertical>
        <ModalHeader leadId={leadId} board={board} data={details} />
        <ActionRow
          leadId={leadId}
          board={board}
          details={details}
          importantMsg={importantMsg}
          getData={getData}
          getMarkAsImportant={getMarkAsImportant}
        />
        <Flex className={styles.mainContentContainer} flex={1}>
          <Content leadId={leadId} board={board} details={details} getData={getData} />
          <ActivityLog leadId={leadId} board={board} markImportant={getMarkAsImportant} />
        </Flex>
      </Flex>
    </Modal>
  );
}

export default LeadModal;
