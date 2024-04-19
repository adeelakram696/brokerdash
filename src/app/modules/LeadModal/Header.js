import { Flex, Select, message } from 'antd';
import drawer from 'drawerjs';
import classNames from 'classnames';
import { FireFilledIcon } from 'app/images/icons';
import { columnIds } from 'utils/constants';
import { useEffect, useState } from 'react';
import { updateStage } from 'app/apis/mutation';
import styles from './LeadModal.module.scss';
import SubRow from './SubRow';

function ModalHeader({ leadId, board, data }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedStage, setSelectedStage] = useState('');
  const stages = drawer.get('stages');
  useEffect(() => {
    if (!data.name) return;
    setSelectedStage(data.group.id);
  }, [data]);
  const handleChange = async (value) => {
    const res = await updateStage(leadId, value);
    if (res) messageApi.success('Successfully updated');
    setSelectedStage(value);
  };
  return (
    <>
      {contextHolder}
      <Flex justify="space-between" flex={0.65}>
        <Flex>
          <Flex className={classNames(styles.logo, styles.marginRight)} align="center"><FireFilledIcon /></Flex>
          <Flex className={classNames(styles.title, styles.marginRight)} align="center">
            {data.name}
          </Flex>
          <Flex className={classNames(styles.stageDropdown, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Stage</div>
            <Select
              className="stageDropdown"
              defaultValue="1"
              value={selectedStage}
              style={{ width: 250 }}
              onChange={handleChange}
              options={stages[board]}
            />
          </Flex>
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Sequence Name</div>
            <div className={styles.statusValue}>{data[columnIds[board].sequence_name]}</div>
          </Flex>
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Current Step</div>
            <div className={styles.statusValue}>{data[columnIds[board].sequence_step]}</div>
          </Flex>
        </Flex>
        <Flex justify="flex-start" flex={0.35}>
          {data[columnIds[board].type] === 'Renewal' ? (
            <Flex className={styles.applicationState}>
              {data[columnIds[board].type]}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <SubRow
        lastCreated={data[columnIds[board].creation_date]}
        lastSpoke={data[columnIds[board].last_touched]}
        nextFollowUp={data[columnIds[board].next_followup]}
        source={data[columnIds[board].source]}
      />
    </>
  );
}

export default ModalHeader;
