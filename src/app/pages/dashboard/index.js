import {
  Flex, Progress, Row, Col,
  ConfigProvider,
  Layout,
} from 'antd';
import en from 'app/locales/en';
import HeaderTitle from 'app/components/HeaderTitle';
import NewLeadsCard from 'app/modules/DashboardCards/NewLeads';
import ActionsCard from 'app/modules/DashboardCards/Actions';
import ContractsOutCard from 'app/modules/DashboardCards/ContractsOut';
import ApprovalsCard from 'app/modules/DashboardCards/Approvals';
import ProgressCards from 'app/modules/DashboardCards/ProgressCards';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [cardsValues, setCardsValues] = useState({
    leadsfollowUp: { value: 0, total: { value: 0 } },
    dealsfollowUp: { value: 0, total: { value: 0 } },
    cold: { value: 0, total: { value: 0 } },
    doc: { value: 0, total: { value: 0 } },
    ready: { value: 0, total: { value: 0 } },
    waiting: { value: 0, total: { value: 0 } },
  });

  const [effecincyScore, setEffecincyScore] = useState(0);

  const handleChange = (obj) => {
    setCardsValues((currentValue) => ({ ...currentValue, ...obj }));
  };
  useEffect(() => {
    const totalSum = _.sumBy(Object.values(cardsValues), (o) => o.total.value);
    const valueSum = totalSum - _.sumBy(Object.values(cardsValues), (o) => o.value);
    const score = (valueSum / totalSum) * 100;
    setEffecincyScore(score);
  }, [cardsValues]);
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
        <Flex justify="space-between" align="flex-start">
          <HeaderTitle>{en.dashboard.title}</HeaderTitle>
          <Flex align="center" flex="0.3">
            <span className={styles.effecincyText}>{en.dashboard.header.efficiencyTitle}</span>
            <Progress percent={effecincyScore} size="small" />
          </Flex>
        </Flex>
        <Row gutter={[16, 16]}>
          <Col span={12}><NewLeadsCard /></Col>
          <Col span={12}><ActionsCard /></Col>
          <ProgressCards handleChange={handleChange} />
          <Col span={12}><ApprovalsCard /></Col>
          <Col span={12}><ContractsOutCard /></Col>
        </Row>
      </Layout>
    </ConfigProvider>
  );
}

export default Dashboard;
