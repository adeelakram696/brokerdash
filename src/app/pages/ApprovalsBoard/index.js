import { ConfigProvider, Layout } from 'antd';
import ApprovalsBoardModule from 'app/modules/ApprovalsBoard';

function ApprovalsBoard() {
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
        <ApprovalsBoardModule />
      </Layout>
    </ConfigProvider>
  );
}

export default ApprovalsBoard;
