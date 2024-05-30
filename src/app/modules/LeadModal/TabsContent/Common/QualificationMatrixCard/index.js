import {
  Flex, Button,
} from 'antd';
import { QuestionIcon, ThumbsUpIcon } from 'app/images/icons';
import en from 'app/locales/en';
import TooltipWrap from 'app/components/TooltipWrap';
import QualificationMatrixForm from 'app/modules/LeadModal/QualificationMatrixForm';
import { useContext, useState } from 'react';
import { LeadContext } from 'utils/contexts';
import { columnIds } from 'utils/constants';
import styles from './style.module.scss';

export function QualificationToolTip() {
  return (
    <Flex vertical className={styles.tooltipContainer}>
      Based on qualification matrix data.
      We have found 8 possible funders that you may want to submit the application to.
    </Flex>
  );
}

function QualificationMatrixCard() {
  const {
    details, board,
  } = useContext(LeadContext);
  const [openForm, setOpenForm] = useState();
  const onClose = () => {
    setOpenForm(false);
  };
  const suggestedFunders = details?.name
    ? JSON.parse(details[columnIds[board].qm_suggested_funders] || '[]')
    : [];
  return (
    <Flex flex={0.6} className={styles.qualificationCard}>
      <Flex justify="center" align="center">
        <Button onClick={() => { setOpenForm(true); }} className={styles.qulificationBtn} type="primary" shape="round" icon={<ThumbsUpIcon />}>
          {en.titles.qualificationMatrix}
        </Button>
      </Flex>
      <Flex style={{ marginLeft: 10 }} justify="center" align="center">
        <TooltipWrap title={<QualificationToolTip />}>
          <Flex>
            <QuestionIcon />
          </Flex>
        </TooltipWrap>
      </Flex>
      <Flex vertical style={{ marginLeft: 10 }}>
        <Flex className={styles.heading3}>Suggested Funder to submit to</Flex>
        <Flex className={styles.qualificationList} justify="space-around">
          <Flex flex={1} wrap="wrap" justify="flex-start">
            {suggestedFunders.map((v) => (
              <Flex style={{ width: '45%' }}>
                {v}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <QualificationMatrixForm show={openForm} handleClose={onClose} />
    </Flex>
  );
}

export default QualificationMatrixCard;
