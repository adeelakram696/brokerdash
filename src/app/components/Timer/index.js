import { formatTimeIn, getAvgTimeColor } from 'utils/helpers';

const { useState, useEffect } = require('react');

function Timer({
  startSeconds, isReverse, limit, goalTime, onFinish = () => {}, updateTime = () => {},
}) {
  const [remainingSeconds, setRemainingSeconds] = useState();
  useEffect(() => {
    setRemainingSeconds(startSeconds);
  }, [startSeconds]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingSeconds >= 0) {
        setRemainingSeconds((prevSeconds) => (isReverse ? prevSeconds - 1 : prevSeconds + 1));
      }
    }, 1000);
    updateTime(remainingSeconds);
    if (limit === remainingSeconds) { clearInterval(interval); onFinish(); }
    return () => clearInterval(interval);
  }, [remainingSeconds]);

  return (
    <span style={goalTime ? { color: getAvgTimeColor(remainingSeconds, goalTime) } : {}}>
      {formatTimeIn(remainingSeconds)}
    </span>
  );
}

export default Timer;
