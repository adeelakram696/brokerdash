/* eslint-disable no-unused-vars */
import { DatePicker, Flex, Tooltip } from 'antd';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { updateClientInformation, updateSimpleColumnValue } from 'app/apis/mutation';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import SelectField from 'app/components/Forms/SelectField';
import { getColumnValue } from 'utils/helpers';
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
  const handleFollowUpDateChange = async (date) => {
    await updateClientInformation(leadId, details?.board?.id, {
      [columnIds[board].next_followup]: date?.utc().format('YYYY-MM-DD HH:mm:ss'),
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
    const value = getColumnValue(details.column_values, columnIds[board].next_followup);
    const timeFormated = dayjs.utc(`${value.date} ${value.time ? value.time : '10:00:00'}`).format();
    setFollowUpDate(dayjs(timeFormated));
  }, [details]);
  const datePicker = (
    <Flex className={styles.subHeadingValue}>
      <DatePicker
        value={followUpDate}
        onChange={handleFollowUpDateChange}
        status={!followUpDate ? 'error' : 'success'}
        showTime={{ format: 'HH:mm A', use12Hours: true }}
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
