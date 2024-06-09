/* eslint-disable react/jsx-no-useless-fragment */
import {
  useEffect, useState, Suspense, lazy,
} from 'react';
import {
  Layout, theme, ConfigProvider, Spin,
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
import './App.scss';

const Dashboard = lazy(() => import('./app/pages/dashboard'));
const LeadView = lazy(() => import('app/pages/LeadView'));
const LeaderBoard = lazy(() => import('app/pages/LeaderBoard'));
const DailyMatrics = lazy(() => import('app/pages/DailyMatrics'));

// Extend Day.js with duration and customParseFormat plugins
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
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
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins',
        },
        components: {
          Layout: {
            bodyBg: '#E1EFF2',
            headerBg: '#E1EFF2',
          },
        },
      }}
    >
      <Layout
        style={{
          padding: '0 8px 24px',
        }}
      >
        {userName && stagesFetched ? (
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
            </Switch>
          </Router>
        ) : <Spin spinning fullscreen />}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
