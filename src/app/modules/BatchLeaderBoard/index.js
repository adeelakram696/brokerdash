/* eslint-disable */
import {
  Avatar,
  DatePicker,
  Flex,
  Spin,
  Progress,
  Typography,
  Button,
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
  const [fetchErrors, setFetchErrors] = useState([]);
  const abortControllerRef = useRef(null);
  
  // Cache for storing fetched data by week and employees
  const dataCache = useRef(new Map());

  // Generate a unique cache key for a week batch and employees combination
  const generateCacheKey = (weekBatch, employeesList) => {
    const weekKey = `${weekBatch[0].format('YYYY-MM-DD')}_${weekBatch[1].format('YYYY-MM-DD')}`;
    const employeeIds = employeesList.map(emp => emp.id).sort().join(',');
    return `${weekKey}_${employeeIds}`;
  };

  // Check if cache has data for the given key and it's not expired (24 hours)
  const getCachedData = (cacheKey) => {
    const cached = dataCache.current.get(cacheKey);
    if (cached) {
      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (cacheAge < maxCacheAge) {
        console.log(`Using cached data for key: ${cacheKey}`);
        return cached.data;
      }
      // Remove expired cache
      dataCache.current.delete(cacheKey);
    }
    return null;
  };

  // Store data in cache
  const setCachedData = (cacheKey, data) => {
    dataCache.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
    console.log(`Cached data for key: ${cacheKey}`);
  };

  // Clear all cached data (useful when switching users or for manual refresh)
  const clearCache = () => {
    dataCache.current.clear();
    console.log('Cache cleared');
  };

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


  const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

  // Check if error is 429
  const is429Error = (error) => {
    return error?.response?.status === 429 || 
           error?.message?.includes('429') || 
           error?.message?.toLowerCase().includes('complexity') ||
           error?.message?.toLowerCase().includes('rate limit');
  };

  // Fetch a single API with basic error handling (no retry here)
  const fetchSingle = async (fetchFunction, weekBatch, employees, actionIds = null) => {
    try {
      const result = actionIds 
        ? await fetchFunction(weekBatch, actionIds, employees)
        : await fetchFunction(weekBatch, employees);
      return { success: true, data: result };
    } catch (error) {
      if (is429Error(error)) {
        console.log('API complexity exhausted (429 error detected)');
        return { success: false, is429: true, error };
      }
      return { success: false, is429: false, error };
    }
  };

  // Fetch all APIs for a batch with retry logic at batch level
  const fetchBatchWithRetry = async (weekBatch, employeesList, actionIds, maxRetries = 3) => {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      attempt += 1;
      console.log(`Fetching batch for ${weekBatch[0].format('MM/DD')} - ${weekBatch[1].format('MM/DD')} (Attempt ${attempt}/${maxRetries})`);
      
      // Try to fetch all APIs for this batch
      const leadsResult = await fetchSingle(getAllLeadsAssignedBatch, weekBatch, employeesList);
      if (leadsResult.is429) {
        console.log('429 error on leads API, will retry entire batch after 25 seconds...');
        if (attempt < maxRetries) {
          setFetchProgress(prev => ({
            ...prev,
            currentDateRange: `⏳ API limit reached. Waiting 25s before retrying batch... (Attempt ${attempt}/${maxRetries})`,
          }));
          // eslint-disable-next-line no-await-in-loop
          await sleep(25000);
          continue; // Retry the entire batch
        }
        // Failed after all retries
        return { error: '429', message: 'API complexity exhausted' };
      }
      
      // eslint-disable-next-line no-await-in-loop
      await sleep(200);
      
      const dealsResult = await fetchSingle(getDealFundsBatch, weekBatch, employeesList);
      if (dealsResult.is429) {
        console.log('429 error on deals API, will retry entire batch after 25 seconds...');
        if (attempt < maxRetries) {
          setFetchProgress(prev => ({
            ...prev,
            currentDateRange: `⏳ API limit reached. Waiting 25s before retrying batch... (Attempt ${attempt}/${maxRetries})`,
          }));
          // eslint-disable-next-line no-await-in-loop
          await sleep(25000);
          continue; // Retry the entire batch
        }
        return { error: '429', message: 'API complexity exhausted' };
      }
      
      // eslint-disable-next-line no-await-in-loop
      await sleep(200);
      
      const allLeadsDealsResult = await fetchSingle(getAllAssignedLeadsDealsBatch, weekBatch, employeesList);
      if (allLeadsDealsResult.is429) {
        console.log('429 error on allLeadsDeals API, will retry entire batch after 25 seconds...');
        if (attempt < maxRetries) {
          setFetchProgress(prev => ({
            ...prev,
            currentDateRange: `⏳ API limit reached. Waiting 25s before retrying batch... (Attempt ${attempt}/${maxRetries})`,
          }));
          // eslint-disable-next-line no-await-in-loop
          await sleep(25000);
          continue; // Retry the entire batch
        }
        return { error: '429', message: 'API complexity exhausted' };
      }
      
      // eslint-disable-next-line no-await-in-loop
      await sleep(200);
      
      const disqualifiedResult = await fetchSingle(getDisqualifiedLeadsDealsBatch, weekBatch, employeesList);
      if (disqualifiedResult.is429) {
        console.log('429 error on disqualified API, will retry entire batch after 25 seconds...');
        if (attempt < maxRetries) {
          setFetchProgress(prev => ({
            ...prev,
            currentDateRange: `⏳ API limit reached. Waiting 25s before retrying batch... (Attempt ${attempt}/${maxRetries})`,
          }));
          // eslint-disable-next-line no-await-in-loop
          await sleep(25000);
          continue; // Retry the entire batch
        }
        return { error: '429', message: 'API complexity exhausted' };
      }
      
      // eslint-disable-next-line no-await-in-loop
      await sleep(200);
      
      const activitiesResult = await fetchSingle(getTeamTotalActivitiesBatch, weekBatch, employeesList, actionIds);
      if (activitiesResult.is429) {
        console.log('429 error on activities API, will retry entire batch after 25 seconds...');
        if (attempt < maxRetries) {
          setFetchProgress(prev => ({
            ...prev,
            currentDateRange: `⏳ API limit reached. Waiting 25s before retrying batch... (Attempt ${attempt}/${maxRetries})`,
          }));
          // eslint-disable-next-line no-await-in-loop
          await sleep(25000);
          continue; // Retry the entire batch
        }
        return { error: '429', message: 'API complexity exhausted' };
      }
      
      // If we got here, all APIs succeeded
      return {
        leadsAssigned: leadsResult.data,
        dealsFunded: dealsResult.data,
        allLeadsDeals: allLeadsDealsResult.data,
        disqualified: disqualifiedResult.data,
        activities: activitiesResult.data,
      };
    }
    
    return { error: 'unknown', message: 'Failed to fetch batch after all retries' };
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
    setFetchErrors([]);

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

    let allLeadsAssignedData = {};
    let allDealsFundedData = {};
    let allLeadsDealsTotalData = {};
    let allDisqualifiedData = {};
    let allActivitiesData = {};
    let completedWeeks = 0;
    let isFirstBatch = true;

    const failedBatches = [];
    
    try {
      // Process batches sequentially, not in chunks
      for (let batchIndex = 0; batchIndex < weeklyBatches.length; batchIndex += 1) {
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        const weekBatch = weeklyBatches[batchIndex];
        
        // Set up progress before starting the batch
        setFetchProgress({
          totalWeeks: weeklyBatches.length,
          completedWeeks,
          currentDateRange: `Processing: ${weekBatch[0].format('MM/DD')} to ${weekBatch[1].format('MM/DD/YYYY')}`,
          percentComplete: Math.round((completedWeeks / weeklyBatches.length) * 100),
        });
        // Generate cache key for this week and employees
        const cacheKey = generateCacheKey(weekBatch, employeesList);
        
        // Check if we have cached data for this week
        const cachedWeekData = getCachedData(cacheKey);
        
        let batchData;
        
        if (cachedWeekData) {
          // Use cached data
          batchData = cachedWeekData;
          console.log(`Using cached data for ${weekBatch[0].format('MM/DD')} - ${weekBatch[1].format('MM/DD')}`);
        } else {
          // Fetch all data for this batch with batch-level retry
          // eslint-disable-next-line no-await-in-loop
          batchData = await fetchBatchWithRetry(weekBatch, employeesList, actionIds);
          
          if (batchData?.error) {
            const errorMsg = batchData.error === '429' 
              ? `Week ${weekBatch[0].format('MM/DD')} - ${weekBatch[1].format('MM/DD')}: API complexity exhausted, some data not fetched`
              : `Week ${weekBatch[0].format('MM/DD')} - ${weekBatch[1].format('MM/DD')}: ${batchData.message}`;
            
            console.error(errorMsg);
            failedBatches.push(errorMsg);
            
            // Update error state to show to user
            setFetchErrors(prev => [...prev, errorMsg]);
            
            // Continue to next batch even if this one failed
            completedWeeks += 1;
            continue;
          }
          
          // Cache the successfully fetched data for this week
          setCachedData(cacheKey, batchData);
        }

        // Merge results if we have valid data
        if (batchData && !batchData.error) {
          allLeadsAssignedData = mergeDataResults(allLeadsAssignedData, batchData.leadsAssigned, 'leadsAssigned');
          allDealsFundedData = mergeDataResults(allDealsFundedData, batchData.dealsFunded, 'dealsFunded');
          allLeadsDealsTotalData = mergeDataResults(allLeadsDealsTotalData, batchData.allLeadsDeals, 'allLeadsAssigned');
          allDisqualifiedData = mergeDataResults(allDisqualifiedData, batchData.disqualified, 'allLeadsDisqualified');
          allActivitiesData = mergeDataResults(allActivitiesData, batchData.activities, 'activities');
        }

        completedWeeks += 1;

        // After first week, hide loader
        if (isFirstBatch) {
          setLoading(false);
          isFirstBatch = false;
        }

        const percentComplete = Math.round((completedWeeks / weeklyBatches.length) * 100);

        setFetchProgress({
          totalWeeks: weeklyBatches.length,
          completedWeeks,
          currentDateRange: cachedWeekData 
            ? `Using cached: ${weekBatch[0].format('MM/DD')} to ${weekBatch[1].format('MM/DD/YYYY')}`
            : `Fetched: ${weekBatch[0].format('MM/DD')} to ${weekBatch[1].format('MM/DD/YYYY')}`,
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

        // Wait before processing next batch to avoid overloading API
        if (batchIndex < weeklyBatches.length - 1) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(1000);
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
      {fetchErrors.length > 0 && (
        <Flex
          style={{
            padding: '16px',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
          vertical
          gap={8}
        >
          <Text strong style={{ color: '#cf1322' }}>Some data could not be fetched:</Text>
          {fetchErrors.map((error, index) => (
            <Text key={index} type="danger" style={{ fontSize: '12px' }}>
              • {error}
            </Text>
          ))}
        </Flex>
      )}
      
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
          <Flex className={styles.filterField}>
            <Button 
              onClick={() => {
                clearCache();
                fetchDataInBatches(dateRange, employees);
              }}
              size="small"
            >
              Clear Cache
            </Button>
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
