import {
  Flex,
} from 'antd';
import styles from './SubmissionsTab.module.scss';

function SubmissionsTab() {
  return (
    <Flex>
      <Flex className={styles.dndContainer} vertical justify="space-between">
        <Flex>.</Flex>
        <Flex className={styles.typeText}>MCA</Flex>
        <Flex>.</Flex>
      </Flex>
      <Flex className={styles.contentContainer} vertical>
        <Flex>asdfasdf</Flex>
        <Flex>asdfasdf</Flex>
        <Flex>asdfasdf</Flex>
        <Flex>asdfasdf</Flex>
        <Flex>asdfasdf</Flex>
      </Flex>
    </Flex>
  );
}

export default SubmissionsTab;
