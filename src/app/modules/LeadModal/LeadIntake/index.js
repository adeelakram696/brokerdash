import {
  Modal, Flex, Button, Form,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import InputField from 'app/components/Forms/InputField';
import SelectField from 'app/components/Forms/SelectField';
import TextAreaField from 'app/components/Forms/TextAreaField';
import { QuestionIcon } from 'app/images/icons';
import TooltipWrap from 'app/components/TooltipWrap';
import { columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import { useState } from 'react';
import { existingDepts, importantToYou, loanPurpose } from './data';
import styles from './LeadIntake.module.scss';
import { ExploreMindTooltip, GoalTooltip, PastNCurrentTooltip } from './tooltipsData';

function LeadIntakeModal({
  show, handleClose, board, details, leadId, updateInfo,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleUpdate = async (values) => {
    setLoading(true);
    await updateClientInformation(leadId, details.board.id, values);
    await updateInfo();
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
      <Form
        form={form}
        onFinish={handleUpdate}
      >
        <Flex vertical>
          <Flex vertical>
            <Flex className={styles.subTitles} align="center">
              Goals
              <TooltipWrap
                title={(
                  <GoalTooltip />
                )}
              >
                <Flex className={styles.infoIcon}>
                  <QuestionIcon color="#B3B3B3" />
                </Flex>
              </TooltipWrap>
            </Flex>
            <Flex className={styles.inputRow}>
              <Form.Item
                noStyle
                name={columnIds[board].goals}
              >
                <InputField placeholder="Notes" />
              </Form.Item>
            </Flex>
          </Flex>
          <Flex vertical>
            <Flex className={styles.subTitles} align="center">
              Explore Mindset
              <TooltipWrap
                title={(
                  <ExploreMindTooltip />
                )}
              >
                <Flex className={styles.infoIcon}><QuestionIcon color="#B3B3B3" /></Flex>
              </TooltipWrap>
            </Flex>
            <Flex vertical>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.6}>What purpose would your loan serve?</Flex>
                <Flex flex={0.4}>
                  <Form.Item
                    noStyle
                    name={columnIds[board].needs_money_for}
                  >
                    <SelectField options={loanPurpose} />
                  </Form.Item>
                </Flex>
              </Flex>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.6}>Which is most important to you?</Flex>
                <Flex flex={0.4}>
                  <Form.Item
                    noStyle
                    name={columnIds[board].most_important}
                  >
                    <SelectField options={importantToYou} />
                  </Form.Item>
                </Flex>
              </Flex>
              <Flex className={styles.inputRow}>
                <Form.Item
                  noStyle
                  name={columnIds[board].explore_mindset}
                >
                  <InputField placeholder="Notes" />
                </Form.Item>
              </Flex>
            </Flex>
          </Flex>
          <Flex vertical>
            <Flex className={styles.subTitles} align="center">
              Past and current
              <TooltipWrap
                title={(
                  <PastNCurrentTooltip />
                )}
              >
                <Flex className={styles.infoIcon}><QuestionIcon color="#B3B3B3" /></Flex>
              </TooltipWrap>
            </Flex>
            <Flex vertical>
              <Flex flex={1} className={styles.inputRow} justify="space-between">
                <Flex flex={0.6}>Do they have any existing debts</Flex>
                <Flex flex={0.4}>
                  <Form.Item
                    noStyle
                    name={columnIds[board].existing_debt}
                  >
                    <SelectField options={existingDepts} />
                  </Form.Item>
                </Flex>
              </Flex>
              <Flex className={styles.inputRow}>
                <Form.Item
                  noStyle
                  name={columnIds[board].past_and_current_financial_products}
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
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
}
export default LeadIntakeModal;
