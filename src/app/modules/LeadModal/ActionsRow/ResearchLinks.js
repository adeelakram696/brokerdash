import { Flex, Dropdown } from 'antd';
import { columnIds } from 'utils/constants';
import { TelescopeIcon } from 'app/images/icons';
import styles from './ActionsRow.module.scss';

function ResearchLinks({
  details, board,
}) {
  const items = [
    {
      label: (
        <a
          href="https://iapps.courts.state.ny.us/nyscef/CaseSearch?TAB=name"
          target="_blank"
          rel="noreferrer"
        >
          NYSCEF Check
        </a>),
      key: '0',
    },
    {
      label: (
        <a
          href={`https://www.google.com/search?q=secretary+of+state+%E2%80%9C${details[columnIds[board].home_state]?.replace(/ /g, '+')}%E2%80%9D`}
          target="_blank"
          rel="noreferrer"
        >
          SOS
        </a>),
      key: '1',
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={['click']}
    >
      <Flex>
        <Flex className={styles.actionIcon} align="center"><TelescopeIcon /></Flex>
        <Flex className={styles.actionText} align="center">Research Links</Flex>
      </Flex>
    </Dropdown>
  );
}

export default ResearchLinks;
