import {
  Flex, Divider,
} from 'antd';
import SubmissionCard from '../Common/SubmissionCard';
import QualificationMatrixCard from '../Common/QualificationMatrixCard';
import FundingOffer from './FundingOffer';
import styles from './SubmissionsTab.module.scss';

function SubmissionsTab() {
  return (
    <Flex vertical>
      <Flex>
        <SubmissionCard />
        <QualificationMatrixCard />
      </Flex>
      <Flex><Divider style={{ margin: '10px 0px' }} /></Flex>
      <Flex vertical className={styles.offersList}>
        <FundingOffer type="MCA" />
        <FundingOffer type="Credit Line" />
        <FundingOffer type="Credit Line" />
        <FundingOffer type="Credit Line" />
        <FundingOffer type="Credit Line" />
        <FundingOffer type="Credit Line" />
        <FundingOffer type="Credit Line" />
        <FundingOffer type="Credit Line" />
      </Flex>
    </Flex>
  );
}

export default SubmissionsTab;
