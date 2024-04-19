import ProgressCard from 'app/components/ProgressCard';
import { ClockIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import { fetchWaitingForOffer } from 'app/apis/query';

function WaitingForOffer({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = async () => {
    const value = await fetchWaitingForOffer(columnIds);
    setCurrentValue(value);
    updateTotal(value, 'waitingForOfferTotal', setTotal, 'witing');
  };
  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const handleClick = () => {
    window.open(env.views.waitingForOffer, '_blank');
  };
  return (
    <ProgressCard
      value={currentValue}
      total={totalValue.value}
      title={en.Cards.progess.waitingOffer.title}
      subTitle={en.Cards.progess.waitingOffer.subtitle}
      color="#5FD372"
      icon={<ClockIcon />}
      onClick={handleClick}
    />
  );
}

export default WaitingForOffer;
