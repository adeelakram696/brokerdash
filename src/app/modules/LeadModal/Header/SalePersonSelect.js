import {
  Dropdown, Flex, Modal,
  Spin,
} from 'antd';
import { columnIds } from 'utils/constants';
import { useContext, useEffect, useState } from 'react';
import { updateClientInformation } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import { fetchUser, fetchUsers } from 'app/apis/query';
import { getColumnValue } from 'utils/helpers';
import SharePerson from './SharePerson';

function SalePersonSelect() {
  const {
    leadId, board, details, getData,
  } = useContext(LeadContext);
  const [usersList, setUsersList] = useState([]);
  const [showLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const isAdmin = fetchUser().is_admin;
  const hideModal = () => {
    setSelectedUser('');
  };
  const handleUpdateAssignee = async () => {
    const id = selectedUser;
    setLoading(true);
    let persons = getColumnValue(details.column_values, columnIds[board].assginee);
    if (!persons.personsAndTeams) persons = { personsAndTeams: [{ id, kind: 'person' }] };
    else persons.personsAndTeams[0] = { id, kind: 'person' };
    const dataJson = { [columnIds[board].assginee]: { personsAndTeams: persons.personsAndTeams } };
    await updateClientInformation(leadId, details.board.id, dataJson);
    setLoading(false);
    hideModal();
    getData();
  };
  const getUsersList = async () => {
    const res = await fetchUsers();
    const list = (res || []).map((u) => ({
      label: u.name,
      key: u.id,
    }));
    setUsersList(list);
  };
  const handleSaleRepSelect = ({ key }) => {
    setSelectedUser(key);
  };
  useEffect(() => {
    getUsersList();
  }, []);
  const assingee = details[columnIds[board].assginee];
  return (
    <Flex>
      Assigned To
      {' '}
      {' '}
      <Dropdown
        menu={{
          items: usersList,
          onClick: handleSaleRepSelect,
        }}
        trigger={['click']}
        disabled={!isAdmin}
      >
        <b style={{ marginLeft: 5, cursor: 'pointer' }}>{((assingee) || '-- Select --').split(',')[0]}</b>
      </Dropdown>
      <Modal
        title="Update Assginee"
        open={selectedUser}
        onOk={handleUpdateAssignee}
        onCancel={hideModal}
        okText="Yes"
        cancelText="No"
      >
        <Spin spinning={showLoading} fullscreen />
        <p>
          Are you sure to update this assginee?
        </p>
      </Modal>
      <Flex>
        <SharePerson usersList={usersList} />
      </Flex>
    </Flex>
  );
}

export default SalePersonSelect;
