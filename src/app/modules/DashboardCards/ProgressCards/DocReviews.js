import drawer from 'drawerjs';
import ProgressCard from 'app/components/ProgressCard';
import { DocIcon } from 'app/images/icons';
import en from 'app/locales/en';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import monday from 'utils/mondaySdk';

function DocReviews({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = () => {
    const me = drawer.get('userName');
    const currentDate = dayjs().format('YYYY-MM-DD');
    monday.api(`query {
      boards(ids: [${env.boards.leads}]) {
        docReview: groups(ids: ["${env.pages.docReview}"]) {
          items_page(
            query_params:{
              rules: [
                { column_id: "${columnIds.leads.next_followup}", compare_value: ["${currentDate}", "${currentDate}"], operator:between},
                { column_id: "${columnIds.leads.sales_rep}", compare_value: "${me}", operator:contains_text}
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
        .docReview[0].items_page.items.length : 0;
      setCurrentValue(value);
      updateTotal(value, 'docReviewTotal', setTotal, 'doc');
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
      title={en.Cards.progess.docReview.title}
      subTitle={en.Cards.progess.docReview.subtitle}
      color="#358069"
      icon={<DocIcon />}
    />
  );
}

export default DocReviews;
