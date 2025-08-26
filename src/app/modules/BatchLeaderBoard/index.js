/* eslint-disable */
import {
  Avatar,
  DatePicker,
  Flex,
  Spin,
  Progress,
  Typography,
} from 'antd';
import {
  fetchBoardColorColumnStrings, fetchAllUsers,
} from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import { env } from 'utils/constants';
import monday from 'utils/mondaySdk';
import SelectField from 'app/components/Forms/SelectField';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { customSort, numberWithCommas } from 'utils/helpers';
import {
  fetchLeadersBoardEmployees, 
  getAllLeadsAssignedBatch,
  getAllAssignedLeadsDealsBatch,
  getDealFundsBatch,
  getDisqualifiedLeadsDealsBatch,
  getTeamTotalActivitiesBatch,
} from './queries';
import {
  actionTypesList, actionTypesTitles, conversions, mergeTeamData,
} from './data';
import styles from './LeaderBoards.module.scss';

const { RangePicker } = DatePicker;
const { Text } = Typography;

function BatchLeaderBoardModule({ withFilter }) {
  let unsubscribe;
  let timeoutId;
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const dateR = useRef();
  const [actionTypes, setActionTypes] = useState([]);
  const [leadsData, setleadsData] = useState([]);
  const [totalLeadsData, setTotalleadsData] = useState({});
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

  const fetchWithRetry = async (fetchFunction, weekBatch, employees, actionIds = null, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = actionIds 
          ? await fetchFunction(weekBatch, actionIds, employees)
          : await fetchFunction(weekBatch, employees);
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
    return {}; // Return empty object if all retries fail
  };

  const mergeDataResults = (existing, newData, key) => {
    const merged = { ...existing };
    
    if (key === 'leadsAssigned') {
      // For leads assigned, merge the count and person data
      Object.keys(newData).forEach((employeeId) => {
        if (!merged[employeeId]) {
          merged[employeeId] = { count: 0, person: null };
        }
        if (newData[employeeId].count) {
          merged[employeeId].count = (merged[employeeId].count || 0) + newData[employeeId].count;
          merged[employeeId].person = newData[employeeId].person || merged[employeeId].person;
        }
      });
    } else if (key === 'allLeadsAssigned' || key === 'allLeadsDisqualified') {
      // For simple counts, newData is { employeeId: count }
      Object.keys(newData).forEach((employeeId) => {
        merged[employeeId] = (merged[employeeId] || 0) + (newData[employeeId] || 0);
      });
    } else if (key === 'dealsFunded') {
      // For deals funded, merge the complex object
      Object.keys(newData).forEach((employeeId) => {
        if (!merged[employeeId]) {
          merged[employeeId] = {
            totalfunds: 0,
            'fully funded': 0,
            totalDaysDifference: 0,
            totalDeals: 0,
            person: null,
          };
        }
        const existingDeals = merged[employeeId];
        const newDeals = newData[employeeId];
        
        if (newDeals) {
          merged[employeeId].totalfunds = (existingDeals.totalfunds || 0) + (newDeals.totalfunds || 0);
          merged[employeeId]['fully funded'] = (existingDeals['fully funded'] || 0) + (newDeals['fully funded'] || 0);
          merged[employeeId].totalDaysDifference = (existingDeals.totalDaysDifference || 0) + (newDeals.totalDaysDifference || 0);
          merged[employeeId].totalDeals = (existingDeals.totalDeals || 0) + (newDeals.totalDeals || 0);
          merged[employeeId].person = newDeals.person || existingDeals.person;
          
          // Recalculate averages
          if (merged[employeeId].totalDeals > 0) {
            merged[employeeId].averageFunds = (merged[employeeId].totalfunds / merged[employeeId].totalDeals).toFixed(2);
            merged[employeeId].averageDaysDifference = Math.round(merged[employeeId].totalDaysDifference / merged[employeeId].totalDeals);
          }
        }
      });
    } else if (key === 'activities') {
      // For activities, merge each activity type
      Object.keys(newData).forEach((employeeId) => {
        if (!merged[employeeId]) {
          merged[employeeId] = {};
        }
        const existingActivities = merged[employeeId];
        const newActivities = newData[employeeId];
        
        if (newActivities) {
          Object.keys(newActivities).forEach((activityType) => {
            if (activityType !== 'person') {
              existingActivities[activityType] = (existingActivities[activityType] || 0) + newActivities[activityType];
            }
          });
          existingActivities.person = newActivities.person || existingActivities.person;
        }
      });
    }
    
    return merged;
  };

  const getEmployeeList = async () => {
    const res = await fetchLeadersBoardEmployees();
    setEmployees(res);
    if (withFilter) {
      const mapUsers = res?.map((u) => (u.id));
      setSelectedUsers(mapUsers);
    }
  };

  const fetchDataInBatches = async (dates, employeesList) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setFetchProgress(null);

    // Get action types first
    const res = await fetchBoardColorColumnStrings(env.boards.salesActivities, 'status');
    const actions = Object.values(res).reduce((prev, curr) => {
      prev[curr.toLowerCase()] = curr.toLowerCase();
      return prev;
    }, {});
    const lowercaseActionsList = actionTypesList.map((t) => t.toLowerCase());
    const sortedList = customSort(Object.keys(actions), lowercaseActionsList, true);
    setActionTypes(sortedList);
    const actionIds = Object.keys(res)
      .filter((key) => (actionTypesList.includes(res[key])));

    const weeklyBatches = splitIntoWeeklyBatches(dates[0], dates[1]);
    const batchChunks = groupBatchesIntoChunks(weeklyBatches, 5);

    let allLeadsAssignedData = {};
    let allDealsFundedData = {};
    let allLeadsDealsTotalData = {};
    let allDisqualifiedData = {};
    let allActivitiesData = {};
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

        // Process each week in the chunk
        const chunkPromises = chunk.map(async (weekBatch) => {
          // Fetch all data types in parallel for this week
          const [leadsAssigned, dealsFunded, allLeadsDeals, disqualified, activities] = await Promise.all([
            fetchWithRetry(getAllLeadsAssignedBatch, weekBatch, employeesList),
            fetchWithRetry(getDealFundsBatch, weekBatch, employeesList),
            fetchWithRetry(getAllAssignedLeadsDealsBatch, weekBatch, employeesList),
            fetchWithRetry(getDisqualifiedLeadsDealsBatch, weekBatch, employeesList),
            fetchWithRetry(getTeamTotalActivitiesBatch, weekBatch, employeesList, actionIds),
          ]);

          // Merge results
          allLeadsAssignedData = mergeDataResults(allLeadsAssignedData, leadsAssigned, 'leadsAssigned');
          allDealsFundedData = mergeDataResults(allDealsFundedData, dealsFunded, 'dealsFunded');
          allLeadsDealsTotalData = mergeDataResults(allLeadsDealsTotalData, allLeadsDeals, 'allLeadsAssigned');
          allDisqualifiedData = mergeDataResults(allDisqualifiedData, disqualified, 'allLeadsDisqualified');
          allActivitiesData = mergeDataResults(allActivitiesData, activities, 'activities');

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

          // Update UI with merged data
          const mergedFinalData = mergeTeamData(
            allLeadsAssignedData,
            allDealsFundedData,
            allLeadsDealsTotalData,
            allDisqualifiedData,
            allActivitiesData,
            employeesList,
          );
          setleadsData(mergedFinalData);
        });

        // Wait for all weeks in this chunk to complete
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(chunkPromises);

        // Wait 5 seconds before processing next chunk
        if (chunkIndex < batchChunks.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(10000);
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

  const getUsers = async () => {
    const res = await fetchAllUsers();
    const mapUsers = res?.map((u) => ({
      value: u.id,
      label: u.name,
    }));
    setUsers(res);
    setUsersOptions(mapUsers);
  };

  useEffect(() => {
    getEmployeeList();
    dateR.current = [dayjs(), dayjs()];
    if (withFilter) getUsers();
  }, []);

  useEffect(() => {
    if (employees.length === 0) return;
    fetchDataInBatches(dateRange, employees);
  }, [employees, dateRange]);

  const refetchData = () => {
    fetchDataInBatches(dateRange, employees);
  };

  const refetchEmployee = ({ data }) => {
    if (data.itemIds.includes(Number(env.leaderEmployeeItemId))) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        getEmployeeList();
      }, 1000 * 3);
    }
  };

  useEffect(() => {
    if (withFilter) return null;
    unsubscribe = monday.listen('events', refetchEmployee);
    return () => {
      if (!unsubscribe) return;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (withFilter) return null;
    const intervalId = setInterval(
      () => { refetchData(dateR.current); }
      , (1000 * env.performanceRefetchTime),
    );
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleChangeUser = (val) => {
    const usersData = users.filter((u) => val.includes(u.id));
    setEmployees(usersData);
    setSelectedUsers(val);
  };

  const handleChangeDates = (val) => {
    setDateRange(val);
    dateR.current = val;
  };

  const getTotalLeadsData = () => {
    const totalLeads = employees.reduce((acc, emp) => {
      const empData = leadsData[emp.id] || {};
      acc.allLeadsAssigned += empData.allLeadsAssigned || 0;
      acc.leadsAssigned += empData.leadsAssigned || 0;
      acc.allLeadsDisqualified += empData.allLeadsDisqualified || 0;
      for (let i = 0; i < actionTypes.length; i += 1) {
        const action = actionTypes[i];
        if (!acc[action]) acc[action] = 0;
        acc[action] += empData[action] ? Number(empData[action]) : 0;
      }
      acc.conversionRatio += Number(empData.conversionRatio) || 0;
      acc.averageFunds += Number(empData.averageFunds) || 0;
      acc.averageDaysDifference += empData.averageDaysDifference || 0;
      return acc;
    }, {
      allLeadsAssigned: 0,
      leadsAssigned: 0,
      allLeadsDisqualified: 0,
      conversionRatio: 0,
      averageFunds: 0,
      averageDaysDifference: 0,
    });
    const totalCount = employees.length;
    const totalLeadsDataObj = {
      ...totalLeads,
      allLeadsAssigned: totalLeads.allLeadsAssigned,
      leadsAssigned: totalLeads.leadsAssigned,
      allLeadsDisqualified: totalLeads.allLeadsDisqualified,
      conversionRatio: totalLeads.conversionRatio
        ? (totalLeads.conversionRatio / totalCount).toFixed(2) : 0,
      averageFunds: (totalLeads.averageFunds).toFixed(2),
      averageDaysDifference: (totalLeads.averageDaysDifference / totalCount).toFixed(2),
    };
    setTotalleadsData(totalLeadsDataObj);
  };

  useEffect(() => {
    if (employees.length === 0) { setTotalleadsData({}); return; }
    getTotalLeadsData();
  }, [employees, leadsData]);

  return (
    <Flex vertical flex={1}>
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

      <Spin tip="Fetching Data..." spinning={loading} fullscreen />
      {!withFilter ? null : (
        <Flex className={styles.filterbar} align="center">
          <Flex>Filters: </Flex>
          <Flex className={styles.filterField}>
            <SelectField
              classnames={styles.usersList}
              options={usersOptions}
              onChange={handleChangeUser}
              mode="multiple"
              maxTagCount={3}
              placeholder="Select Users"
              value={selectedUsers}
            />
          </Flex>
          <Flex className={styles.filterField}>
            <RangePicker
              value={dateRange}
              placeholder="Select Date Range"
              onChange={handleChangeDates}
              allowClear={false}
              maxDate={dayjs()}
              format="MM-DD-YYYY"
            />
          </Flex>
        </Flex>
      )}
      <Flex vertical className={styles.table}>
        <Flex className={styles.headerRow} align="center">
          <Flex className={styles.headerColumnTitle}>Performance Leaderboard</Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['total leads assigned']}</Flex>
          </Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['leads assigned']}</Flex>
          </Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['disqualified leads']}</Flex>
          </Flex>
          {actionTypes.map((actions) => (
            <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
              <Flex>{actionTypesTitles[actions]}</Flex>
            </Flex>
          ))}
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['conversion ratio']}</Flex>
          </Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['avg deal size']}</Flex>
          </Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['avg time to fund']}</Flex>
          </Flex>
        </Flex>
        <Flex className={classNames(styles.dataRow)} style={{ backgroundColor: '#1a4049', color: 'white' }}>
          <Flex className={styles.dataColumnTitle} align="center">
            <Flex style={{ marginRight: 10 }}>
              <Avatar>T</Avatar>
            </Flex>
            <Flex>Totals</Flex>
          </Flex>
          <Flex className={styles.dataColumnPerson} justify="center" align="center">
            {totalLeadsData.allLeadsAssigned || ' '}
          </Flex>
          <Flex className={styles.dataColumnPerson} justify="center" align="center">
            {totalLeadsData.leadsAssigned || ' '}
          </Flex>
          <Flex className={styles.dataColumnPerson} justify="center" align="center">
            {totalLeadsData.allLeadsDisqualified || ' '}
          </Flex>
          {actionTypes.map((action) => (
            <Flex className={styles.dataColumnPerson} justify="center" align="center" vertical>
              <Flex>{totalLeadsData[action] || ' '}</Flex>
            </Flex>
          ))}
          <Flex className={styles.dataColumnPerson} justify="center" align="center">
            {totalLeadsData.conversionRatio || ' '}
            {totalLeadsData.conversionRatio ? '%' : ''}
          </Flex>
          <Flex className={styles.dataColumnPerson} justify="center" align="center">
            $
            {numberWithCommas(totalLeadsData.averageFunds || '0')}
          </Flex>
          <Flex className={styles.dataColumnPerson} justify="center" align="center">
            {totalLeadsData.averageDaysDifference || '0'}
          </Flex>
        </Flex>
        {employees.map((emp, index) => (
          <Flex className={classNames(styles.dataRow, { [styles.alternateColor]: index % 2 })}>
            <Flex className={styles.dataColumnTitle} align="center">
              <Flex style={{ marginRight: 10 }}>
                {emp.photo_thumb
                  ? <Avatar src={emp.photo_thumb} />
                  : <Avatar>{emp.name[0]}</Avatar>}
              </Flex>
              <Flex>{emp.name.split(' ')[0]}</Flex>
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {(leadsData[emp.id] || {}).allLeadsAssigned || ' '}
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {(leadsData[emp.id] || {}).leadsAssigned || ' '}
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {(leadsData[emp.id] || {}).allLeadsDisqualified || ' '}
            </Flex>
            {actionTypes.map((actions) => {
              const prevAction = conversions[actions];
              const prev = prevAction === 'leads assigned' ? (leadsData[emp.id] || {}).leadsAssigned : (leadsData[emp.id] || {})[prevAction];
              const curr = (leadsData[emp.id] || {})[actions];
              const percentage = (prev && curr) ? ((curr / prev) * 100).toFixed(0) : '';
              return (
                <Flex className={styles.dataColumnPerson} justify="center" align="center" vertical>
                  <Flex>{(leadsData[emp.id] || {})[actions] || ' '}</Flex>
                  <Flex className={styles.percentage}>{percentage ? `${percentage}%` : ''}</Flex>
                </Flex>
              );
            })}
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {(leadsData[emp.id] || {}).conversionRatio || ' '}
              {(leadsData[emp.id] || {}).conversionRatio ? '%' : ''}
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              $
              {numberWithCommas((leadsData[emp.id] || {}).totalfunds || '0')}
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {(leadsData[emp.id] || {}).averageDaysDifference || '0'}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default BatchLeaderBoardModule;
