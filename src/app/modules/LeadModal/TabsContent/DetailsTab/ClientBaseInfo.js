import {
  Flex, Card, Form, Button,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { boardNames, columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import { useEffect, useState } from 'react';
import InputField from 'app/components/Forms/InputField';
import SelectField from 'app/components/Forms/SelectField';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import {
  existingDepts, importantToYou, loanPurpose, monthlyRevenue,
} from '../../LeadIntake/data';
import { businessTypes, listOfStates } from '../../QualificationMatrixForm/matrixData';

function ClientBaseInfo({
  details, board, leadId, updateInfo,
}) {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const isDeal = board === boardNames.deals;

  const setFieldsValues = () => {
    const valueData = {
      [columnIds[board].monthly_revenue]:
        details[columnIds[board].monthly_revenue],
      [columnIds[board].money_due_in]: details[columnIds[board].money_due_in],
      [columnIds[board].needs_money_for]: details[columnIds[board].needs_money_for],
      [columnIds[board].existing_debt]: details[columnIds[board].existing_debt],
      [columnIds[board].most_important]: details[columnIds[board].most_important],
    };
    if (board === boardNames.leads) {
      valueData[columnIds[board].credit_score] = details[columnIds[board].credit_score];
      valueData[columnIds[board].industry] = details[columnIds[board].industry];
      valueData[columnIds[board].state_incorporated] = details[columnIds[board].state_incorporated];
      valueData[columnIds[board].requested_amount] = details[columnIds[board].requested_amount];
      valueData[columnIds[board].business_start_date] = details[columnIds[board]
        .business_start_date];
    }
    if (isDeal) {
      valueData[columnIds.clients.credit_score] = details.client[columnIds.clients.credit_score];
      valueData[columnIds.clientAccount
        .industry] = details.clientAccount[columnIds.clientAccount.industry];
      valueData[columnIds.clientAccount
        .state_incorporated] = details.clientAccount[columnIds
        .clientAccount.state_incorporated];
      valueData[columnIds.clientAccount
        .business_start_date] = details.clientAccount[columnIds.clientAccount
        .business_start_date];
    }
    form.setFieldsValue(valueData);
  };
  useEffect(() => {
    if (!details.name) return;
    setFieldsValues();
  }, [details]);
  const handleUpdate = async (values) => {
    setLoading(true);
    const clientPayload = {};
    const accountsPayload = {};
    const payload = {
      [columnIds[board].monthly_revenue]:
        values[columnIds[board].monthly_revenue],
      [columnIds[board].money_due_in]: values[columnIds[board].money_due_in],
      [columnIds[board].needs_money_for]: values[columnIds[board].needs_money_for],
      [columnIds[board].existing_debt]: values[columnIds[board].existing_debt],
      [columnIds[board].most_important]: values[columnIds[board].most_important],
      [columnIds[board].requested_amount]: values[columnIds[board].requested_amount],
    };
    if (board === boardNames.leads) {
      payload[columnIds[board].credit_score] = values[columnIds[board].credit_score];
      payload[columnIds[board].industry] = values[columnIds[board].industry];
      payload[columnIds[board].state_incorporated] = values[columnIds[board].state_incorporated];
      payload[columnIds[board].business_start_date] = values[columnIds[board].business_start_date];
    }
    if (isDeal) {
      clientPayload[columnIds.clients.credit_score] = values[columnIds.clients.credit_score];
      accountsPayload[columnIds.clientAccount.industry] = values[columnIds.clientAccount.industry];
      accountsPayload[columnIds.clientAccount
        .state_incorporated] = values[columnIds.clientAccount
        .state_incorporated];
      accountsPayload[
        columnIds.clientAccount.business_start_date] = values[columnIds[board].business_start_date];
    }
    await updateClientInformation(
      leadId,
      details.board.id,
      payload,
    );
    if (isDeal) {
      if (details.client.board) {
        await updateClientInformation(
          details.client.id,
          details.client.board.id,
          clientPayload,
        );
      }
      if (details.clientAccount.board) {
        await updateClientInformation(
          details.clientAccount.id,
          details.clientAccount.board.id,
          accountsPayload,
        );
      }
    }
    await updateInfo();
    setIsEdit(false);
    setLoading(false);
  };
  const estDate = (isDeal ? (details.clientAccount[columnIds.clientAccount
    .business_start_date] || null) : (details[columnIds[board]
    .business_start_date] || null));
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
          <Flex vertical justify="space-evenly" flex={1}>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Monthly Rev:</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].monthly_revenue}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SelectField options={monthlyRevenue} />
                    </Form.Item>
                  )
                  : details[columnIds[board].monthly_revenue] || '-'}
              </Flex>
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Credit Score:</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[isDeal
                        ? boardNames.clients : board].credit_score}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : (isDeal ? details.client[columnIds.clients.credit_score]
                    : details[columnIds[board].credit_score]) || '-'}
              </Flex>
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Requested Amt:</Flex>
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
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Money Due In:</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].money_due_in}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : details[columnIds[board].money_due_in] || '-'}
              </Flex>
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Most Important:</Flex>
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
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Need Money For:</Flex>
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
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Existing Debt:</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[board].existing_debt}
                    >
                      <SelectField options={existingDepts} />
                    </Form.Item>
                  )
                  : details[columnIds[board].existing_debt] || '-'}
              </Flex>
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Industry In:</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[isDeal
                        ? boardNames.clientAccount : board].industry}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SelectField options={businessTypes.map(
                        (v) => ({ value: v.businessType, label: v.businessType }),
                      )}
                      />
                    </Form.Item>
                  )
                  : (isDeal ? details.clientAccount[columnIds.clientAccount.industry] : details[columnIds[board].industry]) || '-'}
              </Flex>
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>State of Corp</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[isDeal
                        ? boardNames.clientAccount : board].state_incorporated}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SelectField options={listOfStates.map(
                        (v) => ({ value: v, label: v }),
                      )}
                      />
                    </Form.Item>
                  )
                  : (isDeal ? details.clientAccount[columnIds.clientAccount.state_incorporated] : details[columnIds[board].state_incorporated]) || '-'}
              </Flex>
            </Flex>
            <Flex className={styles.dataRow}>
              <Flex className={styles.label}>Est. Date:</Flex>
              <Flex className={styles.value}>
                {isEdit
                  ? (
                    <Form.Item
                      noStyle
                      name={columnIds[isDeal
                        ? boardNames.clientAccount : board].business_start_date}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputField />
                    </Form.Item>
                  )
                  : estDate}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Card>
  );
}

export default ClientBaseInfo;
