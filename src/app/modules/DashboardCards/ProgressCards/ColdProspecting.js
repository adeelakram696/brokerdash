import drawer from 'drawerjs';
import ProgressCard from 'app/components/ProgressCard';
import { SnowIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import monday from 'utils/mondaySdk';
import { env } from 'utils/constants';

function ColdProspecting({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = () => {
    const me = drawer.get('userName');
    monday.api(`query {
      coldP: items_page_by_column_values(
        limit: 500
        board_id: 5544986448
        columns: [
          { column_id: "people2", column_values: "${me}"}
          { column_id: "date7", column_values: "" }
        ]
      ) {
        items {
          id
        }
      }
    }`).then((res) => {
      const value = res?.data ? res.data.coldP.items.length : 0;
      setCurrentValue(value);
      updateTotal(value, 'coldProspectingTotal', setTotal, 'cold');
    });
  };
  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <ProgressCard
      value={currentValue}
      total={totalValue.value}
      title={en.Cards.progess.coldProspecting.title}
      subTitle={en.Cards.progess.coldProspecting.subtitle}
      color="#1A4049"
      icon={<SnowIcon />}
    />
  );
}

export default ColdProspecting;
