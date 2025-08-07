import {
  Flex,
} from 'antd';
import {
  DragingIcon, ExpendCollapseIcon,
} from 'app/images/icons';
import { useState } from 'react';
import InputField from 'app/components/Forms/InputField';
import { columnIds } from 'utils/constants';
import { safeJsonParse } from 'utils/helpers';
import classNames from 'classnames';
import styles from './FundersList.module.scss';
import ExpendedData from './ExpendedData';
import DataRow from './DataRow';
import { productTypes } from './data';

function FundingOffer({
  data,
}) {
  const [isExpended, setIsExpended] = useState(false);
  const typeColor = productTypes.find(
    (item) => (item.value === data[columnIds.subItem.product_type]),
  );
  const apiResponse = safeJsonParse(data[columnIds.subItem.api_submission_response]);
  console.log(apiResponse);
  return (
    <Flex style={{ marginBottom: 10, paddingRight: 10 }}>
      <Flex style={{ background: typeColor?.color }} className={styles.dndContainer} vertical justify="space-between">
        <Flex className={styles.draggingIconStart}><DragingIcon color={typeColor.color2} /></Flex>
        <Flex style={{ color: typeColor.fontColor || '#FFF' }} className={styles.typeText}>{data[columnIds.subItem.product_type] || '-'}</Flex>
        <Flex className={styles.draggingIconEnd}><DragingIcon color={typeColor.color2} /></Flex>
      </Flex>
      <Flex className={classNames(styles.contentContainer, { [styles.failed]: apiResponse?.errorMsg === 'Submission Failed' })}>
        <Flex vertical flex={1}>
          <DataRow
            data={data}
          />
          <Flex vertical>
            <Flex justify="flex-end">
              <Flex className={styles.notesLabel} align="center">Notes</Flex>
              <Flex flex={0.95}><InputField placeholder="Notes" value={data.notes} classnames={styles.notesInput} readOnly /></Flex>
              <Flex
                style={{ marginLeft: 10 }}
                onClick={() => { setIsExpended(!isExpended); }}
              >
                <ExpendCollapseIcon isExpend={isExpended} />
              </Flex>
            </Flex>
            <Flex className={styles.failedMessage} justify="flex-end">
              {apiResponse?.errorMsg === 'Submission Failed' ? (
                <Flex className={styles.errorText} flex={0.95}>
                  Submission Failed due to
                  {apiResponse?.message}
                </Flex>
              ) : null}
            </Flex>
            <ExpendedData isExpended={isExpended} data={data} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default FundingOffer;
