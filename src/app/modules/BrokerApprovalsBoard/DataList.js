/* eslint-disable no-nested-ternary */
import {
  Flex,
  Select,
} from 'antd';
import { boardNames } from 'utils/constants';
import classNames from 'classnames';
import { numberWithCommas } from 'utils/helpers';
import dayjs from 'dayjs';
import { useState } from 'react';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import InputField from 'app/components/Forms/InputField';
import styles from './ApprovalsBoard.module.scss';
import LeadModal from '../LeadModal';
import {
  dateDurations,
} from './data';

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
function DataList({
  data, sortBy, sorting, handleFilter, filter,
  usersList, stages,
}) {
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
          <Flex justify="space-between" className={classNames(styles.itemRow, styles.header)}>
            <Flex
              className={styles.headerItem}
              flex={0.4}
              onClick={() => { sortBy(data, 'name', 'string'); }}
            >
              {' '}
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.2}
            >
              <Flex>
                <Select
                  value={filter.broker}
                  style={{ maxWidth: '250px', minWidth: '200px' }}
                  onChange={(val) => { handleFilter({ broker: val }); }}
                  options={usersList}
                  mode="multiple"
                  maxTagCount={1}
                  allowClear
                />
              </Flex>
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.2}
            >
              <Flex style={{ width: '200px' }} alignItems="center">
                <InputField
                  onChange={(e) => { handleFilter({ amountMin: e.target.value }); }}
                  style={{ maxHeight: '35px' }}
                  placeholder="Min"
                />
                {' - '}
                <InputField
                  onChange={(e) => { handleFilter({ amountMax: e.target.value }); }}
                  style={{ maxHeight: '35px' }}
                  placeholder="Max"
                />
              </Flex>
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.2}
            >
              <Flex>
                <Select
                  style={{ maxWidth: '250px', minWidth: '200px' }}
                  value={filter.stage}
                  onChange={(_, arr) => {
                    handleFilter({ stage: arr });
                  }}
                  options={stages.deals}
                  maxTagCount={1}
                  mode="multiple"
                  allowClear
                />
              </Flex>
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.1}
            >
              <Flex style={{ width: '100px' }}>
                <Select
                  value={filter.approvalDate}
                  style={{ width: 200 }}
                  onChange={(val) => { handleFilter({ approvalDate: val }); }}
                  options={dateDurations}
                  allowClear
                />
              </Flex>
            </Flex>
            <Flex
              className={styles.headerItem}
              flex={0.1}
            >
              <Flex style={{ width: '100px' }}>
                <Select
                  value={filter.lastTouchedDate}
                  style={{ width: 200 }}
                  onChange={(val) => { handleFilter({ lastTouchedDate: val }); }}
                  options={dateDurations}
                  allowClear
                />
              </Flex>
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
