import dayjs from 'dayjs';
import { columnIds } from 'utils/constants';
import { getColumnValue } from 'utils/helpers';

export const transformToFunnel = (data, dates) => {
  const withSubitems = data?.filter((d) => d.isDeal && d.subitems?.length);
  const withNotSubitems = data?.filter((d) => d.isDeal && !d.subitems?.length);
  const newLeadsSpokenTo = data?.filter((d) => dayjs(d[d.isDeal
    ? columnIds.deals.last_touched : columnIds.leads.last_touched])
    .isBetween(dates[0].subtract(1, 'day'), dates[1].add(1, 'day')));
  const newLeadsNotSpokenTo = data?.filter((d) => !d[d.isDeal
    ? columnIds.deals.last_touched : columnIds.leads.last_touched]);
  const deals = data?.filter((d) => d.isDeal);
  const approvals = withSubitems.filter((d) => d.subitems?.some((s) => s.column_values[0].text === 'Approved' || s.column_values[0].text === 'Selected' || s.column_values[0].text === 'Killed at Funding call'));
  const noApprovals = withSubitems.filter((d) => !d.subitems?.some((s) => s.column_values[0].text === 'Approved' || s.column_values[0].text === 'Selected' || s.column_values[0].text === 'Killed at Funding call'));
  const leadsWithDocs = data?.filter(
    (d) => (!d.isDeal && d[columnIds.leads.incoming_files])
    || (d.isDeal && d[columnIds.deals.incoming_files]),
  );
  const leadsWithOutDocs = data?.filter(
    (d) => (!d.isDeal && !d[columnIds.leads.incoming_files])
    || (d.isDeal && !d[columnIds.deals.incoming_files]),
  );
  const pitched = data?.filter((d) => {
    if (!d.isDeal) return false;
    const pitchedData = getColumnValue(d.column_values, columnIds.deals.pitched);
    return pitchedData.checked;
  });
  const notPitched = data?.filter((d) => {
    if (!d.isDeal) return false;
    const pitchedData = getColumnValue(d.column_values, columnIds.deals.pitched);
    return !pitchedData.checked;
  });
  const contractsOut = data?.filter((d) => {
    if (!d.isDeal) return false;
    return d[columnIds.deals.contract_out];
  });
  const noContractsOut = data?.filter((d) => {
    if (!d.isDeal) return false;
    return !d[columnIds.deals.contract_out];
  });
  const contractsSigned = data?.filter((d) => {
    if (!d.isDeal) return false;
    return d[columnIds.deals.contract_signed];
  });
  const noContractsSigned = data?.filter((d) => {
    if (!d.isDeal) return false;
    return !d[columnIds.deals.contract_signed];
  });
  const funded = data.filter((d) => d.isDeal && d[columnIds.deals.stage] === 'Funded');
  const notFunded = data.filter((d) => d.isDeal && d[columnIds.deals.stage] !== 'Funded');
  return {
    new: data,
    newLeadsSpokenTo,
    newLeadsNotSpokenTo,
    deals,
    leadsWithDocsCollected: leadsWithDocs,
    leadsWithDocsNotCollected: leadsWithOutDocs,
    submissions: withSubitems,
    noSubmissions: withNotSubitems,
    approvals,
    noApprovals,
    pitched,
    notPitched,
    contractsOut,
    noContractsOut,
    contractsSigned,
    noContractsSigned,
    funded,
    notFunded,
  };
};
