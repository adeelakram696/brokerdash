import {
  Flex, Card, Divider, Form, Button,
} from 'antd';
import classNames from 'classnames';
import { DialCallIcon, PaperBoardIcon, SendEmailIcon } from 'app/images/icons';
import { useEffect, useState } from 'react';
import { columnIds } from 'utils/constants';
import InputField from 'app/components/Forms/InputField';
import { updateClientInformation } from 'app/apis/mutation';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import LeadIntakeModal from '../../LeadIntake';

function InformationCard({
  heading, details, board, leadId, updateInfo,
}) {
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const handleIntakeClick = () => {
    setIsIntakeModalOpen(true);
  };
  const handleClose = () => {
    setIsIntakeModalOpen(false);
  };
  const dialNumber = () => {
    const number = details[columnIds[board].phone];
    window.open(`tel:${number}`);
  };
  const emailUser = () => {
    const email = details[columnIds[board].email];
    window.open(`mailto:${email}`);
  };
  useEffect(() => {
    form.setFieldsValue({
      [columnIds[board].first_name]: details[columnIds[board].first_name],
      [columnIds[board].last_name]: details[columnIds[board].last_name],
      [columnIds[board].home_address]: details[columnIds[board].home_address],
      [columnIds[board].home_city]: details[columnIds[board].home_city],
      [columnIds[board].home_state]: details[columnIds[board].home_state],
      [columnIds[board].home_zip]: details[columnIds[board].home_zip],
      [columnIds[board].phone]: details[columnIds[board].phone],
      [columnIds[board].email]: details[columnIds[board].email],
      [columnIds[board].social_security]: details[columnIds[board].social_security],
      [columnIds[board].dob]: details[columnIds[board].dob],
      [columnIds[board].ownership]: details[columnIds[board].ownership],
    });
  }, [details]);

  const handleUpdate = async (values) => {
    const updatedJson = {
      ...values,
      [columnIds[board].email]: {
        email: values[columnIds[board].email],
        text: values[columnIds[board].email],
      },
    };
    setLoading(true);
    await updateClientInformation(leadId, details.board.id, updatedJson);
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
          <Flex
            className={classNames(styles.edit, styles.cursor)}
            onClick={() => { setIsEdit(true); }}
          >
            {isEdit ? (
              <Button className={styles.saveBtn} size="small" htmlType="submit">
                Update
              </Button>
            ) : 'Edit'}
          </Flex>
        </Flex>

        <Flex flex={1}>
          <Flex className={styles.information} flex={0.6}>
            <Flex flex={1}>
              <Flex vertical justify="space-evenly" className={styles.labelsContainer}>
                <Flex className={styles.label}>First Name</Flex>
                <Flex className={styles.label}>Last Name</Flex>
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
                    : details[columnIds[board].first_name] || '-'}
                </Flex>
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
                    : details[columnIds[board].last_name] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].home_address}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].home_address] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].home_city}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].home_city] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].home_state}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].home_state] || '-'}
                </Flex>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].home_zip}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].home_zip] || '-'}
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
                <Flex className={classNames(styles.label, styles.actionLabels)}>Phone</Flex>
                <Flex className={classNames(styles.label, styles.actionLabels)}>Email</Flex>
              </Flex>
              <Flex vertical justify="flex-start" className={styles.actionsValuesContainer}>
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
                      {details[columnIds[board].phone]}
                    </Flex>
                    <Flex align="center">
                      <Divider type="vertical" />
                    </Flex>
                    <Flex align="center" onClick={handleIntakeClick}>
                      <PaperBoardIcon />
                    </Flex>
                  </Flex>
                )}
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
                      {details[columnIds[board].email]}
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Flex>
            <Flex>
              <Flex vertical justify="space-evenly" className={styles.labelsContainer}>
                <Flex className={styles.label}>Social Security</Flex>
                <Flex className={styles.label}>Date of Birth</Flex>
                <Flex className={styles.label}>Ownership %</Flex>
              </Flex>
              <Flex vertical justify="space-evenly" className={styles.valuesContainer}>
                <Flex className={styles.value}>
                  {isEdit
                    ? (
                      <Form.Item
                        noStyle
                        name={columnIds[board].social_security}
                      >
                        <InputField />
                      </Form.Item>
                    )
                    : details[columnIds[board].social_security] || '-'}
                </Flex>
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
                    : details[columnIds[board].dob] || '-'}
                </Flex>
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
                    : details[columnIds[board].ownership] || '-'}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Form>
      <LeadIntakeModal show={isIntakeModalOpen} handleClose={handleClose} />
    </Card>
  );
}

export default InformationCard;
