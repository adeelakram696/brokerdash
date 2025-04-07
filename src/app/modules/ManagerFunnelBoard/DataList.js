import {
  Flex,
  Tabs,
} from 'antd';
import { useState } from 'react';
import { boardNames, columnIds } from 'utils/constants';
import classNames from 'classnames';
import dayjs from 'dayjs';
import styles from './ManagerFunnelBoard.module.scss';
import LeadModal from '../LeadModal';

function DataList({ data }) {
  const [currentTab, setCurrentTab] = useState('details');
  const [isModalOpen, setIsModalOpen] = useState();
  const [selectedLead, setSelectedLead] = useState();
  const handleRowClick = (item) => {
    setSelectedLead(item);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedLead('');
    setIsModalOpen(false);
  };
  const items = [
    {
      key: 'details',
      label: `${data.stage} (${data.data?.length || 0})`,
      children: (
        <Flex vertical className={styles.list} flex={1}>
          <Flex vertical>
            <Flex justify="space-between" className={styles.itemRow}>
              <Flex flex={0.4}>Name</Flex>
              <Flex
                flex={0.2}
              >
                Agent
              </Flex>
              <Flex
                flex={0.2}
              >
                Stage
              </Flex>
              <Flex
                flex={0.2}
              >
                Total Call Attempted
              </Flex>
              <Flex
                flex={0.2}
              >
                Application Date
              </Flex>
            </Flex>
            {data?.data?.map((d) => (
              <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleRowClick(d); }}>
                <Flex flex={0.4}>{d.name}</Flex>
                <Flex
                  flex={0.2}
                  className={styles.agentName}
                >
                  {d[d.isDeal ? columnIds.deals.assginee : columnIds.leads.assginee]}
                </Flex>
                <Flex
                  flex={0.2}
                >
                  {d[d.isDeal ? columnIds.deals.stage : columnIds.leads.stage]}
                </Flex>
                <Flex
                  flex={0.2}
                >
                  {d[d.isDeal
                    ? columnIds.deals.total_call_attempts
                    : columnIds.leads.total_call_attempts] || '0'}
                </Flex>
                <Flex
                  flex={0.2}
                >
                  {dayjs(d[d.isDeal
                    ? columnIds.deals.application_date
                    : columnIds.leads.application_date]).format('MM/DD/YYYY')}
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>),
    },
    {
      key: 'offtrack',
      label: `Off Track (${data?.excludedData?.length || 0})`,
      children: (
        <Flex vertical className={styles.list} flex={1}>
          <Flex vertical>
            <Flex justify="space-between" className={styles.itemRow}>
              <Flex flex={0.4}>Name</Flex>
              <Flex
                flex={0.2}
              >
                Agent
              </Flex>
              <Flex
                flex={0.2}
              >
                Stage
              </Flex>
              <Flex
                flex={0.2}
              >
                Total Call Attempted
              </Flex>
              <Flex
                flex={0.2}
              >
                Application Date
              </Flex>
            </Flex>
            {data?.excludedData?.map((d) => (
              <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleRowClick(d); }}>
                <Flex flex={0.4}>{d.name}</Flex>
                <Flex
                  flex={0.2}
                  className={styles.agentName}
                >
                  {d[d.isDeal ? columnIds.deals.assginee : columnIds.leads.assginee]}
                </Flex>
                <Flex
                  flex={0.2}
                >
                  {d.group.title}
                </Flex>
                <Flex
                  flex={0.2}
                >
                  {d[d.isDeal
                    ? columnIds.deals.total_call_attempts
                    : columnIds.leads.total_call_attempts] || '0'}
                </Flex>
                <Flex
                  flex={0.2}
                >
                  {dayjs(d[d.isDeal
                    ? columnIds.deals.application_date
                    : columnIds.leads.application_date]).format('MM/DD/YYYY')}
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>),
    },
  ];
  return (
    <Flex className={classNames(styles.dataTableContainer, 'manager-funnel')} flex={1}>
      <Tabs
        size="middle"
        rootClassName={styles.tabs}
        defaultActiveKey="details"
        activeKey={currentTab}
        items={items}
        onChange={setCurrentTab}
      />
      {isModalOpen ? (
        <LeadModal
          show={isModalOpen}
          handleClose={handleClose}
          leadId={selectedLead?.id}
          board={selectedLead?.isDeal ? boardNames.deals : boardNames.lead}
        />
      ) : null}
    </Flex>
  );
}

export default DataList;
