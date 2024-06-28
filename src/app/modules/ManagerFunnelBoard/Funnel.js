/* eslint-disable consistent-return */
/* eslint-disable no-unsafe-optional-chaining */
import { Funnel } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { legendColors } from 'utils/constants';

const intialData = [
  { stage: 'New Leads', number: 0 },
  { stage: 'New Leads Spoken To', number: 0 },
  { stage: 'Leads with Docs Collected', number: 0 },
  { stage: 'Submissions', number: 0 },
  { stage: 'Approvals', number: 0 },
  { stage: 'Pitched', number: 0 },
  { stage: 'Contracts Out', number: 0 },
  { stage: 'Contracts Signed', number: 0 },
  { stage: 'Funded', number: 0 },
];
function FunnelChart({
  data,
  setSelectedStageData,
  selectedStageData,
}) {
  const [funnelData, setFunnelData] = useState(intialData);
  useEffect(() => {
    setFunnelData([
      { stage: 'New Leads', number: data.new?.length, data: data.new },
      {
        stage: 'New Leads Spoken To',
        number: data.newLeadsSpokenTo?.length,
        missed: data.newLeadsNotSpokenTo?.length,
        data: data.newLeadsSpokenTo,
        excludedData: data.newLeadsNotSpokenTo,
      },
      {
        stage: 'Leads with Docs Collected',
        number: data.leadsWithDocsCollected?.length,
        missed: data.leadsWithDocsNotCollected?.length,
        data: data.leadsWithDocsCollected,
        excludedData: data.leadsWithDocsNotCollected,
      },
      {
        stage: 'Submissions',
        number: data.submissions?.length,
        missed: data.noSubmissions?.length,
        data: data.submissions,
        excludedData: data.noSubmissions,
      },
      {
        stage: 'Approvals',
        number: data.approvals?.length,
        missed: data.noApprovals?.length,
        data: data.approvals,
        excludedData: data.noApprovals,
      },
      {
        stage: 'Pitched',
        number: data.pitched?.length,
        missed: data.notPitched?.length,
        data: data.pitched,
        excludedData: data.notPitched,
      },
      {
        stage: 'Contracts Out',
        number: data.contractsOut?.length,
        missed: data.noContractsOut?.length,
        data: data.contractsOut,
        excludedData: data.noContractsOut,
      },
      {
        stage: 'Contracts Signed',
        number: data.contractsSigned?.length,
        missed: data.noContractsSigned?.length,
        data: data.contractsSigned,
        excludedData: data.noContractsSigned,
      },
      {
        stage: 'Funded',
        number: data.funded?.length,
        missed: data.notFunded?.length,
        data: data.funded,
        excludedData: data.notFunded,
      },
    ]);
  }, [data]);
  useEffect(() => {
    if (selectedStageData?.number === data.new?.length) return;
    setSelectedStageData({ stage: 'New Leads', number: data.new?.length, data: data.new });
  }, [data]);
  const config = {
    data: funnelData,
    xField: 'stage',
    yField: 'number',
    legend: false,
    scale: { color: { palette: legendColors } },
    onReady: ({ chart }) => {
      chart.on('element:click', (event) => setSelectedStageData(event.data.data));
    },
    label: [
      {
        text: (d) => `${d.stage}\n${d.number}(${((d.number / data.new?.length) * 100).toFixed(2)}%)`,
        position: 'inside',
        fill: 'white',
        stroke: 'white',
        strokeOpacity: '0.2',
      },
    ],
  };
  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <Funnel {...config} />
  );
}

export default FunnelChart;
