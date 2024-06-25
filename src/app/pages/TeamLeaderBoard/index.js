import { ConfigProvider, Layout } from 'antd';
import TeamLeaderBoardModule from 'app/modules/TeamLeaderBoard';

function TeamLeaderBoard() {
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
        <TeamLeaderBoardModule />
      </Layout>
    </ConfigProvider>
  );
}

export default TeamLeaderBoard;
