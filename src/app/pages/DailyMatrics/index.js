import { ConfigProvider, Layout } from 'antd';
import DailyMatricsModule from 'app/modules/DailyMatrics';

function DailyMatrics() {
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
        <DailyMatricsModule />
        {' '}

      </Layout>
    </ConfigProvider>
  );
}

export default DailyMatrics;
