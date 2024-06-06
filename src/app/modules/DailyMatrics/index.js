import {
  Flex,
} from 'antd';
import { MatrixContext } from 'utils/contexts';
import { useEffect, useRef, useState } from 'react';
import { fetchMetricsGoals, getAllNewLeadsPages, getAllSubmittedDeals } from 'app/apis/query';
import { columnIds, env } from 'utils/constants';
import dayjs from 'dayjs';
import monday from 'utils/mondaySdk';
import NewLeads from './NewLeads';
import NewDealsSubmitted from './NewDealsSubmitted';
import LeadsWithOfferToPitch from './LeadsWithOfferToPitch';
import TotalDeclines from './TotalDeclines';
import { transformData } from './NewLeads/transform';
import NewDealsPitched from './NewDealsPitched';
import FundedDeals from './FundedDeals';
import FundedDealsAmount from './FundedDealsAmount';

function DailyMatricsModule() {
  let unsubscribe;
  const [goals, setGoals] = useState({});
  const [newLeads, setNewLeads] = useState([]);
  const [submittedDeals, setSubmittedDeals] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const dateR = useRef();
  const getNewLeadsData = async (dates) => {
    const items = await getAllNewLeadsPages(dates);
    const transformed = transformData(items);
    setNewLeads(transformed);
  };
  const getSubmittedDeals = async (dates) => {
    const items = await getAllSubmittedDeals(dates);
    setSubmittedDeals(items);
  };
  const getGoals = async () => {
    const resp = await fetchMetricsGoals();
    setGoals(resp);
  };
  useEffect(() => {
    getGoals();
    unsubscribe = monday.listen('events', getGoals);
    return () => {
      if (!unsubscribe) return;
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    dateR.current = [dayjs(), dayjs()];
    getNewLeadsData(dateRange);
    const intervalId1 = setInterval(() => {
      getNewLeadsData(dateR.current);
    }, (1000 * env.performanceRefetchTime));
    return () => {
      clearInterval(intervalId1);
    };
  }, []);
  useEffect(() => {
    getSubmittedDeals(dateRange);
    const intervalId = setInterval(() => {
      getSubmittedDeals(dateR.current);
    }, (1000 * env.performanceRefetchTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const handleChangeDates = (val) => {
    setDateRange(val);
    getNewLeadsData(val);
    getSubmittedDeals(val);
    dateR.current = val;
  };
  return (
    <MatrixContext.Provider
      value={{
        goalTime: +goals[columnIds.metrics.leadGoal],
        dealGoal: +goals[columnIds.metrics.leadSubmissionGoal],
        pitchedGoal: +goals[columnIds.metrics.dealPitchGoal],
        newLeads,
        submittedDeals,
        dateRange,
        getNewLeadsData,
        getSubmittedDeals,
        handleChangeDates,
      }}
    >
      <Flex justify="center" align="center" vertical>
        <NewLeads />
        <Flex>
          <Flex>
            <NewDealsSubmitted />
          </Flex>
          <Flex>
            <LeadsWithOfferToPitch />
          </Flex>
          <Flex>
            <TotalDeclines />
          </Flex>
        </Flex>
        <Flex>
          <Flex>
            <NewDealsPitched />
          </Flex>
          <Flex>
            <FundedDeals />
          </Flex>
          <Flex>
            <FundedDealsAmount />
          </Flex>
        </Flex>
      </Flex>
    </MatrixContext.Provider>
  );
}

export default DailyMatricsModule;
