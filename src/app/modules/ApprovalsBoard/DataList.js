/* eslint-disable no-nested-ternary */
import {
  Flex,
} from 'antd';
import { boardNames } from 'utils/constants';
import classNames from 'classnames';
import { numberWithCommas } from 'utils/helpers';
import dayjs from 'dayjs';
import { useState } from 'react';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import styles from './ApprovalsBoard.module.scss';
import LeadModal from '../LeadModal';

function SortedIcon({ sorting, column }) {
  return sorting[column] !== undefined
    ? (sorting[column]
      ? (
        <SortAscendingOutlined
          className={styles.sortingIcon}
        />
      ) : (
        <SortDescendingOutlined
          className={styles.sortingIcon}
        />
      )) : null;
}
function DataList({ data, sortBy, sorting }) {
  const [isModalOpen, setIsModalOpen] = useState();
  const [selectedLeadId, setSelectedLeadId] = useState();
  const handleRowClick = (id) => {
    setSelectedLeadId(id);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedLeadId('');
    setIsModalOpen(false);
  };
  return (
    <Flex className={classNames(styles.dataTableContainer, 'manager-funnel')} flex={1}>
      <Flex vertical className={styles.list} flex={1}>
        <Flex vertical>
          <Flex justify="space-between" className={classNames(styles.itemRow, styles.header)}>
            <Flex
              className={styles.headerItem}
              flex={0.4}
              onClick={() => { sortBy(data, 'name', 'string'); }}
            >
              Name
              <SortedIcon sorting={sorting} column="name" />
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.2}
              onClick={() => { sortBy(data, 'agent', 'string'); }}
            >
              Broker
              <SortedIcon sorting={sorting} column="agent" />
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.2}
              onClick={() => { sortBy(data, 'maxApproved', 'number'); }}
            >
              Max Approval Amount
              <SortedIcon sorting={sorting} column="maxApproved" />
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.2}
              onClick={() => { sortBy(data, 'stage', 'string'); }}
            >
              Stage
              <SortedIcon sorting={sorting} column="stage" />
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.1}
              onClick={() => { sortBy(data, 'approvalDate', 'date'); }}
            >
              Approval Date
              <SortedIcon sorting={sorting} column="approvalDate" />
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.1}
              onClick={() => { sortBy(data, 'lastTouched', 'date'); }}
            >
              Last Touched
              <SortedIcon sorting={sorting} column="lastTouched" />
            </Flex>
          </Flex>
          {data?.map((d) => (
            <Flex justify="space-between" className={styles.itemRow} onClick={() => { handleRowClick(d.id); }}>
              <Flex flex={0.4}>{d.name}</Flex>
              <Flex
                flex={0.2}
                className={styles.agentName}
              >
                {d.agent}
              </Flex>
              <Flex
                flex={0.2}
              >
                {d.maxApproved ? `$${numberWithCommas(d.maxApproved)}` : '-'}
              </Flex>
              <Flex
                flex={0.2}
              >
                {d.stage || '-'}
              </Flex>
              <Flex
                flex={0.1}
              >
                {d.approvalDate ? dayjs(d.approvalDate).format('DD MMM YYYY') : '-'}
              </Flex>
              <Flex
                flex={0.1}
              >
                {d.lastTouched ? dayjs(d.lastTouched).format('DD MMM YYYY') : '-'}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
      {isModalOpen ? (
        <LeadModal
          show={isModalOpen}
          handleClose={handleClose}
          leadId={selectedLeadId}
          board={boardNames.deals}
        />
      ) : null}
    </Flex>
  );
}

export default DataList;
