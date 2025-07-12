import {
  DatePicker,
  Flex,
  Spin,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { fetchUser, fetchUsers } from 'app/apis/query';
import dayjs from 'dayjs';
import SelectField from 'app/components/Forms/SelectField';
import classNames from 'classnames';
import { env } from 'utils/constants';
import { getThisWeekLeadsDeals } from './queries';
import styles from './ManagerFunnelBoard.module.scss';
import FunnelChart from './Funnel';
import { transformToFunnel } from './transformData';
import DataList from './DataList';
import { durations, durationsDates } from './data';

const { RangePicker } = DatePicker;

function ManagerFunnelBoardModule({ isUser }) {
  const [data, setData] = useState({});
  const me = fetchUser();
  const dateR = useRef();
  const selectedUserRef = useRef();
  const [selectedStageData, setSelectedStageData] = useState({
    stage: 'New Leads',
    number: data.new?.length,
    data: data?.new,
  });
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(isUser ? me.id : null);
  const [dateRange, setDateRange] = useState(durationsDates.thisWeek);
  const [duration, setDuration] = useState(['thisWeek']);
  const [loading, setLoading] = useState(false);
  const fetchData = async (dates, user, showLoading = true) => {
    setLoading(true && showLoading);
    const res = await getThisWeekLeadsDeals(dates, user);
    const transformed = transformToFunnel(res, dates, !showLoading);
    setLoading(false);
    setData(transformed);
  };
  useEffect(() => {
    selectedUserRef.current = isUser ? me.id : selectedUser;
    dateR.current = dateRange;
    fetchData(dateRange, selectedUser);
  }, [dateRange, selectedUser]);
  const handleChangeDates = (val) => {
    dateR.current = val;
    setDateRange(val);
  };
  const handleRangeDates = (val) => {
    setDateRange(durationsDates[val]);
    dateR.current = durationsDates[val];
    setDuration(val);
  };
  const getUsersList = async () => {
    const res = await fetchUsers();
    const list = (res || []).map((u) => ({
      label: u.name,
      value: u.id,
    }));
    setUsersList(list);
  };
  useEffect(() => {
    selectedUserRef.current = isUser ? me.id : null;
    dateR.current = durationsDates.thisWeek;
    if (!isUser) getUsersList();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(
      () => { fetchData(dateR.current, selectedUserRef.current, false); }
      , (1000 * env.intervalTime),
    );
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  return (
    <Flex flex={1}>
      <Spin tip="Fetching Data..." spinning={loading} fullscreen />
      <Flex flex={0.3} className={styles.leftCol} vertical>
        <Flex justify="flex-end">
          {!isUser ? (
            <Flex className={styles.filterField}>
              <SelectField
                classnames={classNames(styles.durations, 'funnelFilterField')}
                options={usersList}
                onChange={setSelectedUser}
                placeholder="Users"
                value={selectedUser}
                allowClear
              />
            </Flex>
          ) : null}
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
