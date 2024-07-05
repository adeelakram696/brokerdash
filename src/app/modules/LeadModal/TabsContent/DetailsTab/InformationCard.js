/* eslint-disable react/jsx-no-useless-fragment */
import {
  Flex, Card, Divider, Form, Button,
} from 'antd';
import classNames from 'classnames';
import { DialCallIcon, PaperBoardIcon, SendEmailIcon } from 'app/images/icons';
import { useEffect, useState } from 'react';
import { boardNames, columnIds } from 'utils/constants';
import InputField from 'app/components/Forms/InputField';
import { updateClientInformation } from 'app/apis/mutation';
import { maskNumber } from 'utils/helpers';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import LeadIntakeModal from '../../LeadIntake';

function InformationCard({
  heading, details, board, leadId, updateInfo,
}) {
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showMasked, setShowMasked] = useState(false);
  const [form] = Form.useForm();
  const data = board === boardNames.clients ? details.client : details;
  const handleIntakeClick = () => {
    setIsIntakeModalOpen(true);
  };
  const handleClose = () => {
    setIsIntakeModalOpen(false);
  };
  const dialNumber = () => {
    const number = data[columnIds[board].phone];
    window.open(`tel:${number}`);
  };
  const emailUser = () => {
    const email = data[columnIds[board].email];
    window.open(`mailto:${email}`);
  };
  const setFieldsValues = () => {
    form.setFieldsValue({
      [columnIds[board].first_name]: data[columnIds[board].first_name],
      [columnIds[board].last_name]: data[columnIds[board].last_name],
      [columnIds[board].address]: data[columnIds[board].address],
      [columnIds[board].city]: data[columnIds[board].city],
      [columnIds[board].state]: data[columnIds[board].state],
      [columnIds[board].zip]: data[columnIds[board].zip],
      [columnIds[board].phone]: data[columnIds[board].phone],
      [columnIds[board].email]: data[columnIds[board].email],
      [columnIds[board].social_security]: data[columnIds[board].social_security],
      [columnIds[board].dob]: data[columnIds[board].dob],
      [columnIds[board].ownership]: data[columnIds[board].ownership],
    });
  };

  useEffect(() => {
    if (!data.name) return;
    setFieldsValues();
  }, [data]);

  const handleUpdate = async (values) => {
    const boardId = data.board.id;
    const itemId = data.id;
    const updatedJson = {
      ...values,
      [columnIds[board].email]: {
        email: values[columnIds[board].email],
        text: values[columnIds[board].email],
      },
    };
    setLoading(true);
    await updateClientInformation(itemId, boardId, updatedJson);
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
                        name={columnIds[board].first_name}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].first_name] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Last Name</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].last_name}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].last_name] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Address</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].address}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].address] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>City</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].city}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].city] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>State</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].state}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].state] || '-'}
                </Flex>
              </Flex>
              <Flex>
                <Flex className={styles.label}>Zip</Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].zip}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : data[columnIds[board].zip] || '-'}
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
                        name={columnIds[board].phone}
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
                          {data[columnIds[board].phone]}
                        </Flex>
                        <Flex align="center">
                          <Divider type="vertical" />
                        </Flex>
                        <Flex align="center" onClick={handleIntakeClick}>
                          <PaperBoardIcon />
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
                        name={columnIds[board].email}
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
                          {data[columnIds[board].email]}
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
                  <Flex className={styles.value} onClick={() => { setShowMasked(!showMasked); }}>
                    {isEdit
                      ? (
                        <Form.Item
                          noStyle
                          name={columnIds[board].social_security}
                        >
                          <InputField />
                        </Form.Item>
                      )
                      : maskNumber(data[columnIds[board].social_security], showMasked) || '-'}
                  </Flex>
                </Flex>
                <Flex>
                  <Flex className={styles.label}>Date of Birth</Flex>
                  <Flex className={styles.value}>
                    {isEdit
                      ? (
                        <Form.Item
                          noStyle
                          name={columnIds[board].dob}
                        >
                          <InputField />
                        </Form.Item>
                      )
                      : data[columnIds[board].dob] || '-'}
                  </Flex>
                </Flex>
                <Flex>
                  <Flex className={styles.label}>Ownership %</Flex>
                  <Flex className={styles.value}>
                    {isEdit
                      ? (
                        <Form.Item
                          noStyle
                          name={columnIds[board].ownership}
                        >
                          <InputField />
                        </Form.Item>
                      )
                      : data[columnIds[board].ownership] || '-'}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Form>
      <LeadIntakeModal
        show={isIntakeModalOpen}
        handleClose={handleClose}
        board={board}
        details={details}
        leadId={leadId}
        updateInfo={updateInfo}
      />
    </Card>
  );
}

export default InformationCard;
