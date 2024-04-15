import { Flex, Select, message } from 'antd';
import drawer from 'drawerjs';
import classNames from 'classnames';
import { FireFilledIcon } from 'app/images/icons';
import { columnIds } from 'utils/constants';
import { useEffect, useState } from 'react';
import { updateStage } from 'app/apis/mutation';
import { fetchLeadHeaderData } from 'app/apis/query';
import styles from './LeadModal.module.scss';
import SubRow from './SubRow';

function ModalHeader({ leadId, board }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState({});
  const [selectedStage, setSelectedStage] = useState('');
  const stages = drawer.get('stages');
  const getData = async () => {
    const { res, columns } = await fetchLeadHeaderData(columnIds, board, leadId);
    setSelectedStage(res.data.items[0].group.id);
    setData({ ...res.data.items[0], ...columns });
  };
  useEffect(() => {
    getData();
  }, [leadId]);
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
          <Flex className={styles.applicationState}>
            Renewel
          </Flex>
        </Flex>
      </Flex>
      <SubRow
        lastCreated={data[columnIds[board].creation_date]}
        lastSpoke={data[columnIds[board].last_touched]}
        source={data[columnIds[board].source]}
      />
    </>
  );
}

export default ModalHeader;
