/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import {
  DatePicker,
  Flex,
  Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import { getThisWeekLeadsDeals } from 'app/apis/query';
import dayjs from 'dayjs';
import SelectField from 'app/components/Forms/SelectField';
import classNames from 'classnames';
import styles from './ManagerFunnelBoard.module.scss';
import FunnelChart from './Funnel';
import { transformToFunnel } from './transformData';
import DataList from './DataList';
import { durations, durationsDates } from './data';

const { RangePicker } = DatePicker;

function ManagerFunnelBoardModule() {
  const [data, setData] = useState([]);
  const [selectedStageData, setSelectedStageData] = useState({});
  const [dateRange, setDateRange] = useState(durationsDates.thisWeek);
  const [duration, setDuration] = useState(['thisWeek']);
  const [loading, setLoading] = useState(false);
  const fetchData = async (dates) => {
    setLoading(true);
    const res = await getThisWeekLeadsDeals(dates);
    const transformed = transformToFunnel(res, dates);
    setLoading(false);
    setData(transformed);
  };
  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);
  const handleChangeDates = (val) => {
    setDateRange(val);
  };
  const handleRangeDates = (val) => {
    setDateRange(durationsDates[val]);
    setDuration(val);
  };
  return (
    <Flex flex={1}>
      <Spin tip="Fetching Data..." spinning={loading} fullscreen />
      <Flex flex={0.3} className={styles.leftCol} vertical>
        <Flex justify="flex-end">
          <Flex className={styles.filterField}>
            <SelectField
              classnames={classNames(styles.durations, 'funnelFilterField')}
              options={durations}
              onChange={handleRangeDates}
              placeholder="Select Duration"
              value={duration}
            />
          </Flex>
          <Flex className={styles.filterField}>
            <RangePicker
              className={classNames(styles.filterFieldDatePicker, 'funnelFilterField')}
              value={dateRange}
              placeholder="Select Date Range"
              onChange={handleChangeDates}
              allowClear={false}
              maxDate={dayjs()}
              format="MM-DD-YYYY"
            />
          </Flex>
        </Flex>
        <Flex className={styles.funnelChart}>
          <FunnelChart
            data={data}
            setSelectedStageData={setSelectedStageData}
            selectedStageData={selectedStageData}
          />
        </Flex>
      </Flex>
      <Flex flex={0.7} className={styles.dataTable}>
        <DataList data={selectedStageData} />
      </Flex>
    </Flex>
  );
}

export default ManagerFunnelBoardModule;
