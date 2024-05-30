import { Flex } from 'antd';
import en from 'app/locales/en';
import { useContext, useState } from 'react';
import { boardNames, columnIds, env } from 'utils/constants';
import { LeadContext } from 'utils/contexts';
import { updateClientInformation } from 'app/apis/mutation';
import ClientBaseInfo from './ClientBaseInfo';
import InformationCard from './InformationCard';
import parentStyles from '../../LeadModal.module.scss';
import BusinessInformationCard from './BusinessInformationCard';
import QualificationMatrix from './QualificationMatrix';
import PartnerInformationCard from './PartnerInformationCard';
import SelectItem from './SelectItem';
import AddInfo from './AddInfo';

function DetailsTab() {
  const {
    leadId, board, details, getData,
  } = useContext(LeadContext);
  const [showPartner, setShowPartner] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const isDeal = board === boardNames.deals;
  const isPartner = isDeal
    ? details.partner.name
    : details[columnIds[board].partner_first_name];
  const isBusiness = isDeal
    ? details.clientAccount.name
    : details[columnIds[board].company_name];

  const handleClientSelect = async (val, itemId, boardId, column) => {
    const payload = { item_ids: [val] };
    await updateClientInformation(
      itemId,
      boardId,
      { [column]: payload },
    );
    getData();
  };
  return (
    <Flex flex={1}>
      <Flex className={parentStyles.columnLeft} flex={0.67} vertical>
        {(isDeal && details.client?.id) || board === boardNames.leads ? (
          <InformationCard
            heading={en.titles.clientInformation}
            details={details}
            board={isDeal ? boardNames.clients : board}
            leadId={leadId}
            updateInfo={getData}
          />
        ) : (
          <SelectItem
            onChange={(val) => {
              handleClientSelect(val, leadId, details.board.id, columnIds.deals.client_name);
            }}
            type="Client"
            boardId={env.boards.clients}
          />
        )}

        {isPartner || showPartner ? (
          <PartnerInformationCard
            heading={en.titles.partnerInformation}
            details={details}
            board={isDeal ? boardNames.clients : board}
            updateInfo={getData}
            leadId={leadId}
            partnerAddPostFunc={(val) => {
              handleClientSelect(val, leadId, details.board.id, columnIds.deals.partner);
            }}
          />
        ) : (
          <AddInfo onClick={() => { setShowPartner(true); }} text="Add Partner Information" />
        )}
        {isBusiness || showBusiness ? (
          <BusinessInformationCard
            heading={en.titles.businessInformation}
            details={details}
            board={isDeal ? boardNames.clientAccount : board}
            leadId={leadId}
            updateInfo={getData}
            businessAddPostFunc={(val) => {
              handleClientSelect(
                val,
                details.client.id,
                details.client.board.id,
                columnIds.clients.account,
              );
            }}
          />
        ) : (
          <AddInfo onClick={() => { setShowBusiness(true); }} text="Add Business Information" />
        )}
      </Flex>
      <Flex className={parentStyles.columnRight} flex={0.33} vertical>
        <ClientBaseInfo
          details={details}
          board={board}
          leadId={leadId}
          updateInfo={getData}
        />
        <QualificationMatrix />
      </Flex>
    </Flex>
  );
}

export default DetailsTab;
