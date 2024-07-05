import {
  Flex,
  Tabs,
} from 'antd';
import { useState } from 'react';
import { boardNames, columnIds } from 'utils/constants';
import classNames from 'classnames';
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
            {data?.data?.map((d) => (
              <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleRowClick(d); }}>
                <Flex flex={0.4}>{d.name}</Flex>
                <Flex
                  flex={0.3}
                  className={styles.agentName}
                >
                  {d[d.isDeal ? columnIds.deals.assginee : columnIds.leads.assginee]}
                </Flex>
                <Flex
                  flex={0.3}
                >
                  {d[d.isDeal ? columnIds.deals.stage : columnIds.leads.stage]}
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
            {data?.excludedData?.map((d) => (
              <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleRowClick(d); }}>
                <Flex flex={0.4}>{d.name}</Flex>
                <Flex
                  flex={0.3}
                  className={styles.agentName}
                >
                  {d[d.isDeal ? columnIds.deals.assginee : columnIds.leads.assginee]}
                </Flex>
                <Flex
                  flex={0.3}
                >
                  {d.group.title}
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
