import ProgressCard from 'app/components/ProgressCard';
import { FireIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { env } from 'utils/constants';
import { fetchFollowUps } from 'app/apis/query';

function FollowUpRemaining({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = async () => {
    const value = await fetchFollowUps();
    setCurrentValue(value);
    updateTotal(value, 'followUpTotal', setTotal, 'followUp');
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
