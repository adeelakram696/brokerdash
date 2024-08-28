/* eslint-disable */
import {
  Button, Flex, Form, List, Modal,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import InputField from 'app/components/Forms/InputField';
import { fieldmapping } from 'utils/validateSubmission';
import { env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import styles from './SubmissionForm.module.scss';
import { updateClientInformation } from 'app/apis/mutation';

export function SubmissionErrors({ show, errors, handleClose }) {
  const {
    details, getData,
  } = useContext(LeadContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    const payload = Object.entries(values).reduce((prev, [key, value]) => {
      const fieldData = fieldmapping[key];
      let id = '';
      if (fieldData.board === env.boards.clientAccounts) id = details.clientAccount.id;
      if (fieldData.board === env.boards.clients) id = details.client.id;
      if (fieldData.type === 'partner') id = details.partner.id;
      if (prev[id]) {
        prev[id] = {
          board: fieldData.board,
          [fieldData.columnId]: value,
          ...prev[id],
        };
      } else {
        prev[id] = {
          board: fieldData.board,
          [fieldData.columnId]: value,
        };
      }
      return prev;
    }, {});

    await Promise.all(Object.entries(payload).map(([key, { board, ...columns }]) => {
      updateClientInformation(key, board, columns)
    }));
    await getData();
    handleClose();
    setLoading(false);
  };
  useEffect(() => {
    const combinedErrors = errors.flatMap((errorObj) => errorObj.errors);
    const values = combinedErrors.reduce((prev, curr) => {
      const obj = prev;
      obj[curr.path] = curr.value;
      return obj;
    }, {});
    form.setFieldsValue(values);
  }, []);
  return (
    <Modal
      open={show}
      title="Submission Requirements"
      onCancel={handleClose}
      closeIcon={<CloseCircleFilled />}
      footer={(
        <Flex justify="flex-end">
          <Button loading={loading} onClick={() => { form.submit(); }} className={styles.footerSubmitCTA} type="primary" shape="round">
            Apply Changes
          </Button>
        </Flex>
)}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
      >
        {errors.map((error) => (
          <List
            className={styles.errorList}
            header={<Flex className={styles.errorFunderName}>{error.funder}</Flex>}
            bordered
            dataSource={error.errors}
            renderItem={(item) => (
              <List.Item>
                <Flex vertical>
                  {fieldmapping[item.path] ? <Flex>
                    <Form.Item
                      noStyle
                      name={item.path}
                      rules={[{ required: true, message: 'Please input value' }]}
                    >
                      <InputField />
                    </Form.Item>
                  </Flex> : null}
                  <Flex vertical>
                    {item.messages.map((message) => (
                      <Flex>{message}</Flex>
                    ))}
                  </Flex>
                </Flex>
              </List.Item>
            )}
          />

        ))}
      </Form>
    </Modal>
  );
}
