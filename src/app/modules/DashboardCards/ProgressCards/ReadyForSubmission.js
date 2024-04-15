import ProgressCard from 'app/components/ProgressCard';
import { PaperPlanIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { columnIds, env } from 'utils/constants';
import { fetchReadyForSubmissions } from 'app/apis/query';

function ReadyForSubmission({ updateTotal }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [totalValue, setTotal] = useState({ value: 0 });

  const getData = async () => {
    const value = await fetchReadyForSubmissions(columnIds);
    setCurrentValue(value);
    updateTotal(value, 'readyForSubmissionTotal', setTotal, 'ready');
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
