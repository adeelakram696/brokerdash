import {
  Button, Card, Flex, Divider,
} from 'antd';
import en from 'app/locales/en';
import classNames from 'classnames';
import { ThumbsUpIcon } from 'app/images/icons';
import { useState } from 'react';
import styles from './DetailsTab.module.scss';
import parentStyles from '../../LeadModal.module.scss';
import QualificationMatrixForm from '../../QualificationMatrixForm';

function QualificationMatrix() {
  const [openForm, setOpenForm] = useState();
  const onClose = () => {
    setOpenForm(false);
  };
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
          <Flex className={styles.qualificationTotalamount}>$ 57,755.00</Flex>
          <Flex className={styles.qualificationTotalamount}>$ 39,973.00</Flex>
          <Flex className={styles.qualificationTotalamount}>$ 56,494.00</Flex>
        </Flex>
        <Flex style={{ marginTop: 10 }} vertical>
          <Flex className={styles.qualificationTotalHeading}>Total Debits</Flex>
          <Flex className={styles.qualificationTotalamount}>$ (82,199.00)</Flex>
          <Flex className={styles.qualificationTotalamount}>$ (43,827.00)</Flex>
          <Flex className={styles.qualificationTotalamount}>$ (52,712.00)</Flex>
        </Flex>
      </Flex>
      <Flex flex={1}>
        <Divider style={{ background: '#73A3B2', margin: [18, 0] }} />
      </Flex>
      <Flex flex={1} justify="space-around">
        <Flex vertical style={{ fontSize: 11 }}>
          <Flex>Min Monthly Deposit   Count</Flex>
          <Flex>Number of   Positions</Flex>
          <Flex>NSF (last 30)</Flex>
          <Flex>NSF (last 90)</Flex>
          <Flex>Negative Days (Last 30 Days)</Flex>
          <Flex>Negative Days (Last 90 Days)</Flex>
        </Flex>
        <Flex vertical style={{ fontSize: 11 }} align="flex-end">
          <Flex>15</Flex>
          <Flex>0</Flex>
          <Flex>0</Flex>
          <Flex>0</Flex>
          <Flex>0</Flex>
          <Flex>0</Flex>
        </Flex>
      </Flex>
      <QualificationMatrixForm show={openForm} handleClose={onClose} />
    </Card>
  );
}

export default QualificationMatrix;
