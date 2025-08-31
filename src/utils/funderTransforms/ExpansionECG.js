import { dateFormat } from 'utils/constants';
import {
  cleanStrToNum, formatDate, cleanPhoneNumber,
} from 'utils/helpers';

export const ExpansionECGSubmissionPayload = (data) => {
  const payload = {
    business: {
      name: data.account?.name || '',
      phone: cleanPhoneNumber(data.client?.phone) || '', // Backend expects XXX-XXX-XXXX format
      email: data.client?.email || 'submissions@yourapprovd.com', // Backend requires business email
      taxID: cleanStrToNum(data.account?.taxID) || '',
      businessInceptionDate: data.account?.businessStartDate
        ? formatDate(data.account?.businessStartDate, dateFormat.YYYYMD) : null,
      address: {
        addressLine1: data.account?.address || '',
        city: data.account?.city || '',
        state: data.account?.state || '',
        zipCode: data.account?.zipCode || '',
      },
    },
    selfReported: {
      revenue: data.annualRevenue || null, // Backend allows null
      averageBalance: data.avgBalance || null, // Backend allows null
      requestedAmount: data.requestedAmount || null, // Backend expects this field
    },
    externalCustomerId: data.id,
    owners: [],
  };

  // Add primary owner - matching OnDeck structure
  if (data.client) {
    payload.owners.push({
      name: data.client?.name || '',
      dateOfBirth: data.client?.dob ? formatDate(data.client?.dob, dateFormat.YYYYMD) : null,
      email: data.client?.email || '',
      homePhone: cleanPhoneNumber(data.client?.phone) || '', // Backend expects XXX-XXX-XXXX format
      ownershipPercentage: data.client?.ownership || 100,
      ssn: cleanStrToNum(data.client?.social_security) || '',
      homeAddress: {
        addressLine1: data.client?.address || '',
        city: data.client?.city || '',
        state: data.client?.state || '',
        zipCode: data.client?.zipCode || '',
      },
    });
  }

  // Add partner/secondary owner if exists
  if (data.partner && data.partner.id) {
    payload.owners.push({
      name: data.partner?.name || '',
      dateOfBirth: data.partner?.dob ? formatDate(data.partner?.dob, dateFormat.YYYYMD) : null,
      email: data.partner?.email || '',
      homePhone: cleanPhoneNumber(data.partner?.phone) || '', // Backend expects XXX-XXX-XXXX format
      ownershipPercentage: data.partner?.ownership || 0,
      ssn: cleanStrToNum(data.partner?.social_security) || '',
      homeAddress: {
        addressLine1: data.partner?.address || '',
        city: data.partner?.city || '',
        state: data.partner?.state || '',
        zipCode: data.partner?.zipCode || '',
      },
    });
  }

  return payload;
};
