import { columnIds } from 'utils/constants';
import { convertToNumber, extractLeastNumber } from 'utils/helpers';

const isBlank = (value) => value === '';
const checkFunderIndustryRequirements = (values, industryReqs) => {
  if (!industryReqs || !values.industry) return true;

  const industryConfig = industryReqs[values.industry];
  if (!industryConfig) return true; // No specific requirements for this industry

  // Check time in business
  if (industryConfig.TimeInBusiness != null) {
    if (!values.timeInBusiness || values.timeInBusiness < industryConfig.TimeInBusiness) {
      return false;
    }
  }

  // Check credit score (handle both single value and range formats)
  if (industryConfig.CreditScore != null) {
    const requiredScore = industryConfig.CreditScore;
    const actualScore = extractLeastNumber(values.ficoScore?.toString() || values.creditScore?.toString() || '');

    if (!actualScore || actualScore < requiredScore) {
      return false;
    }
  }

  // Check monthly revenue (compare with monthCashFlow)
  if (industryConfig.MonthlyRevenue != null) {
    const requiredRevenue = industryConfig.MonthlyRevenue;
    const actualRevenue = convertToNumber(values.monthCashFlow || 0);

    if (actualRevenue < requiredRevenue) {
      return false;
    }
  }

  return true; // All checks passed
};

export const fundersIntakeCalc = (values, funders) => {
  let filtered = funders.filter((funder) => !funder.testingFunder);
  filtered = filtered.isPastSetttled
    ? funders.filter((funder) => funder.pastSettledDefaults)
    : filtered;
  // Handle acceptOnlineBank and prevPaymentHistory filtering
  if (values.acceptOnlineBank || values.prevPaymentHistory) {
    filtered = filtered.filter((funder) => {
      // If funder has AcceptBankAndPrevPaymentHistory requirement
      if (funder.AcceptBankAndPrevPaymentHistory) {
        // Only include if BOTH values match the funder's requirements
        return values.acceptOnlineBank && values.prevPaymentHistory;
      }

      // Otherwise, apply individual filters
      const acceptOnlineBankMatch = !values.acceptOnlineBank || funder.acceptOnlineBanking;
      const prevPaymentHistoryMatch = !values.prevPaymentHistory || funder.prevPaymentHistory;

      return acceptOnlineBankMatch && prevPaymentHistoryMatch;
    });
  }
  filtered = values.funderInPast
    ? filtered.filter((funder) => funder.fundedInPast)
    : filtered;
  return (filtered || []).map((funder) => {
    // Check funder-specific industry requirements first
    let industryReqs = null;
    if (funder.funderSpecificIndustryRequirements) {
      try {
        industryReqs = JSON.parse(funder.funderSpecificIndustryRequirements);
      } catch (e) {
        // Invalid JSON, ignore industry requirements
      }
    }

    const passesIndustryReqs = checkFunderIndustryRequirements(values, industryReqs);

    let minMonthRevenue = false;
    if (funder.monthlyPriority) {
      const monthsRevInd = [2, 3].filter((ind) => convertToNumber(values[`totalCredit-${ind}`]) > 0);
      minMonthRevenue = [1, ...monthsRevInd].some((ind) => (
        (convertToNumber(values[`totalCredit-${ind}`]) || 0) <= funder.minimumRevenueMonthly()
      ));
    }
    const isAvgbalanceZero = funder.minAvgDailyBalance === 0;
    const funderCounts = {
      funder: funder.funder,
      minAnnualRevenue: funder.monthlyPriority
        ? Number(!minMonthRevenue) : Number(funder.minimumRevenueAnnual <= values.annualRevenue),
      creditScoreSuitability: isBlank(funder.minimumCreditScore)
      || Number(funder.minimumCreditScore <= values.ficoScore),
      minimumMonthlyDeposits: isBlank(funder.minimumMonthlyDepositcount)
      || Number(
        funder.minimumMonthlyDepositcount <= values.minMonthlyDepositCount,
      ),
      nSFLast30Days: isBlank(funder.insuffientFundsNSF[0])
        || (1 - Number(funder.insuffientFundsNSF[0] < values.nSFLast30Days)),
      nSFLast90Days: isBlank(funder.insuffientFundsNSF[1])
      || (1 - Number(funder.insuffientFundsNSF[1] < values.nSFLast90Days)),
      negativeDaysLast30: isBlank(funder.negativeDays[0])
      || (1 - Number(funder.negativeDays[0] < values.negativeDaysLast30)),
      negativeDaysLast90: isBlank(funder.negativeDays[1])
      || (1 - Number(funder.negativeDays[1] < values.negativeDaysLast90)),
      maximumPositions: isBlank(funder.maxPosition)
      || (1 - Number(funder.maxPosition <= values.numberOfPositions)),
      firstPosition: Number(values.numberOfPositions === 0 ? funder.position1st === 'v' : true),
      industryType: Number(!(funder.restrictedIndustries.indexOf(values.industry) >= 0)),
      state: Number(!(funder.stateRestrictions.indexOf(values.state) >= 0)),
      timeInBusiness: isBlank(funder.minimumTimeInBusinessMonths)
      || Number(funder.minimumTimeInBusinessMonths <= values.timeInBusiness),
      minDailybalnce: isBlank(funder.minAvgDailyBalance)
      || (Number(!values.min_daily_balnc
        || isAvgbalanceZero
        || values.min_daily_balnc >= funder.minAvgDailyBalance)),
      industrySpecificReqs: Number(passesIndustryReqs),
      tier: funder.tier,
    };
    const trueCount = Object.values(funderCounts).filter((v) => Number(v) === 1).length;
    // subtracting tier 1 from truecount to adjust ranking as
    // tier 1 also gets count as trueCount but we need to ignore tier key
    funderCounts.ranking = trueCount - Number(funder.tier === 1);
    return funderCounts;
  }).reduce((prev, curr) => {
    const obj = prev;
    if (curr.ranking === 14) {
      obj.qualified = [...obj.qualified, curr];
    // Changed from 13 to 14 since we added industrySpecificReqs
    } else { obj.disqualified = [...obj.disqualified, curr]; }
    return obj;
  }, { qualified: [], disqualified: [] });
};

