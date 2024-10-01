import {
  Flex, Modal, Spin,
} from 'antd';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { useContext, useState } from 'react';
import { CloseSquareOutlined } from '@ant-design/icons';
import { ctaBtn } from 'app/apis/mutation';
import styles from './ActionsRow.module.scss';

function ReAssignLead() {
  const {
    board, details, leadId,
  } = useContext(LeadContext);
  const [confirm, setConfirm] = useState(false);
  const [showLoading, setLoading] = useState(false);
  const hideModal = () => {
    setConfirm(false);
  };
  const handleReassign = async () => {
    setLoading(true);
    await ctaBtn(leadId, details.board.id, columnIds[board].reassign_rep_btn);
    setTimeout(() => {
      setLoading(false);
      hideModal();
      window.location.reload();
    }, 4000);
  };
  return (
    <>
      <Flex onClick={() => { setConfirm(true); }}>
        <Flex className={styles.actionIcon} align="center"><CloseSquareOutlined style={{ color: '#457989' }} /></Flex>
        <Flex className={styles.actionText} align="center">Reassign to someone else</Flex>
      </Flex>
      <Modal
        title="Confirmation"
        open={confirm}
        onOk={handleReassign}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Spin spinning={showLoading} fullscreen />
        <p>
          Are you sure you want to re-assign this to Lead to someone else?
        </p>
      </Modal>
    </>
  );
}

export default ReAssignLead;
