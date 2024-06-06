import { DatePicker, Flex, Tooltip } from 'antd';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { updateClientInformation } from 'app/apis/mutation';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import SelectField from 'app/components/Forms/SelectField';
import styles from '../LeadModal.module.scss';

function SubRow({
  lastCreated,
  lastSpoke,
  source,
}) {
  const {
    leadId, board, details, channels,
  } = useContext(LeadContext);
  const [followUpDate, setFollowUpDate] = useState();
  const handleFollowUpDateChange = async (date, dateString) => {
    await updateClientInformation(leadId, details?.board?.id, {
      [columnIds[board].next_followup]: dateString,
    });
    setFollowUpDate(date);
  };
  const handleChangeSource = async (val) => {
    await updateClientInformation(leadId, details?.board?.id, {
      [columnIds[board].channel]: val,
    });
  };
  useEffect(() => {
    if (!details.name || !details[columnIds[board].next_followup]) return;
    setFollowUpDate(dayjs(details[columnIds[board].next_followup]));
  }, [details]);
  const datePicker = (
    <Flex className={styles.subHeadingValue}>
      <DatePicker
        value={followUpDate}
        onChange={handleFollowUpDateChange}
        status={!followUpDate ? 'error' : 'success'}
      />
    </Flex>
  );
  const sources = channels.map((c) => ({ value: c, label: c }));
  return (
    <Flex className={styles.subRow}>
      <Flex justify="space-between" flex={1}>
        <Flex>
          <Flex className={classNames(styles.subRowItem, styles.marginRight)}>
            <Flex className={styles.subHeadingLabel}>Last Created: </Flex>
            <Flex className={styles.subHeadingValue}>{lastCreated || '-'}</Flex>
          </Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Source: </Flex>
            <Flex
              className={styles.subHeadingValue}
            >
              <SelectField
                classnames={styles.sourceSelect}
                options={sources}
                defaultValue={source}
                onChange={handleChangeSource}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Last Spoke to Client: </Flex>
            <Flex className={styles.subHeadingValue}>{lastSpoke || '-'}</Flex>
          </Flex>
          <Flex className={styles.subRowItem}>
            <Flex className={styles.subHeadingLabel}>Next Follow Up with Client: </Flex>
            {!followUpDate ? (
              <Tooltip title="Select Followup Date" open={!followUpDate}>
                {datePicker}
              </Tooltip>
            ) : datePicker}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SubRow;
