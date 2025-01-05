import {
  Flex, Dropdown, Modal, Spin,
  Button,
  Form,
} from 'antd';
import { boardNames, columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { useContext, useState, useEffect } from 'react';
import { CloseSquareOutlined } from '@ant-design/icons';
import { updateClientInformation, updateStage } from 'app/apis/mutation';
import { fetchBoardDropDownColumnStrings } from 'app/apis/query';
import TextAreaField from 'app/components/Forms/TextAreaField';
import styles from './ActionsRow.module.scss';

function Disqualified() {
  const {
    board, details, leadId, getData,
  } = useContext(LeadContext);
  const [form] = Form.useForm();
  const [reason, setReason] = useState('');
  const [reasons, setReasons] = useState([]);
  const [showLoading, setLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const hideModal = () => {
    setReason('');
  };
  const fetchReasons = async () => {
    const res = await fetchBoardDropDownColumnStrings(
      details.board.id,
      columnIds[board].dq_reason,
    );
    setReasons(res);
  };
  useEffect(() => {
    fetchReasons();
  }, []);
  const handleDisqualification = async (values) => {
    setLoading(true);
    const DQStage = board === boardNames.deals ? 'new_group91774' : 'new_group18958';
    const dataJson = {
      [isCustom ? columnIds[board].dq_text_reason : columnIds[board].dq_reason]: isCustom
        ? values.customText : reason,
    };
    await updateClientInformation(leadId, details.board.id, dataJson);
    await updateStage(leadId, DQStage);
    setLoading(false);
    setIsCustom(false);
    hideModal();
    getData();
  };
  const handleReasonSelect = ({ key }) => {
    if (key === 'custom') {
      setIsCustom(true);
      return;
    }
    setReason(key);
  };
  const items = [...reasons.map((r) => (
    {
      label: r,
      key: r,
    })),
  {
    label: 'Custom',
    key: 'custom',
  },
  ];
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
      <Modal
        open={isCustom}
        onCancel={() => { setIsCustom(false); }}
        title="Custom Decline Reason"
        footer={[
          <Button
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
            onClick={() => { form.submit(); }}
            loading={showLoading}
          >
            Decline
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleDisqualification}>
          <Form.Item
            noStyle
            name="customText"
          >
            <TextAreaField />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Disqualified;
