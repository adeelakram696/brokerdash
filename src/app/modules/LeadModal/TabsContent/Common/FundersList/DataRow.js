import {
  Flex,
  Modal,
  Spin,
} from 'antd';
import {
  PencilIcon,
} from 'app/images/icons';
import { useContext, useState } from 'react';
import FunderSubmissionForm from 'app/modules/LeadModal/FunderSubmissionForm';
import { columnIds } from 'utils/constants';
import { updateClientInformation } from 'app/apis/mutation';
import { LeadContext } from 'utils/contexts';
import styles from './FundersList.module.scss';
import { columns } from './data';

function DataRow({
  data,
}) {
  const {
    getData,
  } = useContext(LeadContext);
  const [showLoading, setLoading] = useState(false);
  const [showFunderForm, setShowFunderForm] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const [statusVal, setStatusValue] = useState();
  const handleClose = () => {
    setShowFunderForm(false);
  };
  const handleStatusChange = async () => {
    setLoading(true);
    await updateClientInformation(data.id, data.board.id, {
      [columnIds.subItem.status]: statusVal,
    });
    await getData();
    setLoading(false);
    setStatusValue(null);
    setConfirmation(false);
  };
  const handleStatusConfirm = (val) => {
    if (val === data[columnIds.subItem.status]) return;
    setStatusValue(val);
    setConfirmation(true);
  };
  const hideModal = () => {
    setConfirmation(false);
  };
  return (
    <Flex flex={1}>
      <Flex vertical flex={0.97}>
        <Flex className={styles.columnHeaderContainer} justify="space-around">
          {columns.map((column) => (
            <Flex
              flex={column.flex}
              className={styles.columnHeader}
              key={column.key}
              justify={column.align}
            >
              {column.title}
            </Flex>
          ))}
        </Flex>
        <Flex className={styles.columnDataContainer} justify="space-around">
          {columns.map((column) => (
            <Flex
              flex={column.flex}
              className={styles.columnData}
              key={column.key}
              justify={column.align}
            >
              {(column?.render) ? column.render(data[column.key], handleStatusConfirm) : data[column.key] || '-'}
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex flex={0.03} justify="flex-end">
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={() => { setShowFunderForm(true); }}
        >
          <PencilIcon />
        </Flex>
      </Flex>
      <FunderSubmissionForm
        show={showFunderForm}
        handleClose={handleClose}
        data={data}
      />
      <Modal
        title="Confirmation of Status Change"
        open={confirmation}
        onOk={handleStatusChange}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Spin spinning={showLoading} fullscreen />
        <p>
          Are you sure to change the status from
          <b style={{ margin: '0 5px' }}>{data[columnIds.subItem.status]}</b>
          {' '}
          to
          <b style={{ margin: '0 5px' }}>{statusVal}</b>
        </p>
      </Modal>
    </Flex>
  );
}

export default DataRow;
