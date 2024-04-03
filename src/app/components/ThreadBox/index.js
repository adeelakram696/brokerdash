/* eslint-disable max-len */
import { Flex } from 'antd';
import {
  BellIcon, ThreeDotsIcon,
} from 'app/images/icons';
import styles from './ThreadBox.module.scss';

function ThreadBox({
  text, time, type, typeIcon,
}) {
  return (
    <Flex className={styles.activityThreadContainer} vertical>
      <Flex flex={1} align="center" justify="space-between">
        <Flex align="center">
          <Flex className={styles.threadIcon}>{typeIcon}</Flex>
          <Flex className={styles.threadTypeTitle}>{type}</Flex>
        </Flex>
        <Flex align="center" className={styles.activityThreadOptions}>
          <Flex style={{ marginRight: 10 }}>
            {time}
          </Flex>
          <Flex style={{ marginRight: 10 }}><BellIcon /></Flex>
          <Flex><ThreeDotsIcon /></Flex>
        </Flex>
      </Flex>
      <Flex className={styles.threadComment}>
        {text}
      </Flex>
    </Flex>
  );
}

export default ThreadBox;
