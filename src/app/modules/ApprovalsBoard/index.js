import {
  Flex,
  Spin,
} from 'antd';
import { useEffect, useState, useRef } from 'react';
import { fetchUsers, getAllApprovals } from 'app/apis/query';
import dayjs from 'dayjs';
import { sortData } from 'utils/helpers';
import { env } from 'utils/constants';
import drawer from 'drawerjs';
import { findApprovals } from './transformData';
import DataList from './DataList';
import styles from './ApprovalsBoard.module.scss';
import { checkDateFilter, matchBroker, matchStages } from './data';

function ApprovalsBoardModule() {
  const sortingRef = useRef();
  const stages = drawer.get('stages');
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    stage: stages.deals,
  });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState({ maxApproved: false, type: 'number' });
  const sortBy = (currentData, column, type, forced = false) => {
    const sortingKey = forced ? sortingRef.current : sorting;
    const sortingData = { [column]: forced ? sortingKey[column] : !sortingKey[column], type };
    const sorted = sortData(currentData, column, type, sortingData[column]);
    setData([...sorted]);
    sortingRef.current = sortingData;
    setSorting(sortingData);
  };
  const fetchData = async (isLoading = true) => {
    setLoading(true && isLoading);
    const res = await getAllApprovals();
    const transformed = findApprovals(res);
    setLoading(false);
    const sortKeys = Object.keys(sortingRef.current || {});
    sortBy(transformed, (sortKeys || [])[0] || 'maxApproved', sortingRef.current?.type || 'number', !isLoading);
  };
  const getUsersList = async () => {
    const res = await fetchUsers();
    const list = (res || []).map((u) => ({
      label: u.name,
      value: u.name,
    }));
    const filterList = (res || []).map((u) => (u.name));
    setUsersList(list);
    setFilter({ ...filter, broker: filterList });
  };
  const handleFilter = (filterValue) => {
    setFilter({ ...filter, ...filterValue });
  };
  useEffect(() => {
    getUsersList();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(
      () => { fetchData(false); }
      , (1000 * env.intervalTime),
    );
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  let filtered = data;
  if (Object.keys(filter).length > 0) {
    filtered = data.filter((deal) => {
      const filterResp = [];
      if (filter.broker?.length > 0) {
        filterResp.push(matchBroker(deal.agent, filter.broker));
      }
      if (filter.amountMin) {
        filterResp.push(Number(deal.maxApproved) >= Number(filter.amountMin));
      }
      if (filter.amountMax) {
        filterResp.push(Number(deal.maxApproved) <= Number(filter.amountMax));
      }
      if (filter.stage?.length > 0) {
        filterResp.push(matchStages(deal.stage, filter.stage));
      }
      if (filter.approvalDate) {
        filterResp.push(checkDateFilter(deal.approvalDate, filter.approvalDate));
      }
      if (filter.lastTouchedDate) {
        filterResp.push(checkDateFilter(deal.lastTouched, filter.lastTouchedDate));
      }
      if (filterResp.length > 0 && filterResp.includes(false)) {
        return false;
      }
      return true;
    });
  }
  return (
    <Flex flex={1} vertical>
      <Spin tip="Fetching Data..." spinning={loading} fullscreen />
      <Flex justify="center">
        <Flex className={styles.headingCount}>
          {filtered.length}
        </Flex>
        <Flex className={styles.heading}>
          Approvals
        </Flex>
        <Flex className={styles.headingduration}>
          between
          {' '}
          {dayjs().subtract(30, 'days').format('DD MMM YYYY')}
          {' '}
          -
          {' '}
          {dayjs().format('DD MMM YYYY')}
        </Flex>
      </Flex>
      <DataList
        data={filtered}
        sortBy={sortBy}
        sorting={sorting}
        handleFilter={handleFilter}
        filter={filter}
        usersList={usersList}
        stages={stages}
      />
    </Flex>
  );
}

export default ApprovalsBoardModule;
