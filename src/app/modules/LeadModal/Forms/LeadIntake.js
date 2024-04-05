import { Modal, Flex, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import InputField from 'app/components/Forms/InputField';
import SelectField from 'app/components/Forms/SelectField';
import TextAreaField from 'app/components/Forms/TextAreaField';
import { existingDepts, importantToYou, loadPurpose } from './data';
import styles from './Forms.module.scss';

function LeadIntakeModal({ show, handleClose }) {
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          <Button className={styles.footerSubmitCTA} type="primary" shape="round">
            Update Intake
          </Button>
        </Flex>
)}
      onCancel={handleClose}
      className="leadIntake"
      style={{ top: 20 }}
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24 }}>Lead Intake</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400' }}>Last updated on 12/16/24 @ 2:30pm</Flex>
        </Flex>
)}
    >
      <Flex vertical>
        <Flex vertical>
          <Flex className={styles.subTitles}>Goals</Flex>
          <Flex className={styles.inputRow}><InputField placeholder="Notes" /></Flex>
        </Flex>
        <Flex vertical>
          <Flex className={styles.subTitles}>Explore Mindset</Flex>
          <Flex vertical>
            <Flex flex={1} className={styles.inputRow} justify="space-between">
              <Flex flex={0.6}>What purpose would your loan serve?</Flex>
              <Flex flex={0.4}><SelectField defaultValue="1" options={loadPurpose} /></Flex>
            </Flex>
            <Flex flex={1} className={styles.inputRow} justify="space-between">
              <Flex flex={0.6}>Which is most important to you?</Flex>
              <Flex flex={0.4}><SelectField defaultValue="1" options={importantToYou} /></Flex>
            </Flex>
            <Flex className={styles.inputRow}>
              <InputField placeholder="Notes" />
            </Flex>
          </Flex>
        </Flex>
        <Flex vertical>
          <Flex className={styles.subTitles}>Past and current</Flex>
          <Flex vertical>
            <Flex flex={1} className={styles.inputRow} justify="space-between">
              <Flex flex={0.6}>Do they have any existing debts</Flex>
              <Flex flex={0.4}><SelectField defaultValue="Yes" options={existingDepts} /></Flex>
            </Flex>
            <Flex className={styles.inputRow}>
              <TextAreaField
                placeholder="Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor inciLorem"
                autoSize={{
                  minRows: 4,
                  maxRows: 6,
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
}
export default LeadIntakeModal;
