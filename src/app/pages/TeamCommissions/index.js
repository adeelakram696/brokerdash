import { ConfigProvider, Layout } from 'antd';
import TeamCommissionsModule from 'app/modules/TeamCommissions';

function TeamCommissions({ isUser }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins',
        },
        components: {
          Layout: {
            bodyBg: '#1a4049',
            headerBg: '#E1EFF2',
          },
        },
      }}
    >
      <Layout
        style={{
          padding: '0 8px 24px',
          minHeight: '100vh',
        }}
      >
        <TeamCommissionsModule isUser={isUser} />
      </Layout>
    </ConfigProvider>
  );
}

export default TeamCommissions;
