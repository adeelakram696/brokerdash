import drawer from 'drawerjs';
import ProgressCard from 'app/components/ProgressCard';
import { PaperPlanIcon } from 'app/images/icons';
import en from 'app/locales/en';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import monday from 'utils/mondaySdk';

function ReadyForSubmission({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = () => {
    const me = drawer.get('userName');
    const currentDate = dayjs().format('YYYY-MM-DD');
    monday.api(`query {
      boards(ids: [${env.boards.deals}]) {
        readyForSubmission: groups(ids: ["${env.pages.readyForSubmission}"]) {
          items_page(
            query_params:{
              rules: [
                { column_id: "${columnIds.deals.next_followup}", compare_value: ["${currentDate}", "${currentDate}"], operator:between},
                { column_id: "${columnIds.deals.agent}", compare_value: "${me}", operator:contains_text}
              ]
              operator:and
            }
          ) {
            items {
              id
            }
          }
        }
      }
    }`).then((res) => {
      const value = res?.data ? res.data.boards[0]
        .readyForSubmission[0].items_page.items.length : 0;
      setCurrentValue(value);
      updateTotal(value, 'readyForSubmissionTotal', setTotal, 'ready');
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
      title={en.Cards.progess.readySubmission.title}
      subTitle={en.Cards.progess.readySubmission.subtitle}
      color="#52B975"
      icon={<PaperPlanIcon />}
    />
  );
}

export default ReadyForSubmission;
