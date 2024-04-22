import { Flex } from 'antd';
import en from 'app/locales/en';
import { useContext, useState } from 'react';
import { columnIds } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import ClientBaseInfo from './ClientBaseInfo';
import InformationCard from './InformationCard';
import parentStyles from '../../LeadModal.module.scss';
import BusinessInformationCard from './BusinessInformationCard';
import AddPartner from './AddPartner';
import QualificationMatrix from './QualificationMatrix';
import PartnerInformationCard from './PartnerInformationCard';

function DetailsTab() {
  const {
    leadId, board, details, getData,
  } = useContext(LeadContext);
  const [showPartner, setShowPartner] = useState(false);
  return (
    <Flex flex={1}>
      <Flex className={parentStyles.columnLeft} flex={0.67} vertical>
        <InformationCard
          heading={en.titles.clientInformation}
          details={details}
          board={board}
          leadId={leadId}
          updateInfo={getData}
        />
        {details[columnIds[board].partner_first_name] || showPartner ? (
          <PartnerInformationCard
            heading={en.titles.partnerInformation}
            details={details}
            board={board}
            leadId={leadId}
            updateInfo={getData}
          />
        ) : <AddPartner onClick={() => { setShowPartner(true); }} />}
        <BusinessInformationCard
          heading={en.titles.businessInformation}
          details={details}
          board={board}
          leadId={leadId}
          updateInfo={getData}
        />
      </Flex>
      <Flex className={parentStyles.columnRight} flex={0.33} vertical>
        <ClientBaseInfo
          details={details}
          board={board}
          leadId={leadId}
          updateInfo={getData}
        />
        <QualificationMatrix data={details} />
      </Flex>
    </Flex>
  );
}

export default DetailsTab;
