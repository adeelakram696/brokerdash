import {
  Flex,
} from 'antd';
import {
  fetchBoardColorColumnStrings,
  getTeamTotalActivities,
  getDealFunds,
  fetchTeamLeadersBoardEmployees,
  fetchTeamGoals,
} from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import { env } from 'utils/constants';
import monday from 'utils/mondaySdk';
import { logo } from 'app/images';
import IconImg from 'app/components/IconImg';
import styles from './TeamLeaderBoard.module.scss';
import { durations, statuses } from './data';
import AgentLeaderBoard from './AgentLeaderboard';
import TeamLeaderboardGoal from './TeamLeaderboardGoal';
import MainDataTable from './MainDataTable';

function TeamLeaderBoard() {
  let unsubscribe;
  let timeoutId;
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [saleActivities, setSalesActivities] = useState([]);
  const [saleFunds, setSalesFunds] = useState({});
  const actionTypesRef = useRef();
  const employeeRef = useRef();
  const getActionTypes = async () => {
    const res = await fetchBoardColorColumnStrings(env.boards.salesActivities, 'status');
    actionTypesRef.current = res;
  };
  const getEmployeeList = async () => {
    const res = await fetchTeamLeadersBoardEmployees();
    employeeRef.current = res;
    setEmployees(res);
  };
  const getGoals = async () => {
    const resp = await fetchTeamGoals();
    setGoals(resp);
  };
  const getSaleActivities = async (duration, actionIds) => {
    const res = await getTeamTotalActivities(duration, actionIds);
    saleActivities[duration] = res;
    setSalesActivities({ ...saleActivities });
  };
  const getTotalFunds = async () => {
    const res = await getDealFunds(employeeRef.current);
    setSalesFunds(res);
  };
  const getTeamActivities = async () => {
    const actionTypesList = actionTypesRef.current;
    const dailyActivityIds = Object.keys(actionTypesList).filter(
      (key) => (
        actionTypesList[key] === statuses[0].actionName
        || actionTypesList[key] === statuses[1].actionName
      ),
    );
    const weeklyActivityIds = Object.keys(actionTypesList).filter(
      (key) => (
        actionTypesList[key] === statuses[2].actionName
        || actionTypesList[key] === statuses[3].actionName
      ),
    );
    const monthlyActivityIds = Object.keys(actionTypesList).filter(
      (key) => (actionTypesList[key] === statuses[4].actionName),
    );
    getTotalFunds();
    getGoals();
    await getSaleActivities(durations.daily, dailyActivityIds);
    await getSaleActivities(durations.weekly, weeklyActivityIds);
    await getSaleActivities(durations.monthly, monthlyActivityIds);
  };
  useEffect(() => {
    getEmployeeList();
    getActionTypes();
  }, []);

  useEffect(() => {
    if (employees.length === 0) return;
    getTeamActivities();
  }, [employees]);

  const refetchData = () => {
    getTeamActivities();
  };
  const refetchEmployee = ({ data }) => {
    if (data.itemIds.includes(Number(env.teamLeaderBoardGoalItemId))) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        getEmployeeList();
        getGoals();
      }, 1000 * 3);
    }
  };
  useEffect(() => {
    unsubscribe = monday.listen('events', refetchEmployee);
    return () => {
      if (!unsubscribe) return;
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    const intervalId = setInterval(
      () => { refetchData(); }
      , (1000 * env.performanceRefetchTime),
    );
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  return (
    <Flex flex={1}>
      <MainDataTable saleActivities={saleActivities} employees={employees} saleFunds={saleFunds} />
      <Flex flex={0.4} vertical>
        <Flex className={styles.logo} justify="center">
          <div
            className={styles.backgroundImage}
          >
            <IconImg path={logo} />
          </div>
        </Flex>
        <AgentLeaderBoard
          saleActivities={saleActivities}
          employees={employees}
          saleFunds={saleFunds}
        />
        <TeamLeaderboardGoal saleActivities={saleActivities} saleFunds={saleFunds} goals={goals} />
      </Flex>
    </Flex>
  );
}

export default TeamLeaderBoard;
