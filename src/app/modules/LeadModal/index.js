import { Modal, Flex } from 'antd';
import styles from './LeadModal.module.scss';
import ModalHeader from './Header';
import SubRow from './SubRow';
import ActionRow from './ActionsRow';
import Content from './Content';
import ActivityLog from './ActivityLog';

function LeadModal({ show, handleClose }) {
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
        <ModalHeader />
        <SubRow />
        <ActionRow />
        <Flex className={styles.mainContentContainer} flex={1}>
          <Content />
          <ActivityLog />
        </Flex>
      </Flex>
    </Modal>
  );
}

export default LeadModal;
