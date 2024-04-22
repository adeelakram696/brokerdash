import {
  Flex, Divider,
} from 'antd';
import { useContext } from 'react';
import { LeadContext } from 'utils/contexts';
import SubmissionCard from '../Common/SubmissionCard';
import QualificationMatrixCard from '../Common/QualificationMatrixCard';
import FundingOffer from './FundingOffer';
import styles from './SubmissionsTab.module.scss';

function SubmissionsTab() {
  const {
    details,
  } = useContext(LeadContext);
  return (
    <Flex vertical>
      <Flex>
        <SubmissionCard />
        <QualificationMatrixCard />
      </Flex>
      <Flex><Divider style={{ margin: '10px 0px' }} /></Flex>
      <Flex vertical className={styles.offersList}>
        {details.subitems?.map((subItem) => (
          <FundingOffer
            key={subItem.id}
            data={subItem}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default SubmissionsTab;
