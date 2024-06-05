import {
  Flex,
} from 'antd';
import { MatrixContext } from 'utils/contexts';
import { useEffect, useState } from 'react';
import { getAllNewLeadsPages, getAllSubmittedDeals } from 'app/apis/query';
import { env } from 'utils/constants';
import NewLeads from './NewLeads';
import NewDealsSubmitted from './NewDealsSubmitted';
import LeadsWithOfferToPitch from './LeadsWithOfferToPitch';
import TotalDeclines from './TotalDeclines';
import { transformData } from './NewLeads/transform';
import NewDealsPitched from './NewDealsPitched';
import FundedDeals from './FundedDeals';
import FundedDealsAmount from './FundedDealsAmount';

function DailyMatricsModule() {
  const goalTime = 60;
  const dealGoal = 30;
  const pitchedGoal = 80;
  const [newLeads, setNewLeads] = useState([]);
  const [submittedDeals, setSubmittedDeals] = useState([]);
  // const [channels, setChannels] = useState([]);
  const getNewLeadsData = async () => {
    const items = await getAllNewLeadsPages();
    const transformed = transformData(items);
    setNewLeads(transformed);
  };
  const getSubmittedDeals = async () => {
    const items = await getAllSubmittedDeals();
    setSubmittedDeals(items);
  };
  // const getChannels = async () => {
  //   const res = await fetchBoardColumnStrings(env.boards.leads, columnIds.leads.channel);
  //   setChannels(res);
  // };
  // useEffect(() => {
  //   getChannels();
  // }, []);
  useEffect(() => {
    getNewLeadsData();
    const intervalId1 = setInterval(getNewLeadsData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId1);
    };
  }, []);
  useEffect(() => {
    getSubmittedDeals();
    const intervalId = setInterval(getSubmittedDeals, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <MatrixContext.Provider
      value={{
        goalTime,
        dealGoal,
        pitchedGoal,
        newLeads,
        // channels,
        submittedDeals,
        // getChannels,
        getNewLeadsData,
        getSubmittedDeals,
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
