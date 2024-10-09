import {
  Flex,
  Spin,
} from 'antd';
import { useEffect, useState, useRef } from 'react';
import { getAllApprovals } from 'app/apis/query';
import dayjs from 'dayjs';
import { sortData } from 'utils/helpers';
import { env } from 'utils/constants';
import { findApprovals } from './transformData';
import DataList from './DataList';
import styles from './ApprovalsBoard.module.scss';

function ApprovalsBoardModule() {
  const sortingRef = useRef();
  const [data, setData] = useState([]);
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
  return (
    <Flex flex={1} vertical>
      <Spin tip="Fetching Data..." spinning={loading} fullscreen />
      <Flex justify="center">
        <Flex className={styles.headingCount}>
          {data.length}
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
      <DataList data={data} sortBy={sortBy} sorting={sorting} />
    </Flex>
  );
}

export default ApprovalsBoardModule;
