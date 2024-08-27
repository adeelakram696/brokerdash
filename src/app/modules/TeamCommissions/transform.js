import dayjs from 'dayjs';
import { columnIds } from 'utils/constants';
import { normalizeColumnValues } from 'utils/helpers';

export const transformData = (deals) => (
  deals.map((deal) => {
    const dealColumns = normalizeColumnValues(deal.column_values);
    const selectedSubmission = deal.subitems.find(
      (subItem) => subItem.column_values.find(
        (col) => (col.id === columnIds.subItem.status && col.text === 'Selected'),
      ),
    );
    const submissionColumns = normalizeColumnValues(selectedSubmission.column_values);
    const marketingSplit = {
      Become: 0.5,
      'RJ Leads': 0.4,
    };
    const dealInfo = {
      id: deal.id,
      funded_date: dealColumns[columnIds.deals.funded__date],
      source: dealColumns[columnIds.deals.channel],
      name: deal.name,
      product: submissionColumns[columnIds.subItem.product_type],
      funding_amount: submissionColumns[columnIds.subItem.funding_amount],
      factor_rate: submissionColumns[columnIds.subItem.factor_rate],
      ptsOn: submissionColumns[columnIds.subItem.commission_calc_on] === 'On Payback' ? 'Payback' : 'Funded',
      isPayback: submissionColumns[columnIds.subItem.commission_calc_on] === 'On Payback',
      pts: submissionColumns[columnIds.subItem.commission_perc],
      professional_fee: submissionColumns[columnIds.subItem.professional_fee_perc],
    };
    const payback_amount = dealInfo.funding_amount * dealInfo.factor_rate;
    const commission = dealInfo.isPayback ? payback_amount * (dealInfo.pts / 100)
      : Number(dealInfo.funding_amount) * (dealInfo.pts / 100);
    const psf = (dealInfo.funding_amount * (dealInfo.professional_fee / 100)).toFixed(0);
    const marketing_partner_split = marketingSplit[dealInfo.source] || 0;
    const comission_with_psf = Number(commission) + Number(psf);
    const total_gross = dealInfo.source === 'Become' ? comission_with_psf - (commission * marketing_partner_split) : comission_with_psf - (marketing_partner_split * comission_with_psf);
    return {
      ...dealInfo,
      isOutbound: dealInfo.source === 'Phoneburner',
      payback_amount: payback_amount.toFixed(0),
      commission: commission.toFixed(0),
      psf,
      marketing_partner_split,
      total_gross: total_gross.toFixed(0),
    };
  }).sort((a, b) => {
    const dateA = dayjs(a.funded_date, 'YYYY-DD-MM');
    const dateB = dayjs(b.funded_date, 'YYYY-DD-MM');
    return dateA - dateB;
  })
);
