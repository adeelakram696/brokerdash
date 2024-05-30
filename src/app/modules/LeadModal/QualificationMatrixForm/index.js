import {
  Modal, Flex, Button, Divider, Form,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import EditableTable from 'app/components/EditableTable';
import { useContext, useEffect, useState } from 'react';
import { LeadContext } from 'utils/contexts';
import _ from 'lodash';
import { columnIds } from 'utils/constants';
import { updateSimpleColumnValue } from 'app/apis/mutation';
import { extractLeastNumber } from 'utils/helpers';
import styles from './QualificationMatrixForm.module.scss';
import {
  activePositionKeys,
  activePositionsColumns, bankActivityColumns, bankActivityKeys, sampleRow, sampleRowFunders,
} from './data';
import { fundersIntakeCalc } from './matrixData';

function QualificationMatrixForm({ show, handleClose }) {
  const [form] = Form.useForm();
  const {
    details, leadId, boardId, board, getData,
  } = useContext(LeadContext);
  const [matrixValues, setMatrixValues] = useState({});
  const [loading, setLoading] = useState(false);

  const getColumnSum = (columnKey, rows, data) => rows.reduce((prev, current) => prev + Number(data[`${columnKey}-${current.id}`] || 0), 0);

  const getColumnMin = (columnKey, rows, data) => rows.reduce((prev, current) => {
    if (prev === 0 || prev > Number(data[`${columnKey}-${current.id}`])) return Number(data[`${columnKey}-${current.id}`]);
    return prev;
  }, 0);

  const handleUpdate = async (value, values) => {
    const monthsCount = sampleRow.reduce((prev, current) => {
      if (!values[`monthId-${current.id}`]) return prev;
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
      const val = { [current.key]: _.sumBy(sampleRowFunders, (r) => (values[`${current.key}-${r.id}`] ? +values[`${current.key}-${r.id}`] : 0)) };
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
      annualDebtToIncome: (monthlyTotal / monthCashFlow).toFixed(4),
      'startingBal-2': startingBal2,
      'startingBal-3': startingBal3,
    };
    matrixData.minMonthlyDepositCount = getColumnMin('depCnt', sampleRow, matrixData);
    matrixData.nSFLast30Days = getColumnSum('nsf', [...sampleRow].slice(1, 3), matrixData);
    matrixData.nSFLast90Days = getColumnSum('nsf', sampleRow, matrixData);
    matrixData.negativeDaysLast30 = getColumnSum('days', [...sampleRow].slice(1, 3), matrixData);
    matrixData.negativeDaysLast90 = getColumnSum('days', sampleRow, matrixData);
    matrixData.numberOfPositions = sampleRowFunders.filter((i) => values[`funderId-${i.id}`]).length;
    const industry = details[columnIds[board].industry];
    const state = details[columnIds[board].state_incorporated];
    const timeInBusiness = dayjs().diff(details[columnIds[board].business_start_date], 'month');
    const ficoScore = extractLeastNumber(details[columnIds[board].credit_score]);
    const fundersData = fundersIntakeCalc({
      ficoScore, industry, state, timeInBusiness, ...matrixData,
    });
    const sortedData = _.sortBy(fundersData, ['tier'], ['asc']);
    matrixData.fundersPriority = sortedData.slice(0, 7).map((i) => i.funder);
    setMatrixValues(matrixData);
  };
  const setDefaultValues = () => {
    if (!details.name) return;
    const bankActivity = JSON.parse(details[columnIds[board].qm_bank_activity] || '{}');
    const activePosition = JSON.parse(details[columnIds[board].qm_active_position] || '{}');
    const suggestedFunders = JSON.parse(details[columnIds[board].qm_suggested_funders] || '[]');
    const combined = {
      ...bankActivity,
      ...activePosition,
      fundersPriority: suggestedFunders,
    };
    handleUpdate({}, combined);
    form.setFieldsValue(combined);
  };
  const onClose = () => {
    setDefaultValues();
    handleClose();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const bankActivity = bankActivityKeys.reduce((
      prev,
      key,
    ) => ({ ...prev, [key]: matrixValues[key] }), {});
    const activePositions = activePositionKeys.reduce((
      prev,
      key,
    ) => ({ ...prev, [key]: matrixValues[key] }), {});
    await updateSimpleColumnValue(
      leadId,
      boardId,
      JSON.stringify(bankActivity).replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
      columnIds[board].qm_bank_activity,
    );
    await updateSimpleColumnValue(
      leadId,
      boardId,
      JSON.stringify(activePositions).replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
      columnIds[board].qm_active_position,
    );
    await updateSimpleColumnValue(
      leadId,
      boardId,
      JSON.stringify(matrixValues.fundersPriority).replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
      columnIds[board].qm_suggested_funders,
    );
    setLoading(false);
    getData();
    onClose();
  };
  useEffect(() => {
    setDefaultValues();
  }, [details.name]);
  const businessTimeMonth = dayjs().diff(details[columnIds[board].business_start_date], 'month');
  const businessTimeYear = dayjs().diff(details[columnIds[board].business_start_date], 'year');
  const getLastModified = () => {
    const entry = (
      (details || {}
      ).column_values || [])
      .find((c) => c.id === columnIds[board].qm_bank_activity);
    const lastModified = JSON.parse(entry?.value || '{}')?.changed_at || '';
    return lastModified ? dayjs(lastModified).format('MM/DD/YY @ hh:mm A') : '-';
  };
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
      onCancel={onClose}
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
            <Flex flex={0.4} className={styles.label}>Business Name</Flex>
            <Flex flex={0.6} className={styles.value}>
              {details.name}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Type of Business</Flex>
            <Flex flex={0.6} className={styles.value}>
              {details[columnIds[board].industry]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>State Of Business</Flex>
            <Flex flex={0.6} className={styles.value}>
              {details[columnIds[board].state_incorporated]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Date Business Established</Flex>
            <Flex flex={0.6} className={styles.value}>
              {details[columnIds[board].business_start_date] ? dayjs(details[columnIds[board].business_start_date]).format('MM/DD/YYYY') : ''}
              {businessTimeMonth > 0 ? ` - ${businessTimeMonth} month(s)` : ''}
              {' '}
              {businessTimeYear > 0 ? ` - ${businessTimeYear} year(s)` : ''}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Fico Score</Flex>
            <Flex flex={0.6} className={styles.value}>
              {extractLeastNumber(details[columnIds[board].credit_score])}
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
                  {matrixValues?.numberOfPositions}
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
                {v}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
}
export default QualificationMatrixForm;
