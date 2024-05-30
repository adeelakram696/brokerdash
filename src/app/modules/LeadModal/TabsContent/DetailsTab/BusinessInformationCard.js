import {
  Flex, Card, Divider, Form, Button,
} from 'antd';
import classNames from 'classnames';
import { boardNames, columnIds, env } from 'utils/constants';
import { useEffect, useState } from 'react';
import { createClientInformation, updateClientInformation } from 'app/apis/mutation';
import InputField from 'app/components/Forms/InputField';
import SelectField from 'app/components/Forms/SelectField';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import { entityTypes } from './data';

function BusinessInformationCard({
  heading, details, board, updateInfo, businessAddPostFunc, leadId,
}) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const isClient = board === boardNames.clientAccount;
  const data = isClient ? details.clientAccount : details;
  const setFieldsValues = () => {
    const fields = {
      [columnIds[board].business_street_address]: data[columnIds[board].business_street_address],
      [columnIds[board].business_city]: data[columnIds[board].business_city],
      [columnIds[board].business_state]: data[columnIds[board].business_state],
      [columnIds[board].business_zip]: data[columnIds[board].business_zip],
      [columnIds[board].dba]: data[columnIds[board].dba],
      [columnIds[board].entity_type]: data[columnIds[board].entity_type],
      [columnIds[board].tax_id_ein]: data[columnIds[board].tax_id_ein],
    };
    if (isClient) {
      fields.name = data.name;
    } else {
      fields[columnIds[board].company_name] = data[columnIds[board].company_name];
    }
    form.setFieldsValue(fields);
  };

  useEffect(() => {
    if (!data.name) return;
    setFieldsValues();
  }, [data]);

  const handleUpdate = async (values) => {
    const boardId = data?.board?.id;
    const itemId = data.id;
    const updatedJson = {
      ...values,
    };
    setLoading(true);
    if (itemId) {
      await updateClientInformation(itemId, boardId, updatedJson);
    } else {
      updatedJson[columnIds.clientAccount.deals] = { item_ids: [leadId] };
      const BusinessName = values.name;
      const resp = await createClientInformation(
        BusinessName,
        env.boards.clientAccounts,
        updatedJson,
      );
      await businessAddPostFunc(resp.data?.create_item?.id);
    }
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
            <Flex vertical flex={1}>
              <Flex>
                <Flex className={styles.label}>Business Name</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={isClient ? 'name' : columnIds[board].company_name}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : (isClient ? data.name : data[columnIds[board].company_name]) || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Address</Flex>
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
                    : data[columnIds[board].business_street_address] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>City</Flex>
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
                    : data[columnIds[board].business_city] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>State</Flex>
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
                    : data[columnIds[board].business_state] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Zip</Flex>
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
                    : data[columnIds[board].business_zip] || '-'}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex align="flex-start">
            <Divider type="vertical" style={{ height: '13vh' }} />
          </Flex>
          <Flex className={styles.information} flex={0.4} vertical>
            <Flex vertical flex={1}>
              <Flex>
                <Flex className={styles.label}>DBA</Flex>
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
                    : data[columnIds[board].dba] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Entity Type</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].entity_type}
                      >
                        <SelectField options={entityTypes} />
                      </Form.Item>
                    )
                    : data[columnIds[board].entity_type] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Tax Id</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].tax_id_ein}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].tax_id_ein] || '-'}
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
