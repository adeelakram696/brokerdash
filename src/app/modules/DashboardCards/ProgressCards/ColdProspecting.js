import ProgressCard from 'app/components/ProgressCard';
import { SnowIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { env } from 'utils/constants';
import { fetchColdProspectings } from 'app/apis/query';
import { createViewURL } from 'utils/helpers';

function ColdProspecting({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = async () => {
    const value = await fetchColdProspectings();
    setCurrentValue(value);
    updateTotal(value, 'coldProspectingTotal', setTotal, 'cold');
  };
  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, (1000 * env.intervalTime));
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const handleClick = () => {
    window.open(createViewURL(env.views.coldProspecting, env.boards.coldProspecting), '_target');
  };
  return (
    <ProgressCard
      value={currentValue}
      total={totalValue.value}
      title={en.Cards.progess.coldProspecting.title}
      subTitle={en.Cards.progess.coldProspecting.subtitle}
      color="#1A4049"
      icon={<SnowIcon />}
      onClick={handleClick}
    />
  );
}

export default ColdProspecting;
