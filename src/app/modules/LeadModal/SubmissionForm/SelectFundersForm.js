/* eslint-disable react/no-array-index-key */
import {
  Flex,
} from 'antd';
import { StarIcon } from 'app/images/icons/StarIcon';
import classNames from 'classnames';
import styles from './SubmissionForm.module.scss';

function SelectFunders({ selectedItems, handleSelect, data }) {
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
      <Flex className={styles.footerText} justify="flex-start">
        <Flex align="center">
          <Flex className={styles.listIcon} align="center"><StarIcon /></Flex>
          <Flex style={{ marginRight: 5 }}>Favorited based on </Flex>
          <Flex className={styles.linkStyle}>Qualification matrix</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SelectFunders;
