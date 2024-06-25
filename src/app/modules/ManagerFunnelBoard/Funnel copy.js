/* eslint-disable consistent-return */
/* eslint-disable no-unsafe-optional-chaining */
import { Funnel } from '@ant-design/plots';
import { useEffect, useState } from 'react';

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
function FunnelChart({ data }) {
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
  const config = {
    data: funnelData,
    xField: 'stage',
    yField: 'number',
    legend: false,
    onReady: ({ chart }) => {
      chart.on('element:click', (event) => console.log(event.data));
    },
    label: [
      {
        text: (d) => `${d.stage}\n${d.number}(${((d.number / data.new?.length) * 100).toFixed(2)}%)}`,
        position: 'inside',
        fill: 'white',
        stroke: 'white',
        strokeOpacity: '0.2',
      },
      {
        render: ($, _, i) => {
          if (i) {
            return (
              <div
                style={{
                  height: 1,
                  width: 30,
                  background: '#aaa',
                  marginTop: -60,
                }}
              />
            );
          }
        },
        position: 'right',
      },
      {
        text: (d, i) => {
          if (i) return d.missed ? `${d.missed}(Off track)` : '';
        },
        position: 'right',
        textAlign: 'middle',
        textBaseline: 'bottom',
        fill: 'white',
        stroke: 'white',
        strokeOpacity: '0.2',
        dx: 50,
        dy: -65,
      },
    ],
  };
  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <Funnel {...config} />
  );
}

export default FunnelChart;
