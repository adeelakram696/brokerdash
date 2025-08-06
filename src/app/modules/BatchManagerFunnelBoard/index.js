/* eslint-disable */
import {
  DatePicker,
  Flex,
  Spin,
  Progress,
  Typography,
} from 'antd';
import { useRef, useState, useEffect } from 'react';
import { fetchUser, fetchUsers } from 'app/apis/query';
import dayjs from 'dayjs';
import SelectField from 'app/components/Forms/SelectField';
import classNames from 'classnames';
import { getThisWeekLeadsDeals } from './queries';
import styles from './ManagerFunnelBoard.module.scss';
import FunnelChart from './Funnel';
import { transformToFunnel } from './transformData';
import DataList from './DataList';
import { durations, durationsDates } from './data';

const { RangePicker } = DatePicker;
const { Text } = Typography;

function BatchManagerFunnelBoardModule({ isUser }) {
  const [data, setData] = useState({});
  const me = fetchUser();
  const [selectedStageData, setSelectedStageData] = useState({
    stage: 'New Leads',
    number: data.new?.length,
    data: data?.new,
  });
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(isUser ? me.id : null);
  const [dateRange, setDateRange] = useState(durationsDates.thisWeek);
  const [duration, setDuration] = useState(['thisWeek']);
  const [loading, setLoading] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(null);
  const abortControllerRef = useRef(null);
  const splitIntoWeeklyBatches = (startDate, endDate) => {
    const batches = [];
    let currentStart = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentStart.isBefore(end) || currentStart.isSame(end)) {
      const currentEnd = currentStart.add(6, 'day');
      const batchEnd = currentEnd.isAfter(end) ? end : currentEnd;

      batches.push([currentStart, batchEnd]);
      currentStart = batchEnd.add(1, 'day');
    }

    return batches;
  };

  const groupBatchesIntoChunks = (batches, chunkSize = 5) => {
    const chunks = [];
    for (let i = 0; i < batches.length; i += chunkSize) {
      chunks.push(batches.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

  const fetchWithRetry = async (weekBatch, user, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await getThisWeekLeadsDeals(weekBatch, user);
        return result;
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt} failed for dates ${weekBatch[0].format('MM/DD')} - ${weekBatch[1].format('MM/DD')}:`, error);
        
        if (attempt < maxRetries) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(2000 * attempt); // Exponential backoff: 2s, 4s, 6s
        }
      }
    }
    
    console.error(`All ${maxRetries} attempts failed for dates ${weekBatch[0].format('MM/DD')} - ${weekBatch[1].format('MM/DD')}:`, lastError);
    return []; // Return empty array if all retries fail
  };

  const fetchDataInBatches = async (dates, user) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setFetchProgress(null);

    const weeklyBatches = splitIntoWeeklyBatches(dates[0], dates[1]);
    const batchChunks = groupBatchesIntoChunks(weeklyBatches, 5);

    let allData = [];
    let completedWeeks = 0;
    let isFirstBatch = true;

    try {
      for (let chunkIndex = 0; chunkIndex < batchChunks.length; chunkIndex += 1) {
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        const chunk = batchChunks[chunkIndex];
        
        // Set up progress before starting the chunk
        if (!isFirstBatch || chunkIndex > 0) {
          setFetchProgress({
            totalWeeks: weeklyBatches.length,
            completedWeeks,
            currentDateRange: `Processing: ${chunk[0][0].format('MM/DD')} to ${chunk[chunk.length - 1][1].format('MM/DD/YYYY')}`,
            percentComplete: Math.round((completedWeeks / weeklyBatches.length) * 100),
          });
        }

        // Process each week in the chunk individually with retry
        const chunkPromises = chunk.map(async (weekBatch, index) => {
          const result = await fetchWithRetry(weekBatch, user);
          
          // Update data as each week completes
          if (result && result.length > 0) {
            allData = [...allData, ...result];
          }
          
          completedWeeks += 1;
          
          // After first week of first batch, hide loader
          if (isFirstBatch) {
            setLoading(false);
            isFirstBatch = false;
          }
          
          const percentComplete = Math.round((completedWeeks / weeklyBatches.length) * 100);
          
          setFetchProgress({
            totalWeeks: weeklyBatches.length,
            completedWeeks,
            currentDateRange: `Fetched: ${dates[0].format('MM/DD')} to ${weekBatch[1].format('MM/DD/YYYY')}`,
            percentComplete,
          });
          
          // Update UI with new data (even if this week had no data)
          const mergedData = mergeAndTransformData(allData, dates);
          setData(mergedData);
          
          return result;
        });

        // Wait for all weeks in this chunk to complete
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(chunkPromises);

        // Wait 5 seconds before processing next chunk
        if (chunkIndex < batchChunks.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(5000);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching data in batches:', error);
      }
    } finally {
      setLoading(false);
      if (!abortControllerRef.current.signal.aborted) {
        // Keep progress visible for 2 seconds after completion
        setTimeout(() => {
          if (!abortControllerRef.current.signal.aborted) {
            setFetchProgress(null);
          }
        }, 2000);
      }
    }
  };

  const mergeAndTransformData = (rawData, dates) => {
    const uniqueData = Array.from(
      new Map(rawData.map((item) => [item.id, item])).values(),
    );

    return transformToFunnel(uniqueData, dates, false);
  };
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchDataInBatches(dateRange, selectedUser);
    }
  }, [dateRange, selectedUser]);
  const handleChangeDates = (val) => {
    if (val && val[0] && val[1]) {
      setDateRange(val);
    }
  };
  const handleRangeDates = (val) => {
    const newDateRange = durationsDates[val];
    setDateRange(newDateRange);
    setDuration(val);
  };
  const getUsersList = async () => {
    const res = await fetchUsers();
    const list = (res || []).map((u) => ({
      label: u.name,
      value: u.id,
    }));
    setUsersList(list);
  };
  useEffect(() => {
    if (!isUser) getUsersList();
  }, []);
  return (
    <Flex flex={1} vertical>
      {fetchProgress && (
        <Flex
          style={{
            padding: '16px',
            background: '#f0f2f5',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
          vertical
          gap={8}
        >
          <Flex justify="space-between" align="center">
            <Text strong>Fetching Data Progress</Text>
            <Text>{`${fetchProgress.completedWeeks} / ${fetchProgress.totalWeeks} weeks completed`}</Text>
          </Flex>
          <Progress
            percent={fetchProgress.percentComplete}
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {fetchProgress.currentDateRange}
          </Text>
        </Flex>
      )}

      <Flex flex={1}>
        <Spin tip="Fetching Data..." spinning={loading} fullscreen />
        <Flex flex={0.3} className={styles.leftCol} vertical>
          <Flex justify="flex-end">
            {!isUser ? (
              <Flex className={styles.filterField}>
                <SelectField
                  classnames={classNames(styles.durations, 'funnelFilterField')}
                  options={usersList}
                  onChange={setSelectedUser}
                  placeholder="Users"
                  value={selectedUser}
                  allowClear
                />
              </Flex>
            ) : null}
            <Flex className={styles.filterField}>
              <SelectField
                classnames={classNames(styles.durations, 'funnelFilterField')}
                options={durations}
                onChange={handleRangeDates}
                placeholder="Select Duration"
                value={duration}
              />
            </Flex>
            <Flex className={styles.filterField}>
              <RangePicker
                className={classNames(styles.filterFieldDatePicker, 'funnelFilterField')}
                value={dateRange}
                placeholder="Select Date Range"
                onChange={handleChangeDates}
                allowClear={false}
                maxDate={dayjs()}
                format="MM-DD-YYYY"
              />
            </Flex>
          </Flex>
          <Flex className={styles.funnelChart}>
            <FunnelChart
              data={data}
              setSelectedStageData={setSelectedStageData}
              selectedStageData={selectedStageData}
            />
          </Flex>
        </Flex>
        <Flex flex={0.7} className={styles.dataTable}>
          <DataList data={selectedStageData} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default BatchManagerFunnelBoardModule;
