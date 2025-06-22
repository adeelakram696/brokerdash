import { ConfigProvider, Layout } from 'antd';
import OpenApprovalsBoardModule from 'app/modules/OpenApprovalsBoard';

function OpenApprovalsBoard() {
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
        <OpenApprovalsBoardModule />
      </Layout>
    </ConfigProvider>
  );
}

export default OpenApprovalsBoard;
