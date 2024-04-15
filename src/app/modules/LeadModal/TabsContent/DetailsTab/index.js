import { Flex } from 'antd';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import { fetchLeadClientDetails } from 'app/apis/query';
import ClientBaseInfo from './ClientBaseInfo';
import InformationCard from './InformationCard';
import parentStyles from '../../LeadModal.module.scss';
import BusinessInformationCard from './BusinessInformationCard';
import AddPartner from './AddPartner';
import QualificationMatrix from './QualificationMatrix';
import PartnerInformationCard from './PartnerInformationCard';

function DetailsTab({ leadId, board }) {
  const [details, setDetails] = useState({});
  const getData = async () => {
    const { res, columns } = await fetchLeadClientDetails(leadId);
    setDetails({ ...res.data.details[0], ...columns });
  };
  useEffect(() => {
    getData();
  }, [leadId]);
  return (
    <Flex flex={1}>
      <Flex className={parentStyles.columnLeft} flex={0.67} vertical>
        <InformationCard heading={en.titles.clientInformation} details={details} board={board} />
        <AddPartner />
        <PartnerInformationCard
          heading={en.titles.partnerInformation}
          details={details}
          board={board}
        />
        <BusinessInformationCard
          heading={en.titles.businessInformation}
          details={details}
          board={board}
        />
      </Flex>
      <Flex className={parentStyles.columnRight} flex={0.33} vertical>
        <ClientBaseInfo details={details} board={board} />
        <QualificationMatrix />
      </Flex>
    </Flex>
  );
}

export default DetailsTab;
