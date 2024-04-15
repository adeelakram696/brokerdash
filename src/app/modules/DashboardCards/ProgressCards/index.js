import { Col } from 'antd';
import dayjs from 'dayjs';
import ColdProspecting from './ColdProspecting';
import ReadyForSubmission from './ReadyForSubmission';
import DocReviews from './DocReviews';
import WaitingForOffer from './WaitingForOffer';
import FollowUpRemaining from './FollowUpRemaining';

function ProgressCards({
  handleChange,
}) {
  const updateTotal = (value, totalkey, setTotal, cardKey) => {
    const currentDate = dayjs().format();
    let total = {
      value,
      expiry: currentDate,
    };
    const storedValue = localStorage.getItem(totalkey);
    if (!storedValue) {
      localStorage.setItem(totalkey, JSON.stringify(total));
      return setTotal(total);
    }
    const parsedValue = JSON.parse(storedValue);
    if (dayjs(parsedValue.expiry).isAfter(dayjs().subtract(1, 'day'))) {
      total = parsedValue;
    } else {
      localStorage.setItem(totalkey, JSON.stringify(total));
    }
    handleChange({ [cardKey]: { value, total } });
    return setTotal(total);
  };
  return (
    <>
      <Col style={{ width: '20%' }}>
        <FollowUpRemaining updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '20%' }}>
        <ColdProspecting updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '20%' }}>
        <DocReviews updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '20%' }}>
        <ReadyForSubmission updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '20%' }}>
        <WaitingForOffer updateTotal={updateTotal} />
      </Col>
    </>
  );
}
export default ProgressCards;
