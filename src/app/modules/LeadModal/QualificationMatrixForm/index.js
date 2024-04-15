import {
  Modal, Flex, Button,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import styles from './QualificationMatrixForm.module.scss';

function QualificationMatrixForm({ show, handleClose }) {
  return (
    <Modal
      open={show}
      footer={(
        <Flex justify="flex-end">
          <Button className={styles.footerSubmitCTA} type="primary" shape="round">
            Apply Changes
          </Button>
        </Flex>
)}
      onCancel={handleClose}
      className="qualificationMatrix"
      style={{ top: 20 }}
      closeIcon={<CloseCircleFilled />}
      title={(
        <Flex vertical>
          <Flex style={{ fontSize: 24 }}>Qualification Matrix</Flex>
          <Flex style={{ fontSize: 15, fontWeight: '400' }}>Created: 8/32/2024 at 3:32pm est. |  Modified Last: 8/32/2024 at 3:32pm est.</Flex>
        </Flex>
)}
    >
      <Flex vertical />
    </Modal>
  );
}
export default QualificationMatrixForm;
