/* eslint-disable react/no-array-index-key */
import {
  Flex,
} from 'antd';
import { StarIcon } from 'app/images/icons/StarIcon';
import classNames from 'classnames';
import styles from './SubmissionForm.module.scss';

function QualificationCheck({ selectedItems, handleSelect, data }) {
  return (
    <Flex vertical>
      <Flex className={styles.listContainer} vertical>
        {data.map(({
          name, isStar, status, key,
        }) => (
          <Flex
            key={key}
            className={classNames(
              styles.listItemRow,
              { [styles.selectedItem]: selectedItems.includes(key) },
            )}
            onClick={() => {
              handleSelect(key);
            }}
            justify="space-between"
          >
            <Flex className={styles.listTitle}>
              <Flex className={styles.listIcon} align="center" style={{ visibility: isStar ? 'visible' : 'hidden' }}><StarIcon /></Flex>
              {name}
            </Flex>
            <Flex className={styles.listStatus}>{status}</Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default QualificationCheck;
