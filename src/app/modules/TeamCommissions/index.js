import {
  Flex, Spin, DatePicker,
} from 'antd';
import {
  fetchUser, fetchUsers, getCommissionSettings, getDealsFundedByMonth,
} from 'app/apis/query';
import { useEffect, useRef, useState } from 'react';
import SelectField from 'app/components/Forms/SelectField';
import classNames from 'classnames';
import dayjs from 'dayjs';
import IconImg from 'app/components/IconImg';
import { logo } from 'app/images';
import { columnIds } from 'utils/constants';
import styles from './TeamCommissions.module.scss';
import { transformData } from './transform';
import DataTableComissions from './DataTable';
import TierTable from './TiersCard';
import MonthlySummary from './MonthlySummary';

function TeamCommissions({ isUser }) {
  const me = fetchUser();
  const monthR = useRef();
  const selectedUserRef = useRef();
  const [data, setData] = useState([]);
  const [commissionTier, setCommissionTier] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(isUser ? me.id : null);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const fetchData = async (selectedMonth, user, showLoading = true) => {
    setLoading(true && showLoading);
    const res = await getDealsFundedByMonth(user, selectedMonth);
    setLoading(false);
    const transformed = transformData(res);
    setData(transformed);
  };
  const fetchCommisionTier = async (user) => {
    const res = await getCommissionSettings(user);
    setCommissionTier(res);
  };

  useEffect(() => {
    selectedUserRef.current = isUser ? me.id : selectedUser;
    monthR.current = month;
    fetchData(month, selectedUser);
  }, [month, selectedUser]);

  useEffect(() => {
    fetchCommisionTier(selectedUser);
  }, [selectedUser]);

  const handleChangeMonth = (val) => {
    monthR.current = val;
    setMonth(val);
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
    monthR.current = dayjs();
    if (!isUser) getUsersList();
  }, []);
  const totalGCI = data.reduce((prev, curr) => (prev + Number(curr.total_gross)), 0);
  const selectedTier = commissionTier.find((tierData) => {
    const min = tierData[columnIds.commissionSettings.min_cgi];
    const max = tierData[columnIds.commissionSettings.max_cgi];
    return totalGCI >= min && totalGCI <= max;
  }) || {};
  return (
    <Flex vertical>
      <Spin tip="Loading..." spinning={loading} fullscreen />
      <Flex flex={1} justify="space-around">
        <Flex flex={0.3} vertical>
          <Flex className={styles.logo} justify="center">
            <div
              className={styles.backgroundImage}
            >
              <IconImg path={logo} />
            </div>
          </Flex>
          <Flex justify="center" align="center" vertical>
            {!isUser ? (
              <Flex className={styles.filterField}>
                <SelectField
                  classnames={classNames(styles.usersList)}
                  options={usersList}
                  onChange={setSelectedUser}
                  placeholder="Users"
                  value={selectedUser}
                  allowClear
                  loading={usersList.length === 0}
                />
              </Flex>
            ) : null}
            <Flex className={styles.filterField}>
              <DatePicker
                className={classNames(styles.filterFieldDatePicker)}
                picker="month"
                value={month}
                placeholder="Select Month"
                onChange={handleChangeMonth}
                allowClear={false}
                maxDate={dayjs()}
                format="MMM YYYY"
              />
            </Flex>
          </Flex>
        </Flex>
        <TierTable commissionTier={commissionTier} selectedTier={selectedTier} />
        <MonthlySummary
          data={data}
          totalGCI={totalGCI}
          selectedTier={selectedTier}
        />
      </Flex>
      <DataTableComissions data={data} />
    </Flex>
  );
}

export default TeamCommissions;
