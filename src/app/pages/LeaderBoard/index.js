import { ConfigProvider, Layout } from 'antd';
import LeaderBoardModule from 'app/modules/LeaderBoard';

function LeaderBoard({ withFilter }) {
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
        <LeaderBoardModule withFilter={withFilter} />
      </Layout>
    </ConfigProvider>
  );
}

export default LeaderBoard;
