import { ConfigProvider, Layout } from 'antd';
import BatchManagerFunnelBoardModule from 'app/modules/BatchManagerFunnelBoard';

function BatchManagerFunnelBoard({ isUser }) {
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
        <BatchManagerFunnelBoardModule isUser={isUser} />
      </Layout>
    </ConfigProvider>
  );
}

export default BatchManagerFunnelBoard;
