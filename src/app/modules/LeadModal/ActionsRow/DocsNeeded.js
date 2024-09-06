import {
  Flex, Dropdown, Modal, Spin,
  Button,
  Form,
} from 'antd';
import { boardNames, columnIds, env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { useContext, useEffect, useState } from 'react';
import { FileOutlined } from '@ant-design/icons';
import { updateClientInformation, updateStage } from 'app/apis/mutation';
import { fetchBoardDropDownColumnStrings } from 'app/apis/query';
import TextAreaField from 'app/components/Forms/TextAreaField';
import styles from './ActionsRow.module.scss';

function DocsNeeded() {
  const {
    details, leadId, getData, board,
  } = useContext(LeadContext);
  const [form] = Form.useForm();
  const [selectedDoc, setSelectedDoc] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [docsList, setDocsList] = useState([]);
  const [showLoading, setLoading] = useState(false);
  const hideModal = () => {
    setSelectedDoc('');
  };
  const getDocsList = async () => {
    const res = await fetchBoardDropDownColumnStrings(
      env.boards[board],
      columnIds[board].docs_needed,
    );
    setDocsList(res);
  };
  useEffect(() => {
    getDocsList();
  }, []);
  const handleDocsNeededSelected = async (values) => {
    setLoading(true);
    const dataJson = {
      [isCustom ? columnIds[board].custom_docs : columnIds[board].docs_needed]: isCustom
        ? values.customText : selectedDoc,
    };
    await updateClientInformation(leadId, details.board.id, dataJson);
    const groupId = board === boardNames.leads ? 'new_group7612' : 'new_group1842__1';
    let payload;
    if (details.group.id === groupId) {
      if (details[columnIds[board].sequence_additional_docs_needed] === 'Step 1: Immediate') {
        payload = {
          [[columnIds[board].sequence_additional_docs_needed]]: '',
        };
        await updateClientInformation(leadId, details.board.id, payload);
      }
      payload = {
        [[columnIds[board].sequence_additional_docs_needed]]: 'Step 1: Immediate',
      };
      await updateClientInformation(leadId, details.board.id, payload);
    } else {
      await updateStage(leadId, groupId);
    }
    setIsCustom(false);
    setLoading(false);
    hideModal();
    getData();
  };
  const handleReasonSelect = ({ key }) => {
    if (key === 'custom') {
      setIsCustom(true);
      return;
    }
    setSelectedDoc(key);
  };
  const items = [...docsList.map((r) => (
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
          <Flex className={styles.actionIcon} align="center"><FileOutlined style={{ color: '#457989' }} /></Flex>
          <Flex className={styles.actionText} align="center">Doc(s) Needed</Flex>
        </Flex>
      </Dropdown>
      <Modal
        title="Confirmation"
        open={selectedDoc}
        onOk={handleDocsNeededSelected}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Spin spinning={showLoading} fullscreen />
        <p>
          Are you sure you want to request
          {' '}
          {selectedDoc}
          ?
        </p>
      </Modal>
      <Modal
        open={isCustom}
        onCancel={() => { setIsCustom(false); }}
        title="Custom Docs Request"
        footer={[
          <Button
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
            onClick={() => { form.submit(); }}
            loading={showLoading}
          >
            Request
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleDocsNeededSelected}>
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

export default DocsNeeded;
