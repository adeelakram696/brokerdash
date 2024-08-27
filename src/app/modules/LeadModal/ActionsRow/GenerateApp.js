/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Flex, Dropdown } from 'antd';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { useContext } from 'react';
import { FileSyncOutlined } from '@ant-design/icons';
import { ctaBtn } from 'app/apis/mutation';
import styles from './ActionsRow.module.scss';

function GenerateApp() {
  const {
    details, setLoadingData, board,
  } = useContext(LeadContext);
  const handleAppGenClick = async (btnId) => {
    setLoadingData(true);
    await ctaBtn(details.id, details.board.id, btnId);
    setLoadingData(false);
  };
  const items = [
    {
      label: (
        <div onClick={() => { handleAppGenClick(columnIds[board].approvd_application); }}>
          Approvd App
        </div>),
      key: '0',
    },
    {
      label: (
        <div onClick={() => { handleAppGenClick(columnIds[board].logic_application); }}>
          Logic App
        </div>),
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
        <Flex className={styles.actionIcon} align="center"><FileSyncOutlined style={{ color: 'rgb(69, 121, 137)' }} /></Flex>
        <Flex className={styles.actionText} align="center">Generate App</Flex>
      </Flex>
    </Dropdown>
  );
}

export default GenerateApp;
