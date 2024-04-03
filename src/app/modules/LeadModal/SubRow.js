import { Flex } from 'antd';
import classNames from 'classnames';
import styles from './LeadModal.module.scss';

function SubRow() {
  return (
    <Flex className={styles.subRow}>
      <Flex justify="space-between" flex={1}>
        <Flex>
          <Flex className={classNames(styles.subRowItem, styles.marginRight)}>
            <Flex className={styles.subHeadingLabel}>Last Created: </Flex>
            <Flex className={styles.subHeadingValue}>8/30/2024 on 3:32px est.</Flex>
          </Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Source: </Flex>
            <Flex
              className={styles.subHeadingValue}
            >
              Email Campaign (small business campaign)
            </Flex>
          </Flex>
        </Flex>
        <Flex className={styles.subRowItem}>
          <Flex className={styles.subHeadingLabel}>Last Spote to Client: </Flex>
          <Flex className={styles.subHeadingValue}>8/29/23 at 2:22px</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SubRow;
