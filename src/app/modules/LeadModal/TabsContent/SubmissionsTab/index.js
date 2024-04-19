import {
  Flex, Divider,
} from 'antd';
import SubmissionCard from '../Common/SubmissionCard';
import QualificationMatrixCard from '../Common/QualificationMatrixCard';
import FundingOffer from './FundingOffer';
import styles from './SubmissionsTab.module.scss';

function SubmissionsTab({
  leadId, board, details, getData,
}) {
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
            type="MCA"
            data={subItem}
            board={board}
            boardId={details.board.id}
            leadId={leadId}
            updateInfo={getData}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default SubmissionsTab;
