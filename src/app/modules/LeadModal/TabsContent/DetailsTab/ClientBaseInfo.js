import {
  Flex, Card, Form, Button,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import { useEffect, useState } from 'react';
import InputField from 'app/components/Forms/InputField';
import SelectField from 'app/components/Forms/SelectField';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import { existingDepts, importantToYou, loanPurpose } from '../../LeadIntake/data';

function ClientBaseInfo({
  details, board, leadId, updateInfo,
}) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const setFieldsValues = () => {
    form.setFieldsValue({
      [columnIds[board].monthly_revenue_dropdown]:
        details[columnIds[board].monthly_revenue_dropdown],
      [columnIds[board].credit_score]: details[columnIds[board].credit_score],
      [columnIds[board].requested_amount]: details[columnIds[board].requested_amount],
      [columnIds[board].money_due_in]: details[columnIds[board].money_due_in],
      [columnIds[board].most_important]: details[columnIds[board].most_important],
      [columnIds[board].needs_money_for]: details[columnIds[board].needs_money_for],
      [columnIds[board].existing_debt]: details[columnIds[board].existing_debt],
      [columnIds[board].industry]: details[columnIds[board].industry],
      [columnIds[board].state_incorporated]: details[columnIds[board].state_incorporated],
      [columnIds[board].business_start_date]: details[columnIds[board].business_start_date],
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
          <Flex className={styles.heading}>{en.titles.clientInformation}</Flex>

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
        <Flex className={styles.information}>
          <Flex flex={1}>
            <Flex vertical justify="space-evenly" className={styles.labelsContainer}>
              <Flex className={styles.label}>Monthly Rev:</Flex>
              <Flex className={styles.label}>Credit Score:</Flex>
              <Flex className={styles.label}>Requested Amt:</Flex>
              <Flex className={styles.label}>Money Due In:</Flex>
              <Flex className={styles.label}>Most Important:</Flex>
              <Flex className={styles.label}>Need Money For:</Flex>
              <Flex className={styles.label}>Existing Debt:</Flex>
              <Flex className={styles.label}>Industry In:</Flex>
              <Flex className={styles.label}>State of Corp</Flex>
              <Flex className={styles.label}>Est. Date:</Flex>
            </Flex>
            <Flex vertical justify="space-evenly" className={styles.valuesContainer}>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].monthly_revenue_dropdown}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].monthly_revenue_dropdown] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].credit_score}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].credit_score] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].requested_amount}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].requested_amount] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].money_due_in}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].money_due_in] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].most_important}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SelectField options={importantToYou} />
                    </Form.Item>
                  )
                  : details[columnIds[board].most_important] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].needs_money_for}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SelectField options={loanPurpose} />
                    </Form.Item>
                  )
                  : details[columnIds[board].needs_money_for] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].existing_debt}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SelectField options={existingDepts} />
                    </Form.Item>
                  )
                  : details[columnIds[board].existing_debt] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].industry}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].industry] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].state_incorporated}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].state_incorporated] || '-'}
              </Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].business_start_date}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].business_start_date] || '-'}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Card>
  );
}

export default ClientBaseInfo;
