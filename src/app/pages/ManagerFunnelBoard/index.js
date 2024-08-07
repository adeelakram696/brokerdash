import { ConfigProvider, Layout } from 'antd';
import ManagerFunnelBoardModule from 'app/modules/ManagerFunnelBoard';

function ManagerFunnelBoard({ isUser }) {
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
          minHeight: '98vh',
        }}
      >
        <ManagerFunnelBoardModule isUser={isUser} />
      </Layout>
    </ConfigProvider>
  );
}

export default ManagerFunnelBoard;
