/* eslint-disable react/no-array-index-key */
import {
  Flex,
} from 'antd';
import { StarIcon } from 'app/images/icons/StarIcon';
import classNames from 'classnames';
import { LeadContext } from 'utils/contexts';
import { useContext } from 'react';
import styles from './SubmissionForm.module.scss';

function SelectFunders({ selectedItems, handleSelect }) {
  const {
    funders,
  } = useContext(LeadContext);
  return (
    <Flex vertical>
      <Flex className={styles.listContainer} vertical>
        {funders.map(({
          name, isStar, status, id,
        }) => (
          <Flex
            key={id}
            className={classNames(
              styles.listItemRow,
              { [styles.selectedItem]: selectedItems.includes(id) },
            )}
            onClick={() => {
              handleSelect(id);
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
