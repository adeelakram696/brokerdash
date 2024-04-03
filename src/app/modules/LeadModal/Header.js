import { Flex, Select } from 'antd';
import classNames from 'classnames';
import { FireFilledIcon } from 'app/images/icons';
import styles from './LeadModal.module.scss';

function ModalHeader() {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Flex justify="space-between" flex={0.65}>
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
      <Flex justify="flex-start" flex={0.35}>
        <Flex className={styles.applicationState}>
          Renewel
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ModalHeader;
