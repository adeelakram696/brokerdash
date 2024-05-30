import {
  Dropdown, Flex, Popconfirm, Select,
  Steps,
  Tooltip,
} from 'antd';
import drawer from 'drawerjs';
import classNames from 'classnames';
import { FireFilledIcon } from 'app/images/icons';
import { columnIds, sequenceSteps } from 'utils/constants';
import { useContext, useEffect, useState } from 'react';
import { updateClientInformation, updateStage } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import { fetchUser, fetchUsers } from 'app/apis/query';
import { SyncOutlined } from '@ant-design/icons';
import { convertSequenceNameToKey } from 'utils/helpers';
import styles from './LeadModal.module.scss';
import SubRow from './SubRow';

function ModalHeader() {
  const {
    leadId, board, details, groupId, getData, loadingData, refetchAllData,
    messageApi,
  } = useContext(LeadContext);
  const [selectedStage, setSelectedStage] = useState('');
  const [usersList, setUsersList] = useState([]);
  const stages = drawer.get('stages');
  const isAdmin = fetchUser().is_admin;
  const handleUpdateAssignee = async (id) => {
    const dataJson = { [columnIds[board].assginee]: { personsAndTeams: [{ id, kind: 'person' }] } };
    await updateClientInformation(leadId, details.board.id, dataJson);
    getData();
  };
  const getUsersList = async () => {
    const res = await fetchUsers();
    const list = (res || []).map((u) => ({
      label: (
        <Popconfirm
          title="Update Assginee"
          description="Are you sure to update this assginee?"
          onConfirm={() => { handleUpdateAssignee(u.id); }}
          okText="Yes"
          cancelText="No"
        >
          {u.name}
        </Popconfirm>),
      id: u.id,
    }));
    setUsersList(list);
  };
  useEffect(() => {
    if (!details.name) return;
    setSelectedStage(groupId);
    if (isAdmin) getUsersList();
  }, [details]);
  const handleChange = async (value) => {
    const res = await updateStage(leadId, value);
    if (res) messageApi.success('Successfully updated');
    setSelectedStage(value);
  };
  const sequenceKey = details[columnIds[board].sequence_name] ? convertSequenceNameToKey(details[columnIds[board].sequence_name]) : '';
  const currentStep = details[columnIds[board][sequenceKey]];
  const stepIndex = sequenceSteps[board][sequenceKey]?.findIndex(
    ({ title }) => title === currentStep,
  );
  const stepItems = sequenceSteps[board][sequenceKey]?.map((val, index) => {
    if (index < stepIndex) {
      return { ...val, status: 'finish' };
    } if (index === stepIndex) {
      return { ...val, status: 'process' };
    }
    return val;
  });
  return (
    <>
      <Flex justify="space-between" flex={0.65}>
        <Flex>
          <Flex className={classNames(styles.logo, styles.marginRight)} align="center"><FireFilledIcon /></Flex>
          <Flex className={classNames(styles.marginRight)} align="left" vertical>
            <Flex className={styles.title}>{details.name}</Flex>
            <Flex>
              Assigned To
              {' '}
              {' '}
              <Dropdown
                menu={{
                  items: usersList,
                }}
                trigger={['click']}
                disabled={!isAdmin}
              >
                <b style={{ marginLeft: 5, cursor: 'pointer' }}>{(board === 'deals' ? details[columnIds.deals.agent] : details[columnIds.leads.sales_rep]) || '-- Select --'}</b>
              </Dropdown>
            </Flex>
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
            <Tooltip
              placement="rightTop"
              color="#FFF"
              title={(
                <Steps
                  style={{
                    marginTop: 8,
                  }}
                  current={stepIndex}
                  status="process"
                  items={stepItems}
                  direction="vertical"
                />
)}
            >
              <div className={styles.statusValue}>{details[columnIds[board].sequence_name]}</div>
            </Tooltip>
          </Flex>
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Current Step</div>
            <div className={styles.statusValue}>{details[columnIds[board].sequence_step]}</div>
          </Flex>
          <Flex align="center" vertical>
            <SyncOutlined onClick={refetchAllData} spin={loadingData} />
          </Flex>
        </Flex>
        <Flex justify="flex-start" flex={0.35}>
          {details[columnIds[board].type] === 'Renewal' ? (
            <Flex className={styles.applicationState}>
              {details[columnIds[board].type]}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <SubRow
        lastCreated={details[columnIds[board].creation_date]}
        lastSpoke={details[columnIds[board].last_touched]}
        nextFollowUp={details[columnIds[board].next_followup]}
        source={details[columnIds[board].source]}
      />
    </>
  );
}

export default ModalHeader;
