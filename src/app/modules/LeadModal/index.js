import { Modal, Flex } from 'antd';
import { FireFilledIcon } from 'app/images/icons';

function LeadModal({ show, handleClose }) {
  return (
    <Modal
      open={show}
      footer={null}
      onCancel={handleClose}
      width="100%"
      className="leadModal"
    >
      <Flex>
        <div><FireFilledIcon /></div>
        <div>Alpine Radiant Construction</div>
      </Flex>
    </Modal>
  );
}

export default LeadModal;
