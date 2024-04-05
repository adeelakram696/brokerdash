import {
  Flex, Progress, Row, Col,
} from 'antd';
import en from 'app/locales/en';
import HeaderTitle from 'app/components/HeaderTitle';
import NewLeadsCard from 'app/modules/DashboardCards/NewLeads';
import ActionsCard from 'app/modules/DashboardCards/Actions';
import ContractsOutCard from 'app/modules/DashboardCards/ContractsOut';
import ApprovalsCard from 'app/modules/DashboardCards/Approvals';
import ProgressCards from 'app/modules/DashboardCards/ProgressCards';
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <>
      <Flex justify="space-between" align="flex-start">
        <HeaderTitle>{en.dashboard.title}</HeaderTitle>
        <Flex align="center" flex="0.3">
          <span className={styles.effecincyText}>{en.dashboard.header.efficiencyTitle}</span>
          <Progress percent={30} size="small" />
        </Flex>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col span={12}><NewLeadsCard /></Col>
        <Col span={12}><ActionsCard /></Col>
        <ProgressCards />
        <Col span={12}><ApprovalsCard /></Col>
        <Col span={12}><ContractsOutCard /></Col>
      </Row>
    </>
  );
}

export default Dashboard;
