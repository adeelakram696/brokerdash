/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import {
  Flex,
  Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import classNames from 'classnames';
import styles from './ManagerFunnelBoard.module.scss';

function DataList({ data }) {
  const [currentTab, setCurrentTab] = useState('details');
  const handleClick = (item) => {
    const url = `${env.boardBaseURL}${item.isDeal ? env.boards.deals : env.boards.leads}/pulses/${item.id}`;
    window.open(url, '_blank');
  };
  const items = [
    {
      key: 'details',
      label: `${data.stage} (${data.data?.length || 0})`,
      children: (
        <Flex vertical className={styles.list} flex={1}>
          <Flex vertical>
            {data?.data?.map((d) => (
              <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleClick(d); }}>
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
              <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleClick(d); }}>
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

    </Flex>
  );
}

export default DataList;
