import ProgressCard from 'app/components/ProgressCard';
import { DocIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import { fetchDocReviews } from 'app/apis/query';
import { createViewURL } from 'utils/helpers';

function DocReviews({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = async () => {
    const value = await fetchDocReviews(columnIds);
    setCurrentValue(value);
    updateTotal(value, 'docReviewTotal', setTotal, 'doc');
  };
  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const handleClick = () => {
    window.open(createViewURL(env.views.docReview, env.boards.leads), '_target');
  };
  return (
    <ProgressCard
      value={currentValue}
      total={totalValue.value}
      title={en.Cards.progess.docReview.title}
      subTitle={en.Cards.progess.docReview.subtitle}
      color="#358069"
      icon={<DocIcon />}
      onClick={handleClick}
    />
  );
}

export default DocReviews;
