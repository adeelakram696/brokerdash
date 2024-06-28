import {
  Flex,
  Steps,
  Tooltip,
} from 'antd';
import classNames from 'classnames';
import { FireFilledIcon } from 'app/images/icons';
import { boardNames, columnIds, sequenceSteps } from 'utils/constants';
import { useContext } from 'react';
import { LeadContext } from 'utils/contexts';
import { SyncOutlined } from '@ant-design/icons';
import { convertSequenceNameToKey } from 'utils/helpers';
import styles from '../LeadModal.module.scss';
import SubRow from './SubRow';
import StageSelect from './StageSelect';

function ModalHeader() {
  const {
    board, details, loadingData, refetchAllData,
  } = useContext(LeadContext);
  const sequenceKey = details[columnIds[board].sequence_name] ? convertSequenceNameToKey(details[columnIds[board].sequence_name]) : '';
  const currentStep = details[columnIds[board][sequenceKey]];
  const stepIndex = sequenceSteps[board][sequenceKey]?.findIndex(
    ({ title }) => title === currentStep,
  );
  const stepItems = sequenceSteps[board][sequenceKey]?.map((val, index) => {
    if (index < stepIndex) {
      return { ...val, status: 'finish' };
    } if (index === stepIndex) {
      return { ...val, status: 'process' };
    }
    return val;
  });
  const isDeal = board === boardNames.deals;
  const dataBoard = isDeal ? boardNames.clients : board;
  const data = isDeal ? details.client : details;
  const clientName = `${data[columnIds[dataBoard].first_name]} ${data[columnIds[dataBoard].last_name]}`;
  return (
    <>
      <Flex justify="space-between" flex={0.65}>
        <Flex>
          <Flex className={classNames(styles.logo, styles.marginRight)} align="center"><FireFilledIcon /></Flex>
          <Flex className={classNames(styles.marginRight)} align="left" vertical>
            <Flex className={styles.title}>{details.name}</Flex>
            <Flex>{clientName}</Flex>
          </Flex>
          <StageSelect />
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Sequence Name</div>
            <Tooltip
              placement="rightTop"
              color="#FFF"
              title={(
                <Steps
                  style={{
                    marginTop: 8,
                  }}
                  current={stepIndex}
                  status="process"
                  items={stepItems}
                  direction="vertical"
                />
)}
            >
              <div className={styles.statusValue}>{details[columnIds[board].sequence_name]}</div>
            </Tooltip>
          </Flex>
          <Flex className={classNames(styles.status, styles.marginRight, styles.marginTopNeg)} align="center" vertical>
            <div className={styles.statusLabel}>Current Step</div>
            <div className={styles.statusValue}>{details[columnIds[board].sequence_step]}</div>
          </Flex>
          <Flex align="center" vertical>
            <SyncOutlined onClick={refetchAllData} spin={loadingData} />
          </Flex>
        </Flex>
        <Flex justify="flex-start" flex={0.35}>
          {details[columnIds[board].type] === 'Renewal' ? (
            <Flex className={styles.applicationState}>
              {details[columnIds[board].type]}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <SubRow />
    </>
  );
}

export default ModalHeader;