export const transformFundersforQM = (funder, columns) => ({
  funder: funder.name,
  paperType: columns[columnIds.funders.paper_type],
  minimumRevenueAnnual: convertToNumber(columns[columnIds.funders.min_rev_annual], true),
  minimumRevenueMonthly() { return this.minimumRevenueAnnual / 12; },
  minimumCreditScore: convertToNumber(columns[columnIds.funders.min_credit_score], true),
  maxPosition: convertToNumber(columns[columnIds.funders.max_position], true),
  position1st: columns[columnIds.funders.first_position],
  stateRestrictions: columns[columnIds.funders.state_restrictions]?.split(', ') || [],
  insuffientFundsNSF: [
    convertToNumber(columns[columnIds.funders.insuffient_funds_30], true),
    convertToNumber(columns[columnIds.funders.insuffient_funds_90], true),
  ],
  negativeDays: [
    convertToNumber(columns[columnIds.funders.negative_days_30], true),
    convertToNumber(columns[columnIds.funders.negative_days_90], true),
  ],
  minimumMonthlyDepositcount: convertToNumber(columns[columnIds.funders.min_month_dep_count], true),
  minimumTimeInBusinessMonths: convertToNumber(
    columns[columnIds.funders.min_time_in_bus_months],
    true,
  ),
  minAvgDailyBalance: convertToNumber(columns[columnIds.funders.min_avg_daily_balance], true),
  minFundingAmount$: convertToNumber(columns[columnIds.funders.min_funding_amount], true),
  maxFundingAmount$: convertToNumber(columns[columnIds.funders.max_funding_amount], true),
  restrictedIndustries: columns[columnIds.funders.rest_industries]?.split(', ') || [],
  tier: convertToNumber(columns[columnIds.funders.tier], true),
  pastSettledDefaults: columns[columnIds.funders.past_settled_defaults] === 'v',
  acceptOnlineBanking: columns[columnIds.funders.accept_online_banking] === 'v',
  fundedInPast: columns[columnIds.funders.funded_in_the_past_30_days] === 'v',
  prevPaymentHistory: columns[columnIds.funders.previous_payment_history] === 'v',
  AcceptBankAndPrevPaymentHistory: columns[columnIds.funders.accept_online_banks_and_previous_payment_history] === 'v',
  monthlyPriority: columns[columnIds.funders.monthly_priority] === 'v',
  testingFunder: columns[columnIds.funders.testing_funder] === 'v',
  funderSpecificIndustryRequirements:
  columns[columnIds.funders.funder_specific_industry_requirements],
});
