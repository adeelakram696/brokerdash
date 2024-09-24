/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Flex, Dropdown } from 'antd';
import { boardNames, columnIds } from 'utils/constants';
import { TelescopeIcon } from 'app/images/icons';
import { LeadContext } from 'utils/contexts';
import { useContext } from 'react';
import { openStateUrl } from 'utils/helpers';
import styles from './ActionsRow.module.scss';

function ResearchLinks() {
  const {
    board, details,
  } = useContext(LeadContext);
  const isDeal = board === boardNames.deals;
  const state = isDeal ? details.clientAccount[columnIds
    .clientAccount.state_incorporated] : details[columnIds[board].state_incorporated];

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
          href="https://iapps.courts.state.ny.us/nyscef/CaseSearch?TAB=name"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => { e.preventDefault(); openStateUrl(state); }}
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
