import { useState, useEffect } from 'react';
import { Layout, theme, ConfigProvider } from 'antd';
import monday from 'utils/mondaySdk';
import Dashboard from './app/pages/dashboard';
import './App.scss';

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const { Content } = Layout;

function App() {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [context, setContext] = useState();

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute('valueCreatedForUser');

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen('context', (res) => {
      setContext(res.data);
    });
  }, []);
  // Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  console.log(context);
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
      </Layout>
    </ConfigProvider>
  );
}

export default App;
