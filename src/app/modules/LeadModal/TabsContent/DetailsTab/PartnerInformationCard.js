/* eslint-disable react/jsx-no-useless-fragment */
import {
  Flex, Card, Divider, Form, Button,
} from 'antd';
import classNames from 'classnames';
import { DialCallIcon, SendEmailIcon } from 'app/images/icons';
import { useEffect, useState } from 'react';
import { boardNames, columnIds, env } from 'utils/constants';
import InputField from 'app/components/Forms/InputField';
import { createClientInformation, updateClientInformation } from 'app/apis/mutation';
import { fetchUser } from 'app/apis/query';
import { maskNumber } from 'utils/helpers';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';

function PartnerInformationCard({
  heading, details, board, updateInfo, partnerAddPostFunc, leadId,
}) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const user = fetchUser();
  const [form] = Form.useForm();
  const data = board === boardNames.clients ? details.partner : details;
  const dialNumber = () => {
    const number = data[columnIds[board].phone];
    window.open(`tel:${number}`);
  };
  const emailUser = () => {
    const email = data[columnIds[board].email];
    window.open(`mailto:${email}`);
  };
  const getFieldName = (name) => {
    if (board === boardNames.clients) return name;
    return `partner_${name}`;
  };
  const setFieldsValues = () => {
    form.setFieldsValue({
      [columnIds[board][getFieldName('first_name')]]: data[columnIds[board][getFieldName('first_name')]],
      [columnIds[board][getFieldName('last_name')]]: data[columnIds[board][getFieldName('last_name')]],
      [columnIds[board][getFieldName('address')]]: data[columnIds[board][getFieldName('address')]],
      [columnIds[board][getFieldName('city')]]: data[columnIds[board][getFieldName('city')]],
      [columnIds[board][getFieldName('state')]]: data[columnIds[board][getFieldName('state')]],
      [columnIds[board][getFieldName('zip')]]: data[columnIds[board][getFieldName('zip')]],
      [columnIds[board][getFieldName('phone')]]: data[columnIds[board][getFieldName('phone')]],
      [columnIds[board][getFieldName('email')]]: data[columnIds[board][getFieldName('email')]],
      [columnIds[board][getFieldName('social_security')]]: data[columnIds[board][getFieldName('social_security')]],
      [columnIds[board][getFieldName('dob')]]: data[columnIds[board][getFieldName('dob')]],
      [columnIds[board][getFieldName('ownership')]]: data[columnIds[board][getFieldName('ownership')]],
    });
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
      [columnIds[board][getFieldName('email')]]: {
        email: values[columnIds[board][getFieldName('email')]],
        text: values[columnIds[board][getFieldName('email')]],
      },
    };
    setLoading(true);
    if (itemId) {
      await updateClientInformation(itemId, boardId, updatedJson);
    } else {
      updatedJson[columnIds.clients.deals] = { item_ids: [leadId] };
      updatedJson[columnIds.clients.company] = details.name;
      const partnerName = `${values[columnIds[board][getFieldName('first_name')]]} ${values[columnIds[board][getFieldName('last_name')]]}`;
      const resp = await createClientInformation(partnerName, env.boards.clients, updatedJson);
      await partnerAddPostFunc(resp.data?.create_item?.id);
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
                <Flex className={styles.label}>First Name</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('first_name')]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board][getFieldName('first_name')]]}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Last Name</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('last_name')]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board][getFieldName('last_name')]]}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Address</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('address')]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board][getFieldName('address')]] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>City</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('city')]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board][getFieldName('city')]] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>State</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('state')]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board][getFieldName('state')]] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Zip</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('zip')]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board][getFieldName('zip')]] || '-'}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex align="flex-start">
            <Divider type="vertical" style={{ height: '13vh' }} />
          </Flex>
          <Flex className={styles.information} flex={0.4} vertical>
            <Flex>
              <Flex vertical justify="flex-start" className={styles.actionsLabelContainer}>
                <Flex>
                  <Flex className={classNames(styles.label, styles.actionLabels)}>Phone</Flex>
                  <Flex>
                    {isEdit ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('phone')]}
                      >
                        <InputField />
                      </Form.Item>
                    ) : (
                      <Flex
                        className={classNames(styles.value, styles.actionItems, styles.cursor)}
                        style={{ top: 45 }}
                      >
                        <Flex align="center" className={styles.actionItemIcon} onClick={dialNumber}>
                          <DialCallIcon />
                        </Flex>
                        <Flex align="center" onClick={dialNumber}>
                          {data[columnIds[board][getFieldName('phone')]]}
                        </Flex>
                        <Flex align="center">
                          <Divider type="vertical" />
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
                <Flex>
                  <Flex className={classNames(styles.label, styles.actionLabels)}>Email</Flex>
                  <Flex>
                    {isEdit ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board][getFieldName('email')]}
                      >
                        <InputField />
                      </Form.Item>
                    ) : (
                      <Flex
                        className={classNames(styles.value, styles.actionItems, styles.cursor)}
                        style={{ top: 82 }}
                        flex={1}
                      >
                        <Flex align="center" className={styles.actionItemIcon} onClick={emailUser}>
                          <SendEmailIcon />
                        </Flex>
                        <Flex align="center" onClick={emailUser}>
                          {data[columnIds[board][getFieldName('email')]]}
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex>
              <Flex vertical flex={1}>
                <Flex>
                  <Flex className={styles.label}>Social Security</Flex>
                  <Flex className={styles.value}>
                    {user.is_admin
                      ? (
                        <>
                          {isEdit
                            ? (
                              <Form.Item
                                noStyle
                                name={columnIds[board][getFieldName('social_security')]}
                              >
                                <InputField />
                              </Form.Item>
                            )
                            : data[columnIds[board][getFieldName('social_security')]] || '-'}
                        </>
                      ) : maskNumber(data[columnIds[board][getFieldName('social_security')]]) || '-'}
                  </Flex>
                </Flex>
                <Flex>
                  <Flex className={styles.label}>Date of Birth</Flex>
                  <Flex className={styles.value}>
                    {isEdit
                      ? (
                        <Form.Item
                          noStyle
                          name={columnIds[board][getFieldName('dob')]}
                        >
                          <InputField />
                        </Form.Item>
                      )
                      : data[columnIds[board][getFieldName('dob')]] || '-'}
                  </Flex>
                </Flex>
                <Flex>
                  <Flex className={styles.label}>Ownership %</Flex>
                  <Flex className={styles.value}>
                    {isEdit
                      ? (
                        <Form.Item
                          noStyle
                          name={columnIds[board][getFieldName('ownership')]}
                        >
                          <InputField />
                        </Form.Item>
                      )
                      : data[columnIds[board][getFieldName('ownership')]] || '-'}
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

export default PartnerInformationCard;
