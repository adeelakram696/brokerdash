import { Col } from 'antd';
import dayjs from 'dayjs';
import { isNineAMPassed } from 'utils/helpers';
import ColdProspecting from './ColdProspecting';
import ReadyForSubmission from './ReadyForSubmission';
import DocReviews from './DocReviews';
import WaitingForOffer from './WaitingForOffer';
import DealsFollowUpRemaining from './DealsFollowUpRemaining';
import LeadsFollowUpRemaining from './LeadsFollowUpRemaining';

function ProgressCards({
  handleChange,
}) {
  const updateTotal = (value, totalkey, setTotal, cardKey) => {
    if (!isNineAMPassed()) return false;
    const currentDate = dayjs().format();
    let total = {
      value,
      expiry: currentDate,
    };
    let totalVal = {};
    const storedValue = localStorage.getItem(totalkey);
    if (storedValue) totalVal = JSON.parse(storedValue);
    if (!storedValue || totalVal?.value === 0) {
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
      <Col style={{ width: '16.66%' }}>
        <LeadsFollowUpRemaining updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '16.66%' }}>
        <DealsFollowUpRemaining updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '16.66%' }}>
        <ColdProspecting updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '16.66%' }}>
        <DocReviews updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '16.66%' }}>
        <ReadyForSubmission updateTotal={updateTotal} />
      </Col>
      <Col style={{ width: '16.66%' }}>
        <WaitingForOffer updateTotal={updateTotal} />
      </Col>
    </>
  );
}
export default ProgressCards;
