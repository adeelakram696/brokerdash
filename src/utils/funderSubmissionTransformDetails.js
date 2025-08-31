import {
  columnIds,
} from './constants';
import { decodeJson } from './encrypt';
import { CFGMSSubmissionPayload } from './funderTransforms/CFGMS';
import { OnDeckSubmissionPayload } from './funderTransforms/OnDeck';
import { ExpansionECGSubmissionPayload } from './funderTransforms/ExpansionECG';

export const transformDealDetails = (item) => {
  const qmDataEncoded = item.column_values.find(
    (c) => c.id === columnIds.deals.qualification_matrix_data,
  );
  let qmData = {};
  if (qmDataEncoded.text) {
    const decodedData = decodeJson(qmDataEncoded.text);
    qmData = decodedData.matrixValues;
  } else {
    const qmBankActivity = item.column_values.find(
      (c) => c.id === columnIds.deals.qm_bank_activity,
    );
    const qmActivePositions = item.column_values.find(
      (c) => c.id === columnIds.deals.qm_active_position,
    );
    const bankActivityObj = qmBankActivity?.text ? JSON.parse(qmBankActivity.text) : {};
    const activePositionObj = qmActivePositions?.text ? JSON.parse(qmActivePositions.text) : {};
    qmData = {
      ...bankActivityObj,
      ...activePositionObj,
    };
  }
  const avgBalance = qmData?.min_daily_balnc ? qmData?.min_daily_balnc : '';
  const annualRevenue = qmData?.annualRevenue ? qmData?.annualRevenue : '';
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
      firstName: item.client[columnIds.clients.first_name],
      lastName: item.client[columnIds.clients.last_name],
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
        firstName: item.partner[columnIds.clients.first_name],
        lastName: item.partner[columnIds.clients.last_name],
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

const submissionTranformFunctions = {
  OnDeckSubmissionPayload,
  CFGMSSubmissionPayload,
  ExpansionECGSubmissionPayload,
};

export const transformIntoSubmission = (item, funder) => {
  const functionName = `${funder}SubmissionPayload`;
  if (typeof submissionTranformFunctions[functionName] === 'function') {
    return submissionTranformFunctions[functionName](item);
  }
  console.error(`Function ${functionName} does not exist`);
  return { error: 'Function does not exist' };
};
