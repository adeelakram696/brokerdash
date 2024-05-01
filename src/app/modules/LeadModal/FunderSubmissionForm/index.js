import {
  Modal, Flex, Button, Form,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import InputField from 'app/components/Forms/InputField';
import SelectField from 'app/components/Forms/SelectField';
import TextAreaField from 'app/components/Forms/TextAreaField';
import { columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { LeadContext } from 'utils/contexts';
import { getFormulaValues } from 'utils/helpers';
import styles from './FunderSubmissionForm.module.scss';
import {
  achFrequency, commissionOn, productTypes, statusValues,
} from '../TabsContent/SubmissionsTab/data';

function FunderSubmissionForm({
  show, handleClose, data,
}) {
  const {
    getData,
  } = useContext(LeadContext);
  const [form] = Form.useForm();
  const [forumlas, setFormulas] = useState({});
  const [loading, setLoading] = useState(false);
  const setFieldsValues = () => {
    form.setFieldsValue({
      [columnIds.subItem.status]: data[columnIds.subItem.status],
      [columnIds.subItem.product_type]: data[columnIds.subItem.product_type],
      [columnIds.subItem.funding_amount]: data[columnIds.subItem.funding_amount],
      [columnIds.subItem.factor_rate]: data[columnIds.subItem.factor_rate],
      [columnIds.subItem.funder_fee_perc]: data[columnIds.subItem.funder_fee_perc],
      [columnIds.subItem.ach_amount]: data[columnIds.subItem.ach_amount],
      [columnIds.subItem.ach_frequency]: data[columnIds.subItem.ach_frequency],
      [columnIds.subItem.commission_calc_on]: data[columnIds.subItem.commission_calc_on],
      [columnIds.subItem.commission_perc]: data[columnIds.subItem.commission_perc],
      [columnIds.subItem.professional_fee_perc]: data[columnIds.subItem.professional_fee_perc],
      [columnIds.subItem.notes]: data[columnIds.subItem.notes],
    });
  };
  const handleChange = (_, values) => {
    const calculatedValues = getFormulaValues(values);
    setFormulas(calculatedValues);
  };
  useEffect(() => {
    if (!data.name) return;
    setFieldsValues();
    handleChange('', data);
  }, [data]);
  const handleUpdate = async (values) => {
    setLoading(true);
    await updateClientInformation(data.id, data.board.id, values);
    await getData();
    setLoading(false);
    handleClose();
  };
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          <Button
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
            onClick={() => { form.submit(); }}
            loading={loading}
          >
            Update Deal
          </Button>
        </Flex>
)}
      onCancel={handleClose}
      className="funderForm"
      style={{ top: 20 }}
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24, color: '#525252' }}>{data.name}</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400' }}>
            Last updated on
            {' '}
            {dayjs(data.updated_at).format('MM/DD/YY @ HH:mm A')}
          </Flex>
        </Flex>
)}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        onValuesChange={handleChange}
        defaultValue={{
        }}
      >
        <Flex vertical style={{ marginTop: 20 }}>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.largeText}>Status</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.status}
              >
                <SelectField options={statusValues} />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.largeText}>Product Type</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.product_type}
              >
                <SelectField options={productTypes} />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Funding</Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Funding Amount</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.funding_amount}
              >
                <InputField />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Factor Rate</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.factor_rate}
              >
                <InputField />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Funder Fee %</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.funder_fee_perc}
              >
                <InputField />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Funder Fee</Flex>
            <Flex flex={0.6}>
              {forumlas[columnIds.subItem.funder_fee]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Net Funding Amt</Flex>
            <Flex flex={0.6}>
              {forumlas[columnIds.subItem.net_funding_amt]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Payback</Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>ACH Amount</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.ach_amount}
              >
                <InputField />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>ACH Frequency</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.ach_frequency}
              >
                <SelectField options={achFrequency} />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Payback Period</Flex>
            <Flex flex={0.6}>
              {forumlas[columnIds.subItem.payback_period]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Payback Amount</Flex>
            <Flex flex={0.6}>
              {forumlas[columnIds.subItem.payback_amount]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Commissions</Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Commision on</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.commission_calc_on}
              >
                <SelectField options={commissionOn} />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Commission %</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.commission_perc}
              >
                <InputField />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Commission Amt</Flex>
            <Flex flex={0.6}>
              {forumlas[columnIds.subItem.comission_amt]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Professional Fee %</Flex>
            <Flex flex={0.6}>
              <Form.Item
                noStyle
                name={columnIds.subItem.professional_fee_perc}
              >
                <InputField />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4}>Professional Service Fee</Flex>
            <Flex flex={0.6}>
              {forumlas[columnIds.subItem.professional_service_fee]}
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Notes</Flex>
          </Flex>
          <Flex className={styles.inputRow}>
            <Form.Item
              noStyle
              name={columnIds.subItem.notes}
            >
              <TextAreaField
                placeholder="Notes"
                autoSize={{
                  minRows: 4,
                  maxRows: 6,
                }}
              />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
}
export default FunderSubmissionForm;
