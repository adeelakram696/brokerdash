import { Modal, Flex, Select } from 'antd';
import classNames from 'classnames';
import { FireFilledIcon } from 'app/images/icons';
import styles from './LeadModal.module.scss';

function LeadModal({ show, handleClose }) {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Modal
      open={show}
      footer={null}
      onCancel={handleClose}
      width="100%"
      className="leadModal"
    >
      <Flex>
        <Flex className={classNames(styles.logo, styles.marginRight)} align="center"><FireFilledIcon /></Flex>
        <Flex className={classNames(styles.title, styles.marginRight)} align="center">
          Alpine Radiant Construction
        </Flex>
        <Flex className={classNames(styles.stageDropdown, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
          <div className={styles.statusLabel}>Stage</div>
          <Select
            className="stageDropdown"
            defaultValue="1"
            style={{ width: 144 }}
            onChange={handleChange}
            options={[
              { value: '1', label: 'Application out' },
              { value: '2', label: 'Ready' },
              { value: '3', label: 'Moved' },
            ]}
          />
        </Flex>
        <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
          <div className={styles.statusLabel}>Sequence Name</div>
          <div className={styles.statusValue}>Welcome W/O Doc & W/O Application</div>
        </Flex>
        <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
          <div className={styles.statusLabel}>Current Step</div>
          <div className={styles.statusValue}>6-12 Days Later</div>
        </Flex>
      </Flex>
    </Modal>
  );
}

export default LeadModal;
