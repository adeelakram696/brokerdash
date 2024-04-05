import {
  Flex, Button,
} from 'antd';
import { QuestionIcon, ThumbsUpIcon } from 'app/images/icons';
import en from 'app/locales/en';
import styles from './style.module.scss';

function QualificationMatrixCard() {
  return (
    <Flex flex={0.6} className={styles.qualificationCard}>
      <Flex justify="center" align="center">
        <Button className={styles.qulificationBtn} type="primary" shape="round" icon={<ThumbsUpIcon />}>
          {en.titles.qualificationMatrix}
        </Button>
      </Flex>
      <Flex style={{ marginLeft: 10 }} justify="center" align="center">
        <QuestionIcon />
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
