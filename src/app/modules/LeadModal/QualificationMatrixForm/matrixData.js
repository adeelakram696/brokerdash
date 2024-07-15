import { columnIds } from 'utils/constants';
import { convertToNumber } from 'utils/helpers';

export const fundersIntakeCalc = (values, funders) => {
  const filtered = values.isPastSetttled
    ? funders.filter((funder) => funder.pastSettledDefaults)
    : funders;
  return (filtered || []).map((funder) => {
    const funderCounts = {
      funder: funder.funder,
      minAnnualRevenue: Number(funder.minimumRevenueAnnual <= values.annualRevenue),
      creditScoreSuitability: Number(funder.minimumCreditScore <= values.ficoScore),
      minimumMonthlyDeposits: Number(
        funder.minimumMonthlyDepositcount <= values.minMonthlyDepositCount,
      ),
      nSFLast30Days: 1 - Number(funder.insuffientFundsNSF[0] <= values.nSFLast30Days),
      nSFLast90Days: 1 - Number(funder.insuffientFundsNSF[1] <= values.nSFLast90Days),
      negativeDaysLast30: 1 - Number(funder.negativeDays[0] <= values.negativeDaysLast30),
      negativeDaysLast90: 1 - Number(funder.negativeDays[1] <= values.negativeDaysLast90),
      maximumPositions: 1 - Number(funder.maxPosition <= values.numberOfPositions),
      firstPosition: Number(values.numberOfPositions === 0 ? funder.position1st === 'v' : true),
      industryType: Number(!(funder.restrictedIndustries.indexOf(values.industry) >= 0)),
      state: Number(!funder.stateRestrictions.indexOf(values.state) >= 0),
      timeInBusiness: Number(funder.minimumTimeInBusinessMonths <= values.timeInBusiness),
      minDailybalnce: Number(values.min_daily_balnc <= funder.minAvgDailyBalance),
      tier: funder.tier,
    };
    const trueCount = Object.values(funderCounts).filter((v) => v === 1).length;
    funderCounts.ranking = trueCount - Number(funder.tier === 1);
    return funderCounts;
  }).filter((data) => data.ranking === 13);
};

export const transformFundersforQM = (funder, columns) => ({
  funder: funder.name,
  paperType: columns[columnIds.funders.paper_type],
  minimumRevenueAnnual: convertToNumber(columns[columnIds.funders.min_rev_annual]),
  minimumRevenueMonthly() { return this.minimumRevenueAnnual / 12; },
  minimumCreditScore: convertToNumber(columns[columnIds.funders.min_credit_score]),
  maxPosition: convertToNumber(columns[columnIds.funders.max_position]),
  position1st: columns[columnIds.funders.first_position],
  stateRestrictions: columns[columnIds.funders.state_restrictions]?.split(',') || [],
  insuffientFundsNSF: [
    convertToNumber(columns[columnIds.funders.insuffient_funds_30]),
    convertToNumber(columns[columnIds.funders.insuffient_funds_90]),
  ],
  negativeDays: [
    convertToNumber(columns[columnIds.funders.negative_days_30]),
    convertToNumber(columns[columnIds.funders.negative_days_90]),
  ],
  minimumMonthlyDepositcount: convertToNumber(columns[columnIds.funders.min_month_dep_count]),
  minimumTimeInBusinessMonths: convertToNumber(columns[columnIds.funders.min_time_in_bus_months]),
  minAvgDailyBalance: convertToNumber(columns[columnIds.funders.min_avg_daily_balance]),
  minFundingAmount$: convertToNumber(columns[columnIds.funders.min_funding_amount]),
  maxFundingAmount$: convertToNumber(columns[columnIds.funders.max_funding_amount]),
  restrictedIndustries: columns[columnIds.funders.rest_industries]?.split(',') || [],
  tier: convertToNumber(columns[columnIds.funders.tier]),
  pastSettledDefaults: columns[columnIds.funders.past_settled_defaults] === 'v',
});
