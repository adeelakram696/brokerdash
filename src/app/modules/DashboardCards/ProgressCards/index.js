import { Col } from 'antd';
import ProgressCard from 'app/components/ProgressCard';
import en from 'app/locales/en';
import {
  ClockIcon, DocIcon, FireIcon, PaperPlanIcon,
} from 'app/images/icons';
import ColdProspecting from './ColdProspecting';

function ProgressCards() {
  return (
    <>
      <Col style={{ width: '20%' }}>
        <ProgressCard
          value={30}
          total={100}
          title={en.Cards.progess.followup.title}
          subTitle={en.Cards.progess.followup.subtitle}
          color="#429A65"
          icon={<FireIcon />}
        />
      </Col>
      <Col style={{ width: '20%' }}>
        <ColdProspecting />
      </Col>
      <Col style={{ width: '20%' }}>
        <ProgressCard
          value={4}
          total={6}
          title={en.Cards.progess.docReview.title}
          subTitle={en.Cards.progess.docReview.subtitle}
          color="#358069"
          icon={<DocIcon />}
        />
      </Col>
      <Col style={{ width: '20%' }}>
        <ProgressCard
          value={3}
          total={9}
          title={en.Cards.progess.readySubmission.title}
          subTitle={en.Cards.progess.readySubmission.subtitle}
          color="#52B975"
          icon={<PaperPlanIcon />}
        />
      </Col>
      <Col style={{ width: '20%' }}>
        <ProgressCard
          value={0}
          total={9}
          title={en.Cards.progess.waitingOffer.title}
          subTitle={en.Cards.progess.waitingOffer.subtitle}
          color="#5FD372"
          icon={<ClockIcon />}
        />
      </Col>
    </>
  );
}
export default ProgressCards;
