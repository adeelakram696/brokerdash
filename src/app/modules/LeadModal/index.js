import { Modal, Flex } from 'antd';
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
  return (
    <Modal
      open={show}
      footer={null}
      onCancel={handleClose}
      width="100%"
      className="leadModal"
      style={{ top: 20 }}
    >
      <Flex className={styles.modalBody} vertical>
        <ModalHeader leadId={leadId} board={board} />
        <ActionRow leadId={leadId} board={board} />
        <Flex className={styles.mainContentContainer} flex={1}>
          <Content leadId={leadId} board={board} />
          <ActivityLog leadId={leadId} board={board} />
        </Flex>
      </Flex>
    </Modal>
  );
}

export default LeadModal;
