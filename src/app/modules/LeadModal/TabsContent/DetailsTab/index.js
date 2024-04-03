import { Flex } from 'antd';
import en from 'app/locales/en';
import ClientBaseInfo from './ClientBaseInfo';
import InformationCard from './InformationCard';
import parentStyles from '../../LeadModal.module.scss';
import BusinessInformationCard from './BusinessInformationCard';
import AddPartner from './AddPartner';
import QualificationMatrix from './QualificationMatrix';

function DetailsTab() {
  return (
    <Flex flex={1}>
      <Flex className={parentStyles.columnLeft} flex={0.67} vertical>
        <InformationCard heading={en.titles.clientInformation} />
        <AddPartner />
        <InformationCard heading={en.titles.partnerInformation} />
        <BusinessInformationCard heading={en.titles.businessInformation} />
      </Flex>
      <Flex className={parentStyles.columnRight} flex={0.33} vertical>
        <ClientBaseInfo />
        <QualificationMatrix />
      </Flex>
    </Flex>
  );
}

export default DetailsTab;
