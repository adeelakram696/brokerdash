import { useContext, useEffect, useState } from 'react';
import { Flex, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { updateClientInformation } from 'app/apis/mutation';
import { columnIds } from 'utils/constants';
import { CalenderIcon } from 'app/images/icons';
import { LeadContext } from 'utils/contexts';
import styles from './ActionsRow.module.scss';

function UpdateFollowUp() {
  const {
    leadId, board, details, getData,
  } = useContext(LeadContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(dayjs());

  const handleFollowUpDateChange = async (date, dateString) => {
    setShowDatePicker(false);
    await updateClientInformation(leadId, details?.board?.id, {
      [columnIds[board].next_followup]: dateString,
    });
    getData();
    setFollowUpDate(date);
  };
  useEffect(() => {
    if (!details.name) return;
    setFollowUpDate(dayjs(details[columnIds[board].next_followup]));
  }, [details]);
  return (
    <>
      <Flex
        className={styles.actionIcon}
        align="center"
        onClick={() => { setShowDatePicker(!showDatePicker); }}
      >
        <CalenderIcon />
      </Flex>
      <Flex onClick={() => { setShowDatePicker(!showDatePicker); }} className={styles.actionText} align="center">Schedule Follow up</Flex>
      <DatePicker
        style={{
          visibility: 'hidden', width: '0.1px', height: '0.1px', padding: 0,
        }}
        open={showDatePicker}
        value={followUpDate}
        onChange={handleFollowUpDateChange}
      />
    </>
  );
}

export default UpdateFollowUp;
