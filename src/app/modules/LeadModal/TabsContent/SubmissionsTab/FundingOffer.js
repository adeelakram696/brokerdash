import {
  Flex,
} from 'antd';
import {
  DragingIcon, ExpendCollapseIcon,
} from 'app/images/icons';
import { useState } from 'react';
import InputField from 'app/components/Forms/InputField';
import styles from './SubmissionsTab.module.scss';
import ExpendedData from './ExpendedData';
import DataRow from './DataRow';

function FundingOffer({ type = '-' }) {
  const [isExpended, setIsExpended] = useState(false);
  return (
    <Flex style={{ marginBottom: 10, paddingRight: 10 }}>
      <Flex className={styles.dndContainer} vertical justify="space-between">
        <Flex className={styles.draggingIconStart}><DragingIcon /></Flex>
        <Flex className={styles.typeText}>{type}</Flex>
        <Flex className={styles.draggingIconEnd}><DragingIcon /></Flex>
      </Flex>
      <Flex className={styles.contentContainer}>
        <Flex vertical flex={1}>
          <DataRow />
          <Flex vertical>
            <Flex justify="flex-end">
              <Flex className={styles.notesLabel} align="center">Notes</Flex>
              <Flex flex={0.95}><InputField placeholder="Any note can go here and have enough room for 2 full ten character sentences." classnames={styles.notesInput} /></Flex>
              <Flex
                style={{ marginLeft: 10 }}
                onClick={() => { setIsExpended(!isExpended); }}
              >
                <ExpendCollapseIcon isExpend={isExpended} />
              </Flex>
            </Flex>
            <ExpendedData isExpended={isExpended} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default FundingOffer;
