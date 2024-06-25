import { ConfigProvider, Layout } from 'antd';
import ManagerFunnelBoardModule from 'app/modules/ManagerFunnelBoard';

function ManagerFunnelBoard() {
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
        <ManagerFunnelBoardModule />
      </Layout>
    </ConfigProvider>
  );
}

export default ManagerFunnelBoard;
