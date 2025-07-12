/* eslint-disable react/jsx-no-useless-fragment */
import {
  useEffect, useState, Suspense, lazy,
} from 'react';
import {
  Layout, theme, Spin,
} from 'antd';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { removeBoardHeader } from 'utils/helpers';
import { fetchCurrentUser, fetchGroups } from 'app/apis/query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import './App.scss';
import TeamLeaderBoard from 'app/pages/TeamLeaderBoard';
import ManagerFunnelBoard from 'app/pages/ManagerFunnelBoard';
import ApprovalsBoard from 'app/pages/ApprovalsBoard';
import OpenApprovalsBoard from 'app/pages/OpenApprovalsBoard';
import TeamCommissions from 'app/pages/TeamCommissions';
import BrokerApprovalsBoard from 'app/pages/BrokerApprovalsBoard';

const Dashboard = lazy(() => import('./app/pages/dashboard'));
const LeadView = lazy(() => import('app/pages/LeadView'));
const LeaderBoard = lazy(() => import('app/pages/LeaderBoard'));
const DailyMatrics = lazy(() => import('app/pages/DailyMatrics'));

// Extend Day.js with duration and customParseFormat plugins
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const { Content } = Layout;
function App() {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [userName, setUserName] = useState();
  const [stagesFetched, setStagesFetched] = useState();

  useEffect(() => {
    removeBoardHeader();
    fetchGroups().then((res) => setStagesFetched(res));
    fetchCurrentUser().then((res) => setUserName(res));
  }, []);
  return (
    userName && stagesFetched ? (
      <Router>
        <Switch>
          <Route exact path="/">
            <Suspense fallback={<div>Loading...</div>}>
              <Content
                style={{
                  padding: 8,
                  margin: 0,
                  minHeight: 280,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Dashboard />
              </Content>
            </Suspense>
          </Route>
          <Route exact path="/lead-view">
            <Suspense fallback={<div>Loading...</div>}>
              <LeadView />
            </Suspense>
          </Route>
          <Route exact path="/leader-board">
            <Suspense fallback={<div>Loading...</div>}>
              <LeaderBoard />
            </Suspense>
          </Route>
          <Route exact path="/leader-board-filter">
            <Suspense fallback={<div>Loading...</div>}>
              <LeaderBoard withFilter />
            </Suspense>
          </Route>
          <Route exact path="/daily-matrics">
            <Suspense fallback={<div>Loading...</div>}>
              <DailyMatrics />
            </Suspense>
          </Route>
          <Route exact path="/team-leader-board">
            <Suspense fallback={<div>Loading...</div>}>
              <TeamLeaderBoard />
            </Suspense>
          </Route>
          <Route exact path="/funnel-board">
            <Suspense fallback={<div>Loading...</div>}>
              <ManagerFunnelBoard />
            </Suspense>
          </Route>
          <Route exact path="/user-funnel-board">
            <Suspense fallback={<div>Loading...</div>}>
              <ManagerFunnelBoard isUser />
            </Suspense>
          </Route>
          <Route exact path="/approvals-board">
            <Suspense fallback={<div>Loading...</div>}>
              <ApprovalsBoard />
            </Suspense>
          </Route>
          <Route exact path="/open-approvals-board">
            <Suspense fallback={<div>Loading...</div>}>
              <OpenApprovalsBoard />
            </Suspense>
          </Route>
          <Route exact path="/broker-approvals-board">
            <Suspense fallback={<div>Loading...</div>}>
              <BrokerApprovalsBoard />
            </Suspense>
          </Route>
          <Route exact path="/team-commissions">
            <Suspense fallback={<div>Loading...</div>}>
              <TeamCommissions />
            </Suspense>
          </Route>
          <Route exact path="/user-commissions">
            <Suspense fallback={<div>Loading...</div>}>
              <TeamCommissions isUser />
            </Suspense>
          </Route>
        </Switch>
      </Router>
    ) : <Spin spinning fullscreen />
  );
}

export default App;
