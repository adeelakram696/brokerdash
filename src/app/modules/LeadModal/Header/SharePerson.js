import {
  Dropdown, Flex,
  Spin,
} from 'antd';
import { columnIds } from 'utils/constants';
import { useContext, useEffect, useState } from 'react';
import { updateClientInformation } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import { getColumnValue } from 'utils/helpers';
import { ShareAltOutlined } from '@ant-design/icons';
import styles from '../LeadModal.module.scss';

function SharePerson({ usersList }) {
  const {
    leadId, board, details, getData,
  } = useContext(LeadContext);
  const assignee = getColumnValue(details.column_values, columnIds[board].assginee);
  const [showLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  useEffect(() => {
    const selected = assignee.personsAndTeams?.map((p) => p.id.toString());
    setSelectedUser(selected?.splice(1) || []);
  }, []);
  const handleSaleRepSelect = async ({ key }) => {
    let updated = [];
    if (selectedUser?.includes(key)) {
      updated = selectedUser.filter((item) => item !== key);
    } else {
      updated = [...selectedUser, key];
    }
    setSelectedUser(updated);
    setLoading(true);
    let persons = getColumnValue(details.column_values, columnIds[board].assginee);
    const payload = updated.map((id) => ({ id, kind: 'person' }));
    if (!persons.personsAndTeams) persons = { personsAndTeams: payload };
    else persons.personsAndTeams = [persons.personsAndTeams[0], ...payload];
    const dataJson = { [columnIds[board].assginee]: { personsAndTeams: persons.personsAndTeams } };
    await updateClientInformation(leadId, details.board.id, dataJson);
    setLoading(false);
    getData();
  };
  return (
    <Flex className={styles.shareBtnContainer}>
      <Spin spinning={showLoading} fullscreen />
      <Dropdown
        menu={{
          items: [...usersList.filter((u) => +u.key !== (assignee?.personsAndTeams || [])[0]?.id)],
          selectable: true,
          multiple: true,
          selectedKeys: selectedUser,
          onClick: handleSaleRepSelect,
        }}
        trigger={['click']}
      >
        <Flex className={styles.shareBtn}>
          <ShareAltOutlined />
          <Flex align="center" className={styles.shareText}>Share</Flex>
        </Flex>
      </Dropdown>
    </Flex>
  );
}

export default SharePerson;
