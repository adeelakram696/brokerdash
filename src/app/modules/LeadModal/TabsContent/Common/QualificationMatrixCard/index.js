import {
  Flex, Button,
} from 'antd';
import { QuestionIcon, ThumbsUpIcon } from 'app/images/icons';
import en from 'app/locales/en';
import TooltipWrap from 'app/components/TooltipWrap';
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
  return (
    <Flex flex={0.6} className={styles.qualificationCard}>
      <Flex justify="center" align="center">
        <Button className={styles.qulificationBtn} type="primary" shape="round" icon={<ThumbsUpIcon />}>
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
          <Flex vertical>
            <Flex>Rapid Finance </Flex>
            <Flex>Fora Financial</Flex>
            <Flex>National Funding</Flex>
            <Flex>Credibly</Flex>
          </Flex>
          <Flex vertical>
            <Flex>Kabbage</Flex>
            <Flex>OnDeck</Flex>
            <Flex>BlueVine</Flex>
            <Flex>BFS Capital</Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default QualificationMatrixCard;
