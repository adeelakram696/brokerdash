import { Flex } from 'antd';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import monday from 'utils/mondaySdk';
import _ from 'lodash';
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
    const query = `query {
      details: items(ids: [${leadId}]) {
        id
        name
        email
        column_values {
          id
          text
        }
      }
    }`;
    const res = await monday.api(query);
    let columns = _.mapKeys(res.data.details[0].column_values, 'id');
    columns = _.mapValues(columns, 'text');
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
