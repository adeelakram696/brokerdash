import {
  cleanStrToNum,
} from 'utils/helpers';

export const CFGMSSubmissionPayload = (data) => {
  const payload = {
    isoName: data.name,
    appPurpose: data.moneyNeededFor || null,
    amountRequested: data.requestedAmount || null,
    avgMonthlyRevenue: data.annualRevenue ? data.annualRevenue / 12 : null,
    grossAnnualRevenue: data.annualRevenue || null,
    // handwritten: true,
    // owner1Signed: true,
    // owner1SignDate: '2022-11-23',
    // owner2Signed: true,
    // owner2SignDate: '2022-11-23',
    business: { // required
      name: data.account?.name, // required
      address: { // required
        addr1: data.account.address || '',
        addr2: '',
        city: data.account.city || '',
        state: data.account.state || '',
        zip: data.account.zipCode || '',
      },
      // businessType: 'SOLE PROPRIETORSHIP',
      // phone: '123-555-1212',
      email: 'submissions@yourapprovd.com',
      ein: cleanStrToNum(data.account.taxID) || '', // required
      // dba: 'Test Business',
      industry: data.account?.industry || null,
      incorporatedState: data.account?.state || null,
      startDate: data.account?.businessStartDate || null,
      // website: 'www.testbusiness.com',
      // naics: '48',
    },
    owner1: { // required
      firstName: data.client.firstName, // required
      lastName: data.client.firstName, // required
      address: { // required
        addr1: data.client.address,
        state: data.client.state,
        city: data.client.city,
        zip: data.client.zipCode,
      },
      // cellPhone: '123-555-1212',
      // homePhone: '123-555-1212',
      // email: 'owner@email.com',
      ssn: cleanStrToNum(data.client.social_security), // required
      // dob: '1980-05-28',
      // title: 'President',
      ownerPercent: data.client.ownership || null,
    },
    // originationChannel: 'API',
    // originator: 'Test ISO',
    // originationTimestamp: '2019-08-24T14:15:22Z',
  };
  if (data.partner) {
    payload.owner2 = {
      firstName: data.partner.firstName, // required
      lastName: data.partner.firstName, // required
      address: { // required
        addr1: data.partner.address,
        state: data.partner.state,
        city: data.partner.city,
        zip: data.partner.zipCode,
      },
      // cellPhone: '123-555-1212',
      // homePhone: '123-555-1212',
      // email: 'owner@email.com',
      ssn: cleanStrToNum(data.partner.social_security), // required
      // dob: '1980-05-28',
      // title: 'President',
      ownerPercent: data.partner.ownership || null,
    };
  }
  return payload;
};
