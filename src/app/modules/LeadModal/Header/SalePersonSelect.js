import {
  Dropdown, Flex, Modal,
  Spin,
} from 'antd';
import { columnIds } from 'utils/constants';
import { useContext, useEffect, useState } from 'react';
import { updateClientInformation } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import { fetchUser, fetchUsers } from 'app/apis/query';

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
    const dataJson = { [columnIds[board].assginee]: { personsAndTeams: [{ id, kind: 'person' }] } };
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
    if (isAdmin) getUsersList();
  }, []);

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
        <b style={{ marginLeft: 5, cursor: 'pointer' }}>{(board === 'deals' ? details[columnIds.deals.agent] : details[columnIds.leads.sales_rep]) || '-- Select --'}</b>
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
    </Flex>
  );
}

export default SalePersonSelect;
