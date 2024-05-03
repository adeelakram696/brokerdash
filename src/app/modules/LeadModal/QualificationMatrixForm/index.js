import {
  Modal, Flex, Button, Divider, Form,
  DatePicker,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import EditableTable from 'app/components/EditableTable';
import { useContext, useState } from 'react';
import { LeadContext } from 'utils/contexts';
import SelectField from 'app/components/Forms/SelectField';
import InputField from 'app/components/Forms/InputField';
import _ from 'lodash';
import styles from './QualificationMatrixForm.module.scss';
import {
  activePositionsColumns, bankActivityColumns, sampleRow, sampleRowFunders,
} from './data';
import { businessTypes, fundersIntakeCalc, listOfStates } from './matrixData';

function QualificationMatrixForm({ show, handleClose }) {
  const [form] = Form.useForm();
  const {
    details,
  } = useContext(LeadContext);
  const [matrixValues, setMatrixValues] = useState({});

  const getColumnSum = (columnKey, rows, data) => rows.reduce((prev, current) => prev + Number(data[`${columnKey}-${current.id}`] || 0), 0);

  const getColumnMin = (columnKey, rows, data) => rows.reduce((prev, current) => {
    if (prev === 0 || prev > Number(data[`${columnKey}-${current.id}`])) return Number(data[`${columnKey}-${current.id}`]);
    return prev;
  }, 0);

  const handleUpdate = async (value, values) => {
    const monthsCount = sampleRow.reduce((prev, current) => {
      if (!values[`month-${current.id}`]) return prev;
      return prev + 1;
    }, 0);
    const totalCredits = getColumnSum('totalCredit', sampleRow, values);
    const monthCashFlow = Math.round(totalCredits / monthsCount);
    const totalBankActivityCounts = bankActivityColumns.reduce((prev, current) => {
      if (!current.totalCount) return prev;
      const val = { [current.key]: _.sumBy(sampleRow, (r) => (values[`${current.key}-${r.id}`] ? +values[`${current.key}-${r.id}`] : 0)) };
      return { ...prev, ...val };
    }, {});
    const totalActivePositionsCounts = activePositionsColumns.reduce((prev, current) => {
      if (!current.totalCount) return prev;
      const val = { [current.key]: _.sumBy(details?.subitems, (r) => (values[`${current.key}-${r.id}`] ? +values[`${current.key}-${r.id}`] : 0)) };
      return { ...prev, ...val };
    }, {});
    const monthlyTotal = _.sum(Object.values(totalActivePositionsCounts));
    const startingBal2 = Number(values['startingBal-1']) + Number(values['totalCredit-1']) + Number(values['totalDebit-1']);
    const startingBal3 = startingBal2 + Number(values['totalCredit-2']) + Number(values['totalDebit-2']);
    const matrixData = {
      ...values,
      totalBankActivityCounts,
      totalActivePositionsCounts,
      monthCashFlow,
      monthlyTotal,
      existingMonthlyDebt: -1 * monthlyTotal,
      remainingCashFlow: monthCashFlow + (-monthlyTotal),
      annualRevenue: monthCashFlow * 12,
      annualDebtToIncome: monthlyTotal / monthCashFlow,
      'startingBal-2': startingBal2,
      'startingBal-3': startingBal3,
    };
    matrixData.minMonthlyDepositCount = getColumnMin('depCnt', sampleRow, matrixData);
    matrixData.nSFLast30Days = getColumnSum('nsf', [...sampleRow].slice(1, 3), matrixData);
    matrixData.nSFLast90Days = getColumnSum('nsf', sampleRow, matrixData);
    matrixData.negativeDaysLast30 = getColumnSum('days', [...sampleRow].slice(1, 3), matrixData);
    matrixData.negativeDaysLast90 = getColumnSum('days', sampleRow, matrixData);
    matrixData.numberOfPositions = details?.subitems?.length;
    matrixData.timeInBusiness = dayjs().diff(values.business_est_date, 'month');
    const fundersData = fundersIntakeCalc(matrixData);
    const sortedData = _.sortBy(fundersData, ['tier'], ['asc']);
    matrixData.fundersPriority = sortedData.slice(0, 7);
    setMatrixValues(matrixData);
  };
  const handleSubmit = async (values) => {
    console.log(values);
  };
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          <Button className={styles.footerSubmitCTA} type="primary" shape="round">
            Apply Changes
          </Button>
        </Flex>
)}
      onCancel={handleClose}
      className="qualificationMatrix"
      style={{ top: 20 }}
      width="664px"
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24, color: '#1A4049' }}>Qualification Matrix</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400', color: '#1A4049' }}>
            Created:
            {' '}
            {dayjs().format('MM/DD/YY @ hh:mm A')}
            {' | '}
            Modified Last:
            {dayjs().format('MM/DD/YY @ hh:mm A')}
          </Flex>
        </Flex>
)}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleUpdate}
        defaultValue={{
        }}
      >
        <Flex vertical style={{ marginTop: 20 }}>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Business Name</Flex>
            <Flex flex={0.6} className={styles.value}>
              {details.name}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Type of Business</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                name="business_types"
              >
                <SelectField options={businessTypes.map(
                  (v) => ({ value: v.businessType, label: v.businessType }),
                )}
                />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>State Of Business</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                name="business_state"
              >
                <SelectField options={listOfStates.map(
                  (v) => ({ value: v, label: v }),
                )}
                />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Date Business Established</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                name="business_est_date"
              >
                <DatePicker defaultValue={dayjs()} maxDate={dayjs()} />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Fico Score</Flex>
            <Flex flex={0.6} className={styles.value}>
              <Form.Item
                noStyle
                name="fico_score"
              >
                <InputField />
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
                <Flex flex={0.7} className={styles.smallLabel}>Min Monthly Deposit Count</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {matrixValues.minMonthlyDepositCount}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Number of Positions</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {details?.subitems?.length}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>NSF (last 30)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {getColumnSum('nsf', [...sampleRow].slice(1, 3), matrixValues)}
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
                  {getColumnSum('days', [...sampleRow].slice(1, 3), matrixValues)}
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
                  {matrixValues.monthCashFlow}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Existing Monthly Debt Service</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {matrixValues.existingMonthlyDebt}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Remaining Cash Flow</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {matrixValues.remainingCashFlow}
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Monthly Total</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {matrixValues.monthlyTotal}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Annual Revenue</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  $
                  {' '}
                  {matrixValues.annualRevenue}
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Annual Debt to Income</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  {matrixValues.annualDebtToIncome}
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
            {(matrixValues.fundersPriority || []).map((v) => (
              <Flex style={{ width: '45%', fontSize: '13px' }}>
                -
                {' '}
                {v.funder}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
}
export default QualificationMatrixForm;
