import {
  Modal, Flex, Button, Divider, Form,
  DatePicker,
  Checkbox,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import EditableTable from 'app/components/EditableTable';
import { useContext, useEffect, useState } from 'react';
import { LeadContext } from 'utils/contexts';
import _ from 'lodash';
import { boardNames, columnIds } from 'utils/constants';
import { updateSimpleColumnValue } from 'app/apis/mutation';
import {
  convertToNumber, extractLeastNumber, numberWithCommas, verifyDateFormat,
} from 'utils/helpers';
import SelectField from 'app/components/Forms/SelectField';
import InputField from 'app/components/Forms/InputField';
import classNames from 'classnames';
import { decodeJson, encodeJson } from 'utils/encrypt';
import styles from './QualificationMatrixForm.module.scss';
import {
  activePositionsColumns, bankActivityColumns, sampleRow, sampleRowFunders,
} from './data';
import { fundersIntakeCalc } from './matrixData';

function QualificationMatrixForm({ show, handleClose }) {
  const [form] = Form.useForm();
  const {
    details, leadId, boardId, board, getData, funders,
  } = useContext(LeadContext);
  const [matrixValues, setMatrixValues] = useState({});
  const [loading, setLoading] = useState(false);
  const isDeal = board === boardNames.deals;

  const getColumnSum = (columnKey, rows, data) => rows.reduce((prev, current) => prev + convertToNumber(data[`${columnKey}-${current.id}`] || 0), 0);

  const getLastMonthVal = (columnKey, rows, data) => rows.reduce((prev, current) => {
    const val = convertToNumber(data[`${columnKey}-${current.id}`]);
    return val || prev;
  }, 0);

  const getColumnMin = (columnKey, rows, data) => rows.reduce((prev, current) => {
    if (prev === 0 || prev > convertToNumber(data[`${columnKey}-${current.id}`])) return convertToNumber(data[`${columnKey}-${current.id}`]);
    return prev;
  }, 0);

  const handleUpdate = async (value, values) => {
    const monthsCount = sampleRow.reduce((prev, current) => {
      if (!values[`monthId-${current.id}`]) return prev;
      return prev + 1;
    }, 0);
    const totalCredits = getColumnSum('totalCredit', sampleRow, values);
    const monthCashFlow = Math.round(totalCredits / monthsCount);
    const isPastSetttled = values.past_settled_defaults === 'yes';
    const funderInPast = values.funded_in_the_past_30_days;
    const acceptOnlineBank = values.has_online_bank;
    const prevPaymentHistory = values.previous_payment_history;
    const totalBankActivityCounts = bankActivityColumns.reduce((prev, current) => {
      if (!current.totalCount) return prev;
      const val = { [current.key]: _.sumBy(sampleRow, (r) => (values[`${current.key}-${r.id}`] ? convertToNumber(values[`${current.key}-${r.id}`]) : 0)) };
      return { ...prev, ...val };
    }, {});
    const totalActivePositionsCounts = activePositionsColumns.reduce((prev, current) => {
      if (!current.totalCount) return prev;
      const val = {
        [current.key]: _.sumBy(sampleRowFunders, (r) => {
          if (current.renderKey) {
            return current.renderCount(convertToNumber(values[`${current.renderKey}-${r.id}`]) || 0);
          }
          return values[`${current.key}-${r.id}`] ? convertToNumber(values[`${current.key}-${r.id}`]) : 0;
        }),
      };
      return { ...prev, ...val };
    }, {});
    const monthlyTotal = totalActivePositionsCounts.daily * 21;
    const startingBal2 = convertToNumber(values['startingBal-1']) + convertToNumber(values['totalCredit-1']) + convertToNumber(values['totalDebit-1']);
    const startingBal3 = startingBal2 + convertToNumber(values['totalCredit-2']) + convertToNumber(values['totalDebit-2']);
    const weeklyAmountPositions = [1, 2, 3, 4, 5].reduce((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[`weekly-${curr}`] = values[`daily-${curr}`] ? convertToNumber(values[`daily-${curr}`]) * 5 : 0;
      return prev;
    }, {});
    const monthlyAmountPositions = [1, 2, 3, 4, 5].reduce((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[`monthly-${curr}`] = values[`daily-${curr}`] ? convertToNumber(values[`daily-${curr}`]) * 21 : 0;
      return prev;
    }, {});
    const matrixData = {
      ...values,
      totalBankActivityCounts,
      totalActivePositionsCounts,
      monthCashFlow,
      monthlyTotal: monthlyTotal.toFixed(2),
      existingMonthlyDebt: -1 * monthlyTotal.toFixed(2),
      remainingCashFlow: monthCashFlow + (-monthlyTotal),
      annualRevenue: monthCashFlow * 12,
      annualDebtToIncome: (monthlyTotal / monthCashFlow).toFixed(4),
      'startingBal-2': convertToNumber(startingBal2).toFixed(2),
      'startingBal-3': convertToNumber(startingBal3).toFixed(2),
      ...weeklyAmountPositions,
      ...monthlyAmountPositions,
    };
    matrixData.minMonthlyDepositCount = getColumnMin('depCnt', sampleRow, matrixData);
    matrixData.nSFLast30Days = getLastMonthVal('nsf', sampleRow, matrixData);
    matrixData.nSFLast90Days = getColumnSum('nsf', sampleRow, matrixData);
    matrixData.negativeDaysLast30 = getLastMonthVal('days', sampleRow, matrixData);
    matrixData.negativeDaysLast90 = getColumnSum('days', sampleRow, matrixData);
    matrixData.numberOfPositions = sampleRowFunders.filter((i) => values[`funderId-${i.id}`]).length;
    const industry = isDeal
      ? details.clientAccount[columnIds.clientAccount.industry]
      : details[columnIds[board].industry];
    const state = isDeal
      ? details.clientAccount[columnIds
        .clientAccount.state_incorporated]
      : details[columnIds[board].state_incorporated];
    const creditScore = isDeal
      ? details.client[columnIds.clients.credit_score]
      : details[columnIds[board].credit_score];
    const timeInBusiness = dayjs().diff(values.business_start_date, 'month');
    const ficoScore = extractLeastNumber(creditScore);
    const fundersData = fundersIntakeCalc({
      ficoScore,
      creditScore, // Pass original credit score value as well
      industry,
      state,
      timeInBusiness,
      ...matrixData,
      isPastSetttled,
      acceptOnlineBank,
      funderInPast,
      prevPaymentHistory,
    }, funders);
    const sortedData = _.sortBy(fundersData.qualified, ['tier'], ['asc']);
    matrixData.fundersPriority = sortedData.slice(0, 7).map((i) => i.funder);
    setMatrixValues(matrixData);
  };
  const setDefaultValues = (qmValues) => {
    if (!details.name) return;
    const estDate = isDeal ? details.clientAccount[columnIds.clientAccount
      .business_start_date] : details[columnIds[board]
      .business_start_date];
    const estDateFormat = verifyDateFormat(estDate);
    const qmDataEncoded = details[columnIds[board].qualification_matrix_data];
    let combined = {};
    if (qmDataEncoded || qmValues) {
      const data = qmValues || decodeJson(qmDataEncoded);
      // eslint-disable-next-line no-nested-ternary
      const estDateValue = estDateFormat
        ? dayjs(estDate, estDateFormat)
        : (data.matrixValues.business_start_date ? dayjs(data.matrixValues.business_start_date) : '');
      combined = {
        ...data.matrixValues,
        business_start_date: estDateValue,
      };
    } else {
      const bankActivity = JSON.parse(details[columnIds[board].qm_bank_activity] || '{}');
      const activePosition = JSON.parse(details[columnIds[board].qm_active_position] || '{}');
      const suggestedFunders = JSON.parse(details[columnIds[board].qm_suggested_funders] || '[]');
      // eslint-disable-next-line no-nested-ternary
      const estDateValue = estDateFormat
        ? dayjs(estDate, estDateFormat)
        : (bankActivity.business_start_date ? dayjs(bankActivity.business_start_date) : '');
      combined = {
        ...bankActivity,
        ...activePosition,
        fundersPriority: suggestedFunders,
        business_start_date: estDateValue,
      };
    }
    form.resetFields();
    handleUpdate({}, combined);
    form.setFieldsValue(combined);
  };
  const onClose = (data = null) => {
    setDefaultValues(data);
    handleClose();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const encoded = encodeJson({ matrixValues });
    await updateSimpleColumnValue(
      leadId,
      boardId,
      JSON.stringify(encoded).replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
      columnIds[board].qualification_matrix_data,
    );
    await getData();
    setLoading(false);
    onClose({ matrixValues });
  };
  useEffect(() => {
    setDefaultValues();
  }, [details.name]);

  const businessTimeMonth = matrixValues.business_start_date ? dayjs().diff(matrixValues.business_start_date, 'month') : 0;
  const businessTimeYear = matrixValues.business_start_date ? dayjs().diff(matrixValues.business_start_date, 'year') : 0;
  const getLastModified = () => {
    const entry = (
      (details || {}
      ).column_values || [])
      .find((c) => c.id === columnIds[board].qm_bank_activity);
    const lastModified = JSON.parse(entry?.value || '{}')?.changed_at || '';
    return lastModified ? dayjs(lastModified).format('MM/DD/YY @ hh:mm A') : '-';
  };
  const industry = isDeal
    ? details.clientAccount[columnIds.clientAccount.industry]
    : details[columnIds[board].industry];
  const state = isDeal
    ? details.clientAccount[columnIds
      .clientAccount.state_incorporated]
    : details[columnIds[board].state_incorporated];
  const creditScore = isDeal
    ? details.client[columnIds.clients.credit_score]
    : details[columnIds[board].credit_score];
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          <Button loading={loading} onClick={handleSubmit} className={styles.footerSubmitCTA} type="primary" shape="round">
            Apply Changes
          </Button>
        </Flex>
)}
      onCancel={() => { onClose(); }}
      className="qualificationMatrix"
      style={{ top: 20 }}
      width="664px"
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24, color: '#000' }}>Qualification Matrix</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400', color: '#000' }}>
            Modified Last:
            {getLastModified()}
          </Flex>
        </Flex>
)}
    >
      <Form
        form={form}
        onValuesChange={handleUpdate}
        defaultValue={{
        }}
      >
        <Flex vertical style={{ marginTop: 20 }}>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex
              flex={0.4}
              className={classNames(
                styles.label,
                { [styles.required]: !details.name },
              )}
            >
              Business Name
            </Flex>
            <Flex flex={0.6} className={styles.value}>
              {details.name}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex
              flex={0.4}
              className={classNames(
                styles.label,
                { [styles.required]: !industry },
              )}
            >
              Type of Business
            </Flex>
            <Flex flex={0.6} className={styles.value}>
              {industry}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex
              flex={0.4}
              className={classNames(
                styles.label,
                { [styles.required]: !state },
              )}
            >
              State Of Business
            </Flex>
            <Flex flex={0.6} className={styles.value}>
              {state}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex
              flex={0.4}
              className={classNames(
                styles.label,
                { [styles.required]: !matrixValues.business_start_date },
              )}
            >
              Date Business Established
            </Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                name="business_start_date"
              >
                <DatePicker
                  format="MM/DD/YYYY"
                  status={!matrixValues.business_start_date ? 'error' : 'success'}
                />
              </Form.Item>
              {businessTimeMonth > 0 ? ` ${businessTimeMonth} month(s)` : ''}
              {' '}
              {businessTimeYear > 0 ? ` , ${businessTimeYear} year(s)` : ''}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex
              flex={0.4}
              className={classNames(
                styles.label,
                { [styles.required]: !extractLeastNumber(creditScore) },
              )}
            >
              Fico Score
            </Flex>
            <Flex flex={0.6} className={styles.value}>
              {extractLeastNumber(creditScore)}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Past Settled</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                name="past_settled_defaults"
              >
                <SelectField
                  defaultValue="no"
                  options={[
                    { value: 'no', label: 'NO' },
                    { value: 'yes', label: 'Yes' },
                  ]}
                />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Funded In The Past 30 Days</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                valuePropName="checked"
                name="funded_in_the_past_30_days"
              >
                <Checkbox />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Has Online Bank</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                valuePropName="checked"
                name="has_online_bank"
              >
                <Checkbox />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Has Previous Payment History</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                valuePropName="checked"
                name="previous_payment_history"
              >
                <Checkbox />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Bank activity</Flex>
          </Flex>
          <Flex>
            <EditableTable
              columns={bankActivityColumns}
              rows={sampleRow}
              data={matrixValues}
              totalCounts={matrixValues.totalBankActivityCounts}
            />
          </Flex>
          <Divider />
          <Flex flex={1} justify="center">
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.6} className={styles.smallLabel} align="center">Min Daily Balance</Flex>
                <Flex flex={0.4} className={styles.smallValue} style={{ marginRight: 10 }}>
                  <Form.Item
                    noStyle
                    name="min_daily_balnc"
                  >
                    <InputField />
                  </Form.Item>
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Min Monthly Deposit Count</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {convertToNumber(matrixValues.minMonthlyDepositCount)}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Number of Positions</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {matrixValues?.numberOfPositions}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>NSF (last 30)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {getLastMonthVal('nsf', sampleRow, matrixValues)}
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>NSF (last 90)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {getColumnSum('nsf', sampleRow, matrixValues)}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Negative Days (Last 30 Days)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {getLastMonthVal('days', sampleRow, matrixValues)}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Negative Days (Last 90 Days)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {getColumnSum('days', sampleRow, matrixValues)}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Active Positions</Flex>
          </Flex>
          <Flex>
            <EditableTable
              columns={activePositionsColumns}
              rows={sampleRowFunders}
              data={matrixValues}
              totalCounts={matrixValues.totalActivePositionsCounts}
            />
          </Flex>
          <Divider />
          <Flex flex={1} justify="center">
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Avg Monthly Cash Flow</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {numberWithCommas(convertToNumber(matrixValues.monthCashFlow))}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Existing Monthly Debt Service</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {numberWithCommas(convertToNumber(matrixValues.existingMonthlyDebt))}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Remaining Cash Flow</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {numberWithCommas(convertToNumber(matrixValues.remainingCashFlow))}
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Monthly Total</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {numberWithCommas(convertToNumber(matrixValues.monthlyTotal))}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Annual Revenue</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {numberWithCommas(convertToNumber(matrixValues.annualRevenue))}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Annual Debt to Income</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {convertToNumber(matrixValues.annualDebtToIncome)}
                  {' '}
                  %
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex
              className={styles.largeText}
              style={{ marginBottom: 10 }}
            >
              Suggested Funder to submit to (In order of priority)
            </Flex>
          </Flex>
          <Flex flex={1} wrap="wrap" justify="flex-start">
            {matrixValues?.fundersPriority?.length > 0
              ? (matrixValues.fundersPriority || []).map((funder) => (
                <Flex style={{ width: '45%', fontSize: '13px' }}>
                  -
                  {' '}
                  {funder}
                </Flex>
              )) : 'No Funders match'}
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
}
export default QualificationMatrixForm;
