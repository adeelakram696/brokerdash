import {
  Avatar,
  DatePicker,
  Flex,
  Spin,
} from 'antd';
import { fetchUser } from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import { env } from 'utils/constants';
import SelectField from 'app/components/Forms/SelectField';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { numberWithCommas } from 'utils/helpers';
import { fetchBrokerUsers, fetchManagerLeaderBoard, fetchUsersByIds } from './apis';
import { actionTypesTitles, actionTypesList } from './data';
import styles from './LeaderBoards.module.scss';

const { RangePicker } = DatePicker;

function ManagerLeaderBoardModule({ withFilter = true }) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const dateR = useRef();
  const [leadsData, setLeadsData] = useState({});
  const [totalLeadsData, setTotalLeadsData] = useState({});
  // Initialize with default action types to ensure columns are always visible
  const [actionTypes, setActionTypes] = useState(actionTypesList.map((t) => t.toLowerCase()));
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
      setEmployees(users || []);

      const list = (users || []).map((u) => ({
        label: u.name,
        value: u.id,
      }));
      setUsersOptions(list);
      setSelectedUsers(userIds);

      // Then, fetch leaderboard data for all users
      // Use dateR.current to get the most recent date range
      const currentDateRange = dateR.current || dateRange;
      const dateArray = currentDateRange.map((date) => date.format('YYYY-MM-DD'));
      const res = await fetchManagerLeaderBoard(userIds, dateArray);
      setLeadsData(res);

      // Always use the predefined action types list to ensure columns are always shown
      const lowercaseActionTypesList = actionTypesList.map((t) => t.toLowerCase());
      setActionTypes(lowercaseActionTypesList);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching manager leaderboard:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    dateR.current = [dayjs(), dayjs()];
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) return;
    fetchData();
  }, [dateRange]);

  useEffect(() => {
    const intervalId = setInterval(
      () => { fetchData(false); },
      (1000 * env.ApiIntervalTime),
    );
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleChangeUser = async (val) => {
    setSelectedUsers(val);
    setLoading(true);
    try {
      const users = await fetchUsersByIds(val);
      setEmployees(users || []);

      const currentDateRange = dateR.current || dateRange;
      const dateArray = currentDateRange.map((date) => date.format('YYYY-MM-DD'));
      const res = await fetchManagerLeaderBoard(val, dateArray);
      setLeadsData(res);

      // Always use the predefined action types list to ensure columns are always shown
      const lowercaseActionTypesList = actionTypesList.map((t) => t.toLowerCase());
      setActionTypes(lowercaseActionTypesList);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching manager leaderboard:', error);
      setLoading(false);
    }
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
      acc.conversionRatio += Number(empData.conversionRatio) || 0;

      const dealsFunded = empData.dealsFunded || {};
      acc.totalFunds += Number(dealsFunded.totalAmount) || 0;
      acc.totalDeals += Number(dealsFunded.count) || 0;
      acc.averageFunds += Number(dealsFunded.averageFunds) || 0;
      acc.averageDaysDifference += Number(dealsFunded.averageDaysDifference) || 0;

      // Add action types totals (handle case-insensitive matching)
      actionTypes.forEach((action) => {
        if (!acc[action]) acc[action] = 0;
        // Special handling for "fully funded" -
        // it should come from the action data, not dealsFunded
        const matchingKey = Object.keys(empData).find((key) => key.toLowerCase() === action);
        acc[action] += matchingKey ? (empData[matchingKey] || 0) : 0;
      });

      return acc;
    }, {
      allLeadsAssigned: 0,
      leadsAssigned: 0,
      allLeadsDisqualified: 0,
      conversionRatio: 0,
      totalFunds: 0,
      totalDeals: 0,
      averageFunds: 0,
      averageDaysDifference: 0,
    });

    const totalCount = employees.length || 1;
    const totalLeadsDataObj = {
      ...totalLeads,
      conversionRatio: totalLeads.conversionRatio
        ? (totalLeads.conversionRatio / totalCount).toFixed(2) : 0,
      averageFunds: totalLeads.totalDeals ? (totalLeads.totalFunds / totalLeads.totalDeals).toFixed(2) : '0',
      averageDaysDifference: totalLeads.totalDeals ? (totalLeads.averageDaysDifference / totalLeads.totalDeals).toFixed(0) : '0',
    };
    setTotalLeadsData(totalLeadsDataObj);
  };
  useEffect(() => {
    if (employees.length === 0) { setTotalLeadsData({}); return; }
    getTotalLeadsData();
  }, [employees, leadsData]);

  return (
    <Flex vertical flex={1}>
      <Spin tip="Loading..." spinning={loading} fullscreen />
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
          <Flex className={styles.headerColumnTitle}>Manager Performance Leaderboard</Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['total leads assigned']}</Flex>
          </Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['leads assigned']}</Flex>
          </Flex>
          <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
            <Flex>{actionTypesTitles['disqualified leads']}</Flex>
          </Flex>
          {actionTypes.map((action) => (
            <Flex key={action} className={styles.headerColumnPerson} vertical justify="center" align="center">
              <Flex>{actionTypesTitles[action] || action}</Flex>
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
            <Flex key={action} className={styles.dataColumnPerson} justify="center" align="center">
              {totalLeadsData[action] || ' '}
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
            {actionTypes.map((action) => {
              const empData = leadsData[emp.id] || {};
              // Find the matching key in empData (case-insensitive)
              const matchingKey = Object.keys(empData).find((key) => key.toLowerCase() === action);
              const value = matchingKey ? empData[matchingKey] : 0;
              return (
                <Flex key={action} className={styles.dataColumnPerson} justify="center" align="center">
                  {value || ' '}
                </Flex>
              );
            })}
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {(leadsData[emp.id] || {}).conversionRatio || ' '}
              {(leadsData[emp.id] || {}).conversionRatio ? '%' : ''}
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              $
              {numberWithCommas(((leadsData[emp.id] || {}).dealsFunded || {}).averageFunds || '0')}
            </Flex>
            <Flex className={styles.dataColumnPerson} justify="center" align="center">
              {((leadsData[emp.id] || {}).dealsFunded || {}).averageDaysDifference || '0'}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default ManagerLeaderBoardModule;
