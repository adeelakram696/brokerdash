/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
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
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './App.scss';
import LeaderBoard from 'app/pages/LeaderBoard';
import LeadView from 'app/pages/LeadView';
import DailyMatrics from 'app/pages/DailyMatrics';
import Dashboard from './app/pages/dashboard';

// Extend Day.js with duration and customParseFormat plugins
dayjs.extend(duration);
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
              </Route>
              <Route exact path="/lead-view">
                <LeadView />
              </Route>
              <Route exact path="/leader-board">
                <LeaderBoard />
              </Route>
              <Route exact path="/leader-board-filter">
                <LeaderBoard withFilter />
              </Route>
              <Route exact path="/daily-matrics">
                <DailyMatrics />
              </Route>
            </Switch>
          </Router>
        ) : <Spin spinning fullscreen />}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
