import { dateFormat, entityMapping } from 'utils/constants';
import {
  cleanPhoneNumber, cleanStrToNum, convertToNumber, formatDate,
} from 'utils/helpers';

export const OnDeckSubmissionPayload = (data) => {
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
      entityMapping[data.account?.entityType?.toLowerCase()] || 'UNKNOWN',
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
