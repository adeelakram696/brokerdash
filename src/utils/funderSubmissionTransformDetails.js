import {
  columnIds, dateFormat, onDeckEntityMapping,
} from './constants';
import {
  cleanPhoneNumber, cleanStrToNum, convertToNumber, formatDate,
} from './helpers';

export const transformDealDetails = (item) => {
  const qmBankActivity = item.column_values.find((c) => c.id === columnIds.deals.qm_bank_activity);
  const qmActivePositions = item.column_values.find(
    (c) => c.id === columnIds.deals.qm_active_position,
  );
  const bankActivityObj = qmBankActivity?.text ? JSON.parse(qmBankActivity.text) : {};
  const activePositionObj = qmActivePositions?.text ? JSON.parse(qmActivePositions.text) : {};
  const avgBalance = bankActivityObj?.min_daily_balnc ? bankActivityObj?.min_daily_balnc : '';
  const annualRevenue = activePositionObj?.annualRevenue ? activePositionObj?.annualRevenue : '';
  return ({
    id: item.id,
    name: item.name,
    email: item.email,
    moneyNeededFor: item[columnIds.deals.needs_money_for],
    stage: item[columnIds.deals.stage],
    requestedAmount: item[columnIds.deals.requested_amount],
    submissionDocs: item[columnIds.deals.submit_offers_docs],
    avgBalance,
    annualRevenue,
    client: {
      id: item.client.id,
      name: item.client.name,
      email: item.client[columnIds.clients.email],
      phone: item.client[columnIds.clients.phone],
      social_security: item.client[columnIds.clients.social_security],
      dob: item.client[columnIds.clients.dob],
      state: item.client[columnIds.clients.state],
      city: item.client[columnIds.clients.city],
      address: item.client[columnIds.clients.address],
      zipCode: item.client[columnIds.clients.zip],
      ownership: item.client[columnIds.clients.ownership],
    },
    partner: item.partner.id
      ? {
        id: item.partner.id,
        name: item.partner.name,
        email: item.partner[columnIds.clients.email],
        phone: item.partner[columnIds.clients.phone],
        social_security: item.partner[columnIds.clients.social_security],
        dob: item.partner[columnIds.clients.dob],
        state: item.partner[columnIds.clients.state],
        city: item.partner[columnIds.clients.city],
        address: item.partner[columnIds.clients.address],
        zipCode: item.partner[columnIds.clients.zip],
        ownership: item.partner[columnIds.clients.ownership],
      }
      : null,
    account: item.clientAccount.id
      ? {
        id: item.clientAccount.id,
        name: item.clientAccount.name,
        email: item.clientAccount.email,
        businessAddress:
            item.clientAccount[columnIds.clientAccount.business_street_address],
        timeInBusiness:
            item.clientAccount[columnIds.clientAccount.time_in_business],
        businessStartDate:
            item.clientAccount[columnIds.clientAccount.business_start_date],
        state: item.clientAccount[columnIds.clientAccount.state_incorporated],
        city: item.clientAccount[columnIds.clientAccount.business_city],
        address:
            item.clientAccount[columnIds.clientAccount.business_street_address],
        zipCode: item.clientAccount[columnIds.clientAccount.business_zip],
        taxID: item.clientAccount[columnIds.clientAccount.tax_id_ein],
        entityType: item.clientAccount[columnIds.clientAccount.entity_type],
        industry: item.client[columnIds.clientAccount.industry],
      }
      : null,
  });
};
const OnDeckSubmissionPayload = (data) => {
  const payload = {
    business: {
      phone: cleanPhoneNumber(data.client.phone) || '', // required
      businessInceptionDate: formatDate(data.account?.businessStartDate, dateFormat.YYYYMD) || '', // required
      industryNAICSCode: '',
      industrySICCode: '',
      taxID: cleanStrToNum(data.account?.taxID) || '', // required
      doingBusinessAs: '',
      loanPurpose: data.moneyNeededFor || '',
      natureOfBusiness: data.account?.industry || '',
      landLordName: '',
      landLordPhone: '',
      name: data.account?.name || '',
      legalEntity:
        onDeckEntityMapping[data.account?.entityType?.toLowerCase()] || 'UNKNOWN',
    },
    selfReported: {
      // desiredLoanTerm: data.requestedAmount,
      // transactionCount: 23123,
      revenue: data.annualRevenue,
      averageBalance: data.avgBalance,
      // averageCCvolume: 123123,
      // mcaBalance: 12312,
      // desiredLoanAmount: data.requestedAmount,
      // personalCreditScore: data.client.creditScore,
      // creditCardMoreThan3months: undefined,
      separateBusinessBankAccount: true,
      // hasAdditionalManagingPartners: undefined,
      // hasAdditionalOwnersMoreThan25: undefined,
    },
    externalCustomerId: data.id,
  };
  payload.owners = [
    {
      dateOfBirth: formatDate(data.client.dob, dateFormat.YYYYMD),
      email: data.client.email,
      homeAddress: {
        state: data.client.state,
        city: data.client.city,
        addressLine1: data.client.address,
        zipCode: data.client.zipCode,
      },
      homePhone: cleanPhoneNumber(data.client.phone),
      ownershipPercentage: convertToNumber(data.client.ownership),
      ssn: cleanStrToNum(data.client.social_security), // required 9 chars
      name: data.client.name, // required first and last name
    },
  ];
  if (data.partner) {
    payload.owners.push({
      dateOfBirth: formatDate(data.partner.dob, dateFormat.YYYYMD),
      email: data.partner.email,
      homeAddress: {
        state: data.partner.state,
        city: data.partner.city,
        addressLine1: data.partner.address,
        addressLine2: '',
        zipCode: data.partner.zipCode,
      },
      homePhone: cleanPhoneNumber(data.partner.phone),
      ownershipPercentage: data.partner.ownership,
      ssn: cleanStrToNum(data.partner.social_security), // required 9 chars
      name: data.partner.name, // required first and last name
    });
  }
  // }
  // if client address exists, add address
  if (data.account) {
    payload.business.address = {
      state: data.account.state || '',
      city: data.account.city || '', // required
      addressLine1: data.account.address || '', // required
      addressLine2: '',
      zipCode: data.account.zipCode || '', // required
    };
  }
  return payload;
};
const submissionTranformFunctions = {
  OnDeckSubmissionPayload,
};

export const transformIntoSubmission = (item, funder) => {
  const functionName = `${funder}SubmissionPayload`;

  if (typeof submissionTranformFunctions[functionName] === 'function') {
    return submissionTranformFunctions[functionName](item);
  }
  console.error(`Function ${functionName} does not exist`);
  return { error: 'Function does not exist' };
};
