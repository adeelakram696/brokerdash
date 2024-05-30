import {
  Modal, Button, Form,
} from 'antd';
import TextAreaField from 'app/components/Forms/TextAreaField';
import { useState } from 'react';
import SelectField from 'app/components/Forms/SelectField';
import styles from './ActionsRow.module.scss';

export const templates = [
  { value: 'Request Documents', label: 'Request Documents' },
  { value: 'Send App', label: 'Send App' },
  { value: 'Tried to reach', label: 'Tried to reach' },
];

function EmailTemplate({ show, onClose }) {
  // const {
  //   leadId, board, boardId,
  // } = useContext(LeadContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onSubmit = async () => {
    setLoading(true);
    setLoading(false);
    onClose();
  };
  return (
    <Modal
      open={show}
      onCancel={onClose}
      title="Send Email"
      footer={[
        <Button
          className={styles.footerSubmitCTA}
          type="primary"
          shape="round"
          onClick={() => { form.submit(); }}
          loading={loading}
        >
          Send Email
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="template"
          label="Template"
        >
          <SelectField options={templates} />
        </Form.Item>
        <Form.Item
          name="textMessage"
          label="Body"
        >
          <TextAreaField autoSize={{ minRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EmailTemplate;
