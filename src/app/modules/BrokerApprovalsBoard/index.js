import {
  Flex,
  Spin,
} from 'antd';
import { useEffect, useState, useRef } from 'react';
import { fetchUser } from 'app/apis/query';
import dayjs from 'dayjs';
import { sortData } from 'utils/helpers';
import { env } from 'utils/constants';
import drawer from 'drawerjs';
import { fetchBrokerUsers, fetchBrokerApprovals, fetchUsersByIds } from './apis';
import { findApprovals } from './transformData';
import DataList from './DataList';
import styles from './ApprovalsBoard.module.scss';
import { checkDateFilter, matchBroker, matchStages } from './data';

function BrokerApprovalsBoardModule() {
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
    const currentUser = fetchUser();
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    try {
      // First, get the broker users list
      const userIds = await fetchBrokerUsers(currentUser.id);
      // Also update the users list with only selected users
      const users = await fetchUsersByIds(userIds);
      const list = (users || []).map((u) => ({
        label: u.name,
        value: u.name,
      }));
      const filterList = (users || []).map((u) => (u.name));
      setUsersList(list);
      setFilter((prevFilter) => ({ ...prevFilter, broker: filterList }));

      // Then, fetch approvals for all users
      const res = await fetchBrokerApprovals(userIds);
      const transformed = findApprovals(res);
      setLoading(false);
      const sortKeys = Object.keys(sortingRef.current || {});
      sortBy(transformed, (sortKeys || [])[0] || 'maxApproved', sortingRef.current?.type || 'number', !isLoading);
    } catch (error) {
      // Error fetching broker approvals
      setLoading(false);
    }
  };

  const handleFilter = (filterValue) => {
    setFilter({ ...filter, ...filterValue });
  };
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
          Broker Approvals
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

export default BrokerApprovalsBoardModule;
