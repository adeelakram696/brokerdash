import { ConfigProvider, Layout } from 'antd';
import BrokerApprovalsBoardModule from 'app/modules/BrokerApprovalsBoard';

function BrokerApprovalsBoard() {
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
          minHeight: '100vh',
        }}
      >
        <BrokerApprovalsBoardModule />
      </Layout>
    </ConfigProvider>
  );
}

export default BrokerApprovalsBoard;
