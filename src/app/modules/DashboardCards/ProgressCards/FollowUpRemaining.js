import drawer from 'drawerjs';
import ProgressCard from 'app/components/ProgressCard';
import { FireIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import monday from 'utils/mondaySdk';
import dayjs from 'dayjs';
import { env } from 'utils/constants';

function FollowUpRemaining({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = () => {
    const me = drawer.get('userName');
    const currentDate = dayjs().format('YYYY-MM-DD');
    monday.api(`query {
      deals: items_page_by_column_values(
        limit: 100
        board_id: ${env.boards.deals}
        columns: [
          { column_id: "date_1", column_values: "${currentDate}"},
          { column_id: "deal_owner", column_values: "${me}"}
        ]
      ) {
        items {
          id
        }
      }
      leads: items_page_by_column_values(
        limit: 100
        board_id: ${env.boards.leads}
        columns: [
          { column_id: "date_1", column_values: "${currentDate}"},
          { column_id: "dialer", column_values: "${me}"}
        ]
      ) {
        items {
          id
        }
      }
    }`).then((res) => {
      const dealsItem = res?.data ? res.data.deals.items.length : 0;
      const leadsItem = res?.data ? res.data.leads.items.length : 0;
      const value = dealsItem + leadsItem;
      setCurrentValue(value);
      updateTotal(value, 'followUpTotal', setTotal, 'followUp');
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
      title={en.Cards.progess.followup.title}
      subTitle={en.Cards.progess.followup.subtitle}
      color="#429A65"
      icon={<FireIcon />}
    />
  );
}

export default FollowUpRemaining;
