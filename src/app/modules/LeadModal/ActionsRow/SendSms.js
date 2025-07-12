import {
  Flex, Modal, Button, Form,
} from 'antd';
import { SMSMobileIcon } from 'app/images/icons';
import TextAreaField from 'app/components/Forms/TextAreaField';
import { useContext, useState } from 'react';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { sendSmsToClient } from '../mutations';
import styles from './ActionsRow.module.scss';

function SendSms() {
  const {
    leadId, board, boardId,
  } = useContext(LeadContext);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onSubmit = async (values) => {
    setLoading(true);
    await sendSmsToClient(
      leadId,
      boardId,
      columnIds[board].send_sms,
      columnIds[board].text_message,
      values.textMessage,
    );
    setLoading(false);
    setShow(false);
  };
  return (
    <>
      <Flex onClick={() => { setShow(true); }}>
        <Flex className={styles.actionIcon} align="center"><SMSMobileIcon /></Flex>
        <Flex className={styles.actionText} align="center">SMS</Flex>
      </Flex>
      <Modal
        open={show}
        onCancel={() => { setShow(false); }}
        title="Send SMS"
        footer={[
          <Button
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
            onClick={() => { form.submit(); }}
            loading={loading}
          >
            Send
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onSubmit}>
          <Form.Item
            noStyle
            name="textMessage"
          >
            <TextAreaField />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SendSms;
