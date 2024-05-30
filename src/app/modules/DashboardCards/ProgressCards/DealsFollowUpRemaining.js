import ProgressCard from 'app/components/ProgressCard';
import { FireIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { env } from 'utils/constants';
import { fetchDealsFollowUps } from 'app/apis/query';
import { createViewURL } from 'utils/helpers';

function DealsFollowUpRemaining({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = async () => {
    const leadsItem = await fetchDealsFollowUps();
    setCurrentValue(leadsItem);
    updateTotal(leadsItem, 'dealsfollowUpTotal', setTotal, 'dealsfollowUp');
  };
  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const handleClick = () => {
    window.open(createViewURL(env.views.followupDealsToday, env.boards.deals), '_blank');
  };
  return (
    <ProgressCard
      value={currentValue}
      total={totalValue.value}
      title={en.Cards.progess.followupDeals.title}
      subTitle={en.Cards.progess.followupDeals.subtitle}
      color="#429A65"
      icon={<FireIcon />}
      onClick={handleClick}
    />
  );
}

export default DealsFollowUpRemaining;
