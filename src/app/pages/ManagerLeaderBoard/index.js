import { ConfigProvider, Layout } from 'antd';
import ManagerLeaderBoardModule from 'app/modules/ManagerLeaderBoard';

function ManagerLeaderBoardPage() {
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
        <ManagerLeaderBoardModule withFilter />
      </Layout>
    </ConfigProvider>
  );
}

export default ManagerLeaderBoardPage;
