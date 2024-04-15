import { useEffect, useState } from 'react';
import {
  Layout, theme, ConfigProvider, Spin,
} from 'antd';
import { fetchUserName, removeBoardHeader } from 'utils/helpers';
import dayjs from 'dayjs';
import Dashboard from './app/pages/dashboard';
import './App.scss';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);
// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const { Content } = Layout;

function App() {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [userName, setUserName] = useState();

  useEffect(() => {
    removeBoardHeader();
    fetchUserName().then((res) => setUserName(res));
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
