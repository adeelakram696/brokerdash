import {
  Flex, Dropdown, Modal, Spin,
} from 'antd';
import { boardNames, columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { useContext, useState } from 'react';
import { CloseSquareOutlined } from '@ant-design/icons';
import { updateClientInformation, updateStage } from 'app/apis/mutation';
import styles from './ActionsRow.module.scss';

function Disqualified() {
  const {
    board, details, leadId, getData,
  } = useContext(LeadContext);
  const [reason, setReason] = useState('');
  const [showLoading, setLoading] = useState(false);
  const hideModal = () => {
    setReason('');
  };
  const handleDisqualification = async () => {
    setLoading(true);
    const DQStage = board === boardNames.deals ? 'new_group91774' : 'new_group18958';
    const dataJson = { [columnIds[board].dq_reason]: reason };
    await updateClientInformation(leadId, details.board.id, dataJson);
    await updateStage(leadId, DQStage);
    setLoading(false);
    hideModal();
    getData();
  };
  const handleReasonSelect = ({ key }) => {
    setReason(key);
  };
  const reasons = [
    'Revenue below $5k per month',
    'Too many negative days',
    'No Business Bank Statements',
    'Previous Default History',
    'Restricted Industry',
    'Overleveraged',
    'Bank Account with Restricted Bank',
    'Modified Bank Statements',
  ];
  const items = reasons.map((r) => ({
    label: r,
    key: r,
  }));
  return (
    <>
      <Dropdown
        menu={{
          items,
          onClick: handleReasonSelect,
        }}
        trigger={['click']}
      >
        <Flex>
          <Flex className={styles.actionIcon} align="center"><CloseSquareOutlined style={{ color: '#457989' }} /></Flex>
          <Flex className={styles.actionText} align="center">Disqualified</Flex>
        </Flex>
      </Dropdown>
      <Modal
        title="Confirmation of Disqualification"
        open={reason}
        onOk={handleDisqualification}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Spin spinning={showLoading} fullscreen />
        <p>
          Are you sure you want to move this to Disqualified?
        </p>
      </Modal>
    </>
  );
}

export default Disqualified;
