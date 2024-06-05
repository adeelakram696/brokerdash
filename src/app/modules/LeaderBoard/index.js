import {
  Avatar,
  DatePicker,
  Flex,
} from 'antd';
import {
  fetchLeadersBoardEmployees, fetchBoardColumnStrings, getTotalActivities, fetchAllUsers,
} from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import { actionTypesList, env } from 'utils/constants';
import monday from 'utils/mondaySdk';
import SelectField from 'app/components/Forms/SelectField';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { customSort, toSentenceCase } from 'utils/helpers';
import styles from './LeaderBoards.module.scss';

const { RangePicker } = DatePicker;

function LeaderBoardModule({ withFilter }) {
  let unsubscribe;
  let timeoutId;
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const dateR = useRef();
  const [actionTypes, setActionTypes] = useState([]);
  const [saleActivities, setSalesActivities] = useState([]);
  const getActionTypes = async () => {
    const res = await fetchBoardColumnStrings(env.boards.salesActivities, 'status');
    const actions = res.reduce((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[curr.toLowerCase()] = curr.toLowerCase();
      return prev;
    }, {});
    const lowercaseActionsList = actionTypesList.map((t) => t.toLowerCase());
    const sortedList = customSort(Object.keys(actions), lowercaseActionsList);
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
  const getSaleActivities = async (dates) => {
    const res = await getTotalActivities(dates);
    setSalesActivities(res);
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
  }, [employees, dateRange]);

  const refetchData = (dates) => {
    getActionTypes();
    getSaleActivities(dates);
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
          {employees.map((emp) => (
            <Flex className={styles.headerColumnPerson} vertical justify="center" align="center">
              <Flex>
                {emp.photo_thumb
                  ? <Avatar src={emp.photo_thumb} />
                  : <Avatar>{emp.name[0]}</Avatar>}
              </Flex>
              <Flex>{emp.name.split(' ')[0]}</Flex>
            </Flex>
          ))}
        </Flex>
        {actionTypes.map((actions, index) => (
          <Flex className={classNames(styles.dataRow, { [styles.alternateColor]: index % 2 })}>
            <Flex className={styles.dataColumnTitle} align="center">{toSentenceCase(actions)}</Flex>
            {employees.map((emp) => (
              <Flex className={styles.dataColumnPerson} justify="center" align="center">
                {(saleActivities[actions] || {})[emp.id] || ' '}
              </Flex>
            ))}
          </Flex>
        ))}

      </Flex>
    </Flex>
  );
}

export default LeaderBoardModule;
