import {
  Flex,
  Card,
  DatePicker,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MatrixContext } from 'utils/contexts';
import Legends from 'app/components/Legends';
import dayjs from 'dayjs';
import PieChart from './PieChart';
import styles from './NewLeadsChart.module.scss';

const { RangePicker } = DatePicker;
function NewLeadsChart() {
  const {
    newLeads, dateRange, handleChangeDates,
  } = useContext(MatrixContext);
  const [leadsChannel, setLeadsChannel] = useState({});
  useEffect(() => {
    if (!(newLeads)) return;
    const formatedList = newLeads?.reduce((prev, curr) => {
      const obj = prev;
      const channel = curr.channel === null ? 'None' : curr.channel;
      if (obj[channel]) {
        obj[channel] += 1;
      } else {
        obj[channel] = 1;
      }
      return obj;
    }, {});
    setLeadsChannel(formatedList);
  }, [newLeads]);
  return (
    <Card
      className={styles.card}
      title="New Leads"
      extra={(
        <RangePicker
          value={dateRange}
          placeholder="Select Date Range"
          onChange={handleChangeDates}
          allowClear={false}
          maxDate={dayjs()}
          format="MM-DD-YYYY"
        />
      )}
    >
      <Flex justify="space-around">
        <Flex>
          <PieChart data={leadsChannel} total={newLeads.length} />
        </Flex>
        <Legends data={leadsChannel} />
      </Flex>
    </Card>
  );
}

export default NewLeadsChart;
