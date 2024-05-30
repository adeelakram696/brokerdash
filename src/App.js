/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import {
  Layout, theme, ConfigProvider, Spin,
} from 'antd';
import { getQueryParams, removeBoardHeader } from 'utils/helpers';
import { fetchGroups, fetchCurrentUser } from 'app/apis/query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './App.scss';
import LeadModal from 'app/modules/LeadModal';
import { env } from 'utils/constants';
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
    fetchCurrentUser().then((res) => setUserName(res));
    fetchGroups().then((res) => setStagesFetched(res));
  }, []);
  const { itemId, boardId } = getQueryParams();
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
          <Content
            style={{
              padding: 8,
              margin: 0,
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
            {itemId ? (
              <LeadModal
                show
                handleClose={() => {}}
                closeIcon={false}
                leadId={itemId}
                board={env.boards[boardId]}
              />
            )
              : <Dashboard />}
          </Content>
        ) : <Spin spinning fullscreen />}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
