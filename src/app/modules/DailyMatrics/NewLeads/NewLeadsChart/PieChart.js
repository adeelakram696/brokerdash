import React from 'react';
import { Pie } from '@ant-design/plots';
import { legendColors } from 'utils/constants';

function PieChart({ data, total }) {
  const chartData = Object.entries(data).map(
    ([channel, count]) => ({ type: channel, value: count }),
  );
  if (chartData.length > 0) {
    const config = {
      width: 300,
      height: 300,
      data: chartData,
      angleField: 'value',
      colorField: 'type',
      paddingRight: 0,
      innerRadius: 0.8,
      scale: { color: { palette: legendColors } },
      label: false,
      legend: false,
      tooltip: false,
      annotations: [
        {
          type: 'text',
          style: {
            text: 'Total',
            x: '50%',
            y: '35%',
            textAlign: 'center',
            fontSize: 15,
            fontStyle: 'bold',
          },
        },
        {
          type: 'text',
          style: {
            text: total.toString(),
            x: '50%',
            y: '50%',
            textAlign: 'center',
            fontSize: 70,
            fontStyle: 'bold',
          },
        },
      ],
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Pie {...config} />;
  }
  return null;
}

export default PieChart;
