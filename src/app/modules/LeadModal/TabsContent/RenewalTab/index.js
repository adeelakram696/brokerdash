import {
  Flex, Divider,
} from 'antd';
import FundingOffer from './FundingOffer';
import SubmissionCard from '../Common/SubmissionCard';
import QualificationMatrixCard from '../Common/QualificationMatrixCard';
import styles from './RenewalTab.module.scss';

function RenewalTab() {
  return (
    <Flex vertical>
      <Flex>
        <SubmissionCard />
        <QualificationMatrixCard />
      </Flex>
      <Flex><Divider style={{ margin: '10px 0px' }} /></Flex>
      <Flex vertical className={styles.offersList}>
        <FundingOffer />
        <FundingOffer />
      </Flex>
    </Flex>
  );
}

export default RenewalTab;
