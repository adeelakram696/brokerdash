import {
  Modal, Flex, Button, Divider, Form,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import EditableTable from 'app/components/EditableTable';
import styles from './QualificationMatrixForm.module.scss';
import { activePositionsColumns, bankActivityColumns, sampleRow } from './data';

function QualificationMatrixForm({ show, handleClose, data }) {
  const [form] = Form.useForm();
  const handleUpdate = async (values) => {
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
            {dayjs().format('MM/DD/YY @ HH:mm A')}
            {' | '}
            Modified Last:
            {dayjs().format('MM/DD/YY @ HH:mm A')}
          </Flex>
        </Flex>
)}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        defaultValue={{
        }}
      >
        <Flex vertical style={{ marginTop: 20 }}>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Business Name</Flex>
            <Flex flex={0.6} className={styles.value}>
              Anytime Services LLC
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Type of Business</Flex>
            <Flex flex={0.6} className={styles.value}>
              Anytime Services LLC
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>State Of Business</Flex>
            <Flex flex={0.6} className={styles.value}>
              Anytime Services LLC
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Date Business Established</Flex>
            <Flex flex={0.6} className={styles.value}>
              Anytime Services LLC
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="space-between">
            <Flex flex={0.4} className={styles.label}>Fico Score</Flex>
            <Flex flex={0.6} className={styles.value}>
              Anytime Services LLC
            </Flex>
          </Flex>
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Bank activity</Flex>
          </Flex>
          <Flex>
            <EditableTable columns={bankActivityColumns} rows={sampleRow} />
          </Flex>
          <Divider />
          <Flex flex={1} justify="center">
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Min Monthly Deposit Count</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  1
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Number of Positions</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  1
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>NSF (last 30)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  1
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical flex={0.5}>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>NSF (last 90)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  4
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Negative Days (Last 30 Days)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  4
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.7} className={styles.smallLabel}>Negative Days (Last 90 Days)</Flex>
                <Flex flex={0.3} className={styles.smallValue}>
                  4
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Flex flex={1} className={styles.inputRow} justify="flex-start">
            <Flex flex={0.4} className={styles.largeText}>Active Positions</Flex>
          </Flex>
          <Flex>
            <EditableTable columns={activePositionsColumns} rows={data.subitems} />
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
            <Flex style={{ width: '35%', fontSize: '13px' }}>Rapid Finance</Flex>
            <Flex style={{ width: '35%', fontSize: '13px' }}>Rapid Finance</Flex>
            <Flex style={{ width: '35%', fontSize: '13px' }}>Rapid Finance</Flex>
            <Flex style={{ width: '35%', fontSize: '13px' }}>Rapid Finance</Flex>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
}
export default QualificationMatrixForm;
