import {
  Avatar,
  DatePicker,
  Flex,
  Spin,
} from 'antd';
import {
  fetchLeadersBoardEmployees, fetchBoardColorColumnStrings, fetchAllUsers,
  getAllLeadsAssigned,
} from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import { env } from 'utils/constants';
import monday from 'utils/mondaySdk';
import SelectField from 'app/components/Forms/SelectField';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { customSort, numberWithCommas } from 'utils/helpers';
import {
  actionTypesList, actionTypesTitles, conversions, mergeTeamData,
} from './data';
import styles from './LeaderBoards.module.scss';
import {
  getAllAssignedLeadsDeals, getDealFunds, getDisqualifiedLeadsDeals, getTeamTotalActivities,
} from './queries';

const { RangePicker } = DatePicker;

function LeaderBoardModule({ withFilter }) {
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
  // const [saleActivities, setSalesActivities] = useState([]);
  const [leadsData, setleadsData] = useState([]);
  const [totalLeadsData, setTotalleadsData] = useState({});
  const getEmployeeList = async () => {
    const res = await fetchLeadersBoardEmployees();
    setEmployees(res);
    if (withFilter) {
      const mapUsers = res?.map((u) => (u.id));
      setSelectedUsers(mapUsers);
    }
  };
  // const getSaleActivities = async (dates, isLoading = true) => {
  //   setLoading(true && isLoading);
  //   const res = await getTotalActivities(dates);
  //   console.log(res);
  //   setSalesActivities(res);
  //   setLoading(false);
  // };
  const getAllAssingedLeads = async (dates, employeesList, isLoading = true) => {
    setLoading(true && isLoading);
    const res = await fetchBoardColorColumnStrings(env.boards.salesActivities, 'status');
    const actions = Object.values(res).reduce((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[curr.toLowerCase()] = curr.toLowerCase();
      return prev;
    }, {});
    const lowercaseActionsList = actionTypesList.map((t) => t.toLowerCase());
    const sortedList = customSort(Object.keys(actions), lowercaseActionsList, true);
    setActionTypes(sortedList);
    const actionIds = Object.keys(res)
      .filter((key) => (actionTypesList.includes(res[key])));
    const saleActivties = await getTeamTotalActivities(dates, actionIds, employeesList);
    const leadsAssigned = await getAllLeadsAssigned(dates, employeesList);
    const dealsFunded = await getDealFunds(employeesList, dates);
    const allLeadsAssigned = await getAllAssignedLeadsDeals(employeesList);
    const allLeadsDisqualified = await getDisqualifiedLeadsDeals(employeesList, dates);
    const mergedData = mergeTeamData(
      leadsAssigned,
      dealsFunded,
      allLeadsAssigned,
      allLeadsDisqualified,
      saleActivties,
      employeesList,
    );
    setleadsData(mergedData);
    setLoading(false);
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
    // getSaleActivities(dateRange);
    getAllAssingedLeads(dateRange, employees);
  }, [employees, dateRange]);

  const refetchData = () => {
    // getSaleActivities(dates, false);
    getAllAssingedLeads(dateRange, employees, false);
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
              {numberWithCommas((leadsData[emp.id] || {}).averageFunds || '0')}
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

export default LeaderBoardModule;
