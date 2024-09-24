/* eslint-disable react/no-array-index-key */
import {
  Flex,
} from 'antd';
import classNames from 'classnames';
import { useContext } from 'react';
import { LeadContext } from 'utils/contexts';
import { boardNames, columnIds } from 'utils/constants';
import styles from './SubmissionForm.module.scss';

function QualificationCheck({ data }) {
  const {
    board, details,
  } = useContext(LeadContext);
  const isDeal = board === boardNames.deals;
  const state = isDeal ? details.clientAccount[columnIds
    .clientAccount.state_incorporated] : details[columnIds[board].state_incorporated];
  return (
    <Flex vertical>
      <Flex className={styles.listContainer} vertical>
        {data.map(({
          name, key, handleClick,
        }) => (
          <Flex
            key={key}
            className={classNames(
              styles.listItemRow,
              styles.qualityCheckListItem,
            )}
            justify="space-between"
            onClick={() => { handleClick({ state }); }}
          >
            <Flex>
              {name}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default QualificationCheck;
