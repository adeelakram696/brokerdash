/* eslint-disable max-len */
import { Flex, Dropdown } from 'antd';
import {
  BellIcon, ThreeDotsIcon,
} from 'app/images/icons';
import classNames from 'classnames';
import styles from './ThreadBox.module.scss';

function ThreadBox({
  text, time, type, typeIcon, isHide, id, handleMarkImportant, creator,
}) {
  const handleMenuClick = (e) => {
    if (e.key === 'mark') {
      handleMarkImportant(id);
    }
  };
  const items = [
    {
      label: 'Mark as important',
      key: 'mark',
    },
  ];
  return (
    <Flex className={classNames(styles.activityThreadContainer, { [styles.hide]: isHide })} vertical>
      <Flex flex={1} align="center" justify="space-between">
        <Flex align="center">
          <Flex className={styles.threadIcon}>{typeIcon}</Flex>
          <Flex className={styles.threadTypeTitle}>
            {type}
            {' '}
            by
            {' '}
            {creator}
          </Flex>
        </Flex>
        <Flex align="center" className={styles.activityThreadOptions}>
          <Flex style={{ marginRight: 10 }}>
            {time}
          </Flex>
          <Flex style={{ marginRight: 10 }}><BellIcon /></Flex>
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            trigger={['click']}
          >
            <Flex style={{ cursor: 'pointer' }}>
              <ThreeDotsIcon />
            </Flex>
          </Dropdown>
        </Flex>
      </Flex>
      <div wrap="wrap" className={styles.threadComment} dangerouslySetInnerHTML={{ __html: text }} />
    </Flex>
  );
}

export default ThreadBox;
