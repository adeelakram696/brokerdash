import {
  Button, Flex, List, Modal,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import styles from './SubmissionForm.module.scss';

export function SubmissionErrors({ show, errors, handleClose }) {
  return (
    <Modal
      open={show}
      title="Submission Requirements"
      onCancel={handleClose}
      closeIcon={<CloseCircleFilled />}
      footer={(
        <Flex justify="flex-end">
          <Button
            onClick={handleClose}
            className={styles.footerSubmitCTA}
            type="primary"
            shape="round"
          >
            Ok
          </Button>
        </Flex>
)}
    >
      {errors.map((error) => (
        <List
          className={styles.errorList}
          header={<Flex className={styles.errorFunderName}>{error.funder}</Flex>}
          bordered
          dataSource={error.errors}
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />

      ))}
    </Modal>
  );
}
