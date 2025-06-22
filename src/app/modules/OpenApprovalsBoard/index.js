import {
  Flex,
  Spin,
} from 'antd';
import { useEffect, useState, useRef } from 'react';
import { getAllOpenApprovals } from 'app/apis/query';
import dayjs from 'dayjs';
import { sortData } from 'utils/helpers';
import { env } from 'utils/constants';
import drawer from 'drawerjs';
import { findApprovals } from './transformData';
import DataList from './DataList';
import styles from './OpenApprovalsBoard.module.scss';
import { checkDateFilter } from './data';

function OpenApprovalsBoardModule() {
  const sortingRef = useRef();
  const stages = drawer.get('stages');
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
  });
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
    const res = await getAllOpenApprovals();
    const transformed = findApprovals(res);
    setLoading(false);
    const sortKeys = Object.keys(sortingRef.current || {});
    sortBy(transformed, (sortKeys || [])[0] || 'maxApproved', sortingRef.current?.type || 'number', !isLoading);
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
      if (filter.client) {
        filterResp.push(deal.client?.toLowerCase()?.includes(filter.client.toLowerCase()));
      }
      if (filter.amountMin) {
        filterResp.push(Number(deal.maxApproved) >= Number(filter.amountMin));
      }
      if (filter.amountMax) {
        filterResp.push(Number(deal.maxApproved) <= Number(filter.amountMax));
      }
      if (filter.phone) {
        filterResp.push(deal.phone_local?.toLowerCase()?.includes(filter.phone.toLowerCase()));
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
          {dayjs().subtract(7, 'days').format('DD MMM YYYY')}
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
        stages={stages}
      />
    </Flex>
  );
}

export default OpenApprovalsBoardModule;
