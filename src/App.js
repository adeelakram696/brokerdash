import { useEffect, useState } from 'react';
import {
  Layout, theme, ConfigProvider, Spin,
} from 'antd';
import { removeBoardHeader } from 'utils/helpers';
import { fetchGroups, fetchUserName } from 'app/apis/query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Dashboard from './app/pages/dashboard';
import './App.scss';

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

  useEffect(() => {
    removeBoardHeader();
    fetchUserName().then((res) => setUserName(res));
    fetchGroups();
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
        {userName ? (
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
        ) : <Spin spinning fullscreen />}
      </Layout>
    </ConfigProvider>
  );
}

export default App;
