import {
  Avatar,
  DatePicker,
  Flex,
  Spin,
} from 'antd';
import {
  fetchLeadersBoardEmployees, fetchBoardColorColumnStrings, getTotalActivities, fetchAllUsers,
  getAllLeadsAssigned,
} from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import { env } from 'utils/constants';
import monday from 'utils/mondaySdk';
import SelectField from 'app/components/Forms/SelectField';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { customSort } from 'utils/helpers';
import { actionTypesList, actionTypesTitles, conversions } from './data';
import styles from './LeaderBoards.module.scss';

const { RangePicker } = DatePicker;

function LeaderBoardModule({ withFilter }) {
  let unsubscribe;
  let timeoutId;
  const [loading, setLoading] = useState(false);
  const [assingedLoading, setAssignedLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const dateR = useRef();
  const [actionTypes, setActionTypes] = useState([]);
  const [saleActivities, setSalesActivities] = useState([]);
  const [assingedLeads, setAssingedLeads] = useState([]);
  const getActionTypes = async () => {
    const res = await fetchBoardColorColumnStrings(env.boards.salesActivities, 'status');
    const actions = Object.values(res).reduce((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[curr.toLowerCase()] = curr.toLowerCase();
      return prev;
    }, {});
    const lowercaseActionsList = actionTypesList.map((t) => t.toLowerCase());
    const sortedList = customSort(Object.keys(actions), lowercaseActionsList, true);
    setActionTypes(sortedList);
  };
  const getEmployeeList = async () => {
    const res = await fetchLeadersBoardEmployees();
    setEmployees(res);
    if (withFilter) {
      const mapUsers = res?.map((u) => (u.id));
      setSelectedUsers(mapUsers);
    }
  };
  const getSaleActivities = async (dates, isLoading = true) => {
    setLoading(true && isLoading);
    const res = await getTotalActivities(dates);
    setSalesActivities(res);
    setLoading(false);
  };
  const getAllAssingedLeads = async (dates, employeesList, isLoading = true) => {
    setAssignedLoading(true && isLoading);
    const res = await getAllLeadsAssigned(dates, employeesList);
    setAssingedLeads(res);
    setAssignedLoading(false);
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
    getActionTypes();
    dateR.current = [dayjs(), dayjs()];
    if (withFilter) getUsers();
  }, []);

  useEffect(() => {
    if (employees.length === 0) return;
    getSaleActivities(dateRange);
    getAllAssingedLeads(dateRange, employees);
  }, [employees, dateRange]);

  const refetchData = (dates) => {
    getActionTypes();
    getSaleActivities(dates, false);
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
  return (
    <Flex vertical flex={1}>
      <Spin tip="Loading..." spinning={loading || assingedLoading} fullscreen />
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
            <Flex>{actionTypesTitles['leads assigned']}</Flex>
          </Flex>
          {actionTypes.map((actions) => (
            <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
              <Flex>{actionTypesTitles[actions]}</Flex>
            </Flex>
          ))}
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
              {(assingedLeads[emp.id] || {}).count || ' '}
            </Flex>
            {actionTypes.map((actions) => {
              const prevAction = conversions[actions];
              const prev = prevAction === 'leads assigned' ? (assingedLeads[emp.id] || {}).count : (saleActivities[prevAction] || {})[emp.id];
              const curr = (saleActivities[actions] || {})[emp.id];
              const percentage = (prev && curr) ? ((curr / prev) * 100).toFixed(0) : '';
              return (
                <Flex className={styles.dataColumnPerson} justify="center" align="center" vertical>
                  <Flex>{(saleActivities[actions] || {})[emp.id] || ' '}</Flex>
                  <Flex className={styles.percentage}>{percentage ? `${percentage}%` : ''}</Flex>
                </Flex>
              );
            })}
          </Flex>
        ))}

      </Flex>
    </Flex>
  );
}

export default LeaderBoardModule;
