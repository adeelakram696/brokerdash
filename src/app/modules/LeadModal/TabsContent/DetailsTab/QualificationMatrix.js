import {
  Button, Card, Flex, Divider,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { ThumbsUpIcon } from 'app/images/icons';
import { useContext, useState } from 'react';
import { LeadContext } from 'utils/contexts';
import { columnIds } from 'utils/constants';
import { decodeJson } from 'utils/encrypt';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import QualificationMatrixForm from '../../QualificationMatrixForm';

function QualificationMatrix() {
  const {
    details, board,
  } = useContext(LeadContext);
  const [openForm, setOpenForm] = useState();
  const onClose = () => {
    setOpenForm(false);
  };
  const getDetails = () => {
    const qmDataEncoded = details[columnIds[board].qualification_matrix_data];
    if (qmDataEncoded) {
      const decodedData = decodeJson(qmDataEncoded);
      return decodedData.matrixValues;
    }
    const bankActivity = JSON.parse(details[columnIds[board].qm_bank_activity] || '{}');
    const activePosition = JSON.parse(details[columnIds[board].qm_active_position] || '{}');
    const combined = {
      ...bankActivity,
      ...activePosition,
    };
    return combined;
  };
  const qmData = details.name ? getDetails() : {};
  return (
    <Card className={classNames(
      parentStyles.cardContainer,
      styles.fullWidth,
      styles.informationCard,
      styles.qualificationCard,
    )}
    >
      <Flex justify="center">
        <Button onClick={() => { setOpenForm(true); }} className={styles.qulificationBtn} type="primary" shape="round" icon={<ThumbsUpIcon />}>
          {en.titles.qualificationMatrix}
        </Button>
      </Flex>
      <Flex justify="space-around">
        <Flex style={{ marginTop: 10 }} vertical>
          <Flex className={styles.qualificationTotalHeading}>Total Credit</Flex>
          <Flex className={styles.qualificationTotalamount}>
            $
            {qmData['totalCredit-1']}
          </Flex>
          <Flex className={styles.qualificationTotalamount}>
            $
            {qmData['totalCredit-2']}
          </Flex>
          <Flex className={styles.qualificationTotalamount}>
            $
            {qmData['totalCredit-3']}
          </Flex>
        </Flex>
        <Flex style={{ marginTop: 10 }} vertical>
          <Flex className={styles.qualificationTotalHeading}>Total Debits</Flex>
          <Flex className={styles.qualificationTotalamount}>
            $
            {qmData['totalDebit-1']}
          </Flex>
          <Flex className={styles.qualificationTotalamount}>
            $
            {qmData['totalDebit-2']}
          </Flex>
          <Flex className={styles.qualificationTotalamount}>
            $
            {qmData['totalDebit-3']}
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={1}>
        <Divider style={{ background: '#73A3B2', margin: [18, 0] }} />
      </Flex>
      <Flex flex={1} justify="space-around">
        <Flex vertical style={{ fontSize: 11 }}>
          <Flex>Min Monthly Deposit Count</Flex>
          <Flex>Number of Positions</Flex>
          <Flex>NSF (last 30)</Flex>
          <Flex>NSF (last 90)</Flex>
          <Flex>Negative Days (Last 30 Days)</Flex>
          <Flex>Negative Days (Last 90 Days)</Flex>
        </Flex>
        <Flex vertical style={{ fontSize: 11 }} align="flex-end">
          <Flex>{qmData.minMonthlyDepositCount}</Flex>
          <Flex>{qmData.numberOfPositions}</Flex>
          <Flex>{qmData.nSFLast30Days}</Flex>
          <Flex>{qmData.nSFLast90Days}</Flex>
          <Flex>{qmData.negativeDaysLast30}</Flex>
          <Flex>{qmData.negativeDaysLast90}</Flex>
        </Flex>
      </Flex>
      <QualificationMatrixForm show={openForm} handleClose={onClose} />
    </Card>
  );
}

export default QualificationMatrix;
