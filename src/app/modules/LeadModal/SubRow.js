import { Flex } from 'antd';
import classNames from 'classnames';
import styles from './LeadModal.module.scss';

function SubRow({
  lastCreated,
  lastSpoke,
  source,
  nextFollowUp,
}) {
  return (
    <Flex className={styles.subRow}>
      <Flex justify="space-between" flex={1}>
        <Flex>
          <Flex className={classNames(styles.subRowItem, styles.marginRight)}>
            <Flex className={styles.subHeadingLabel}>Last Created: </Flex>
            <Flex className={styles.subHeadingValue}>{lastCreated || '-'}</Flex>
          </Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Source: </Flex>
            <Flex
              className={styles.subHeadingValue}
            >
              {source || '-'}
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Last Spoke to Client: </Flex>
            <Flex className={styles.subHeadingValue}>{lastSpoke || '-'}</Flex>
          </Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Next Follow Up with Client: </Flex>
            <Flex className={styles.subHeadingValue}>{nextFollowUp || '-'}</Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SubRow;
