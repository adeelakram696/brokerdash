import {
  Flex, Card, Divider, Form, Button,
} from 'antd';
import classNames from 'classnames';
import { columnIds } from 'utils/constants';
import { useEffect, useState } from 'react';
import { updateClientInformation } from 'app/apis/mutation';
import InputField from 'app/components/Forms/InputField';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function BusinessInformationCard({
  heading, details, board, leadId, updateInfo,
}) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const setFieldsValues = () => {
    form.setFieldsValue({
      name: details.name,
      [columnIds[board].business_street_address]: details[columnIds[board].business_street_address],
      [columnIds[board].business_city]: details[columnIds[board].business_city],
      [columnIds[board].business_state]: details[columnIds[board].business_state],
      [columnIds[board].business_zip]: details[columnIds[board].business_zip],
      [columnIds[board].dba]: details[columnIds[board].dba],
      [columnIds[board].entity_type]: details[columnIds[board].entity_type],
      [columnIds[board].tax_id_ein]: details[columnIds[board].tax_id_ein],
    });
  };

  useEffect(() => {
    if (!details.name) return;
    setFieldsValues();
  }, [details]);

  const handleUpdate = async (values) => {
    setLoading(true);
    await updateClientInformation(leadId, details.board.id, values);
    await updateInfo();
    setIsEdit(false);
    setLoading(false);
  };
  return (
    <Card
      loading={loading}
      className={classNames(
        parentStyles.cardContainer,
        styles.fullWidth,
        styles.informationCard,
      )}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
      >
        <Flex justify="space-between">
          <Flex className={styles.heading}>{heading}</Flex>
          {isEdit ? (
            <Flex>
              <Flex
                className={classNames(styles.edit, styles.cursor, styles.cancel)}
                onClick={() => {
                  setIsEdit(false);
                  setFieldsValues();
                }}
              >
                Cancel
              </Flex>
              <Button className={styles.saveBtn} size="small" htmlType="submit">
                Update
              </Button>
            </Flex>
          ) : (
            <Flex
              className={classNames(styles.edit, styles.cursor)}
              onClick={() => { setIsEdit(true); }}
            >
              Edit
            </Flex>
          )}
        </Flex>
        <Flex flex={1}>
          <Flex className={styles.information} flex={0.6}>
            <Flex flex={1}>
              <Flex vertical justify="space-evenly" className={styles.labelsContainer}>
                <Flex className={styles.label}>Business Name</Flex>
                <Flex className={styles.label}>Address</Flex>
                <Flex className={styles.label}>City</Flex>
                <Flex className={styles.label}>State</Flex>
                <Flex className={styles.label}>Zip</Flex>
              </Flex>
              <Flex vertical justify="space-evenly" className={styles.valuesContainer}>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name="name"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details.name}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].business_street_address}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].business_street_address] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].business_city}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].business_city] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].business_state}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].business_state] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].business_zip}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].business_zip] || '-'}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex align="flex-start">
            <Divider type="vertical" style={{ height: '13vh' }} />
          </Flex>
          <Flex className={styles.information} flex={0.4} vertical>
            <Flex>
              <Flex vertical justify="space-evenly" className={styles.labelsContainer}>
                <Flex className={styles.label}>DBA</Flex>
                <Flex className={styles.label}>Entity Type</Flex>
                <Flex className={styles.label}>Tax Id</Flex>
              </Flex>
              <Flex vertical justify="space-evenly" className={styles.valuesContainer}>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].dba}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].dba] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].entity_type}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].entity_type] || '-'}
                </Flex>
                <Flex className={styles.value} vertical>
                  <Flex>
                    {isEdit
                      ? (
                        <Form.Item
                          noStyle
                          name={columnIds[board].tax_id_ein}
                        >
                          <InputField />
                        </Form.Item>
                      )
                      : details[columnIds[board].tax_id_ein] || '-'}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Card>
  );
}

export default BusinessInformationCard;
