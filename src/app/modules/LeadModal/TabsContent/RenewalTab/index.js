import {
  Flex, Divider,
} from 'antd';
import { useContext } from 'react';
import { LeadContext } from 'utils/contexts';
import { columnIds, renewalTags } from 'utils/constants';
import SubmissionCard from '../Common/SubmissionCard';
import QualificationMatrixCard from '../Common/QualificationMatrixCard';
import styles from './RenewalTab.module.scss';
import FundingOffer from '../Common/FundersList/FundingOffer';

function RenewalTab() {
  const {
    details,
  } = useContext(LeadContext);
  const filtered = details.subitems.filter(
    (subitem) => subitem[columnIds.subItem.renewal] === renewalTags.renewal,
  );
  return (
    <Flex vertical>
      <Flex>
        <SubmissionCard />
        <QualificationMatrixCard />
      </Flex>
      <Flex><Divider style={{ margin: '10px 0px' }} /></Flex>
      <Flex vertical className={styles.offersList}>
        {filtered?.map((subItem) => (
          <FundingOffer
            key={subItem.id}
            data={subItem}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default RenewalTab;
