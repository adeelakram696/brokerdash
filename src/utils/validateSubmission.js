import { onDeckSchema } from 'app/schemas/onDeckSchema';
import CFGMSchema from 'app/schemas/CFGMSSchema';
import {
  allowedFunders, columnIds, env, fundersServices,
} from './constants';
import { transformDealDetails, transformIntoSubmission } from './funderSubmissionTransformDetails';

export const fieldmapping = {
  'business.name': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.name },
  'business.phone': { board: env.boards.clients, columnId: columnIds.clients.phone },
  'business.taxID': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.tax_id_ein },
  'business.ein': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.tax_id_ein },
  'business.businessInceptionDate': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.business_start_date },
  'business.address.city': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.business_city },
  'business.address.state': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.state_incorporated },
  'business.address.addressLine1': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.business_street_address },
  'business.address.addr1': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.business_street_address },
  'business.address.zipCode': { board: env.boards.clientAccounts, columnId: columnIds.clientAccount.business_zip },
  'owners[0].name': { board: env.boards.clients, columnId: columnIds.clients.name },
  'owners[0].dateOfBirth': { board: env.boards.clients, columnId: columnIds.clients.dob },
  'owners[0].email': { board: env.boards.clients, columnId: columnIds.clients.email },
  'owners[0].homePhone': { board: env.boards.clients, columnId: columnIds.clients.phone },
  'owners[0].ownershipPercentage': { board: env.boards.clients, columnId: columnIds.clients.ownership },
  'owners[0].ssn': { board: env.boards.clients, columnId: columnIds.clients.social_security },
  'owners[0].homeAddress.city': { board: env.boards.clients, columnId: columnIds.clients.city },
  'owners[0].homeAddress.state': { board: env.boards.clients, columnId: columnIds.clients.state },
  'owners[0].homeAddress.addressLine1': { board: env.boards.clients, columnId: columnIds.clients.address },
  'owners[0].homeAddress.zipCode': { board: env.boards.clients, columnId: columnIds.clients.zip },
  'owners[1].name': { board: env.boards.clients, columnId: columnIds.clients.name, type: 'partner' },
  'owners[1].dateOfBirth': { board: env.boards.clients, columnId: columnIds.clients.dob, type: 'partner' },
  'owners[1].email': { board: env.boards.clients, columnId: columnIds.clients.email, type: 'partner' },
  'owners[1].homePhone': { board: env.boards.clients, columnId: columnIds.clients.phone, type: 'partner' },
  'owners[1].ownershipPercentage': { board: env.boards.clients, columnId: columnIds.clients.ownership, type: 'partner' },
  'owners[1].ssn': { board: env.boards.clients, columnId: columnIds.clients.social_security, type: 'partner' },
  'owners[1].homeAddress.city': { board: env.boards.clients, columnId: columnIds.clients.city, type: 'partner' },
  'owners[1].homeAddress.state': { board: env.boards.clients, columnId: columnIds.clients.state, type: 'partner' },
  'owners[1].homeAddress.addressLine1': { board: env.boards.clients, columnId: columnIds.clients.address, type: 'partner' },
  'owners[1].homeAddress.zipCode': { board: env.boards.clients, columnId: columnIds.clients.zip, type: 'partner' },
  'owner1.firstName': { board: env.boards.clients, columnId: columnIds.clients.first_name },
  'owner1.lastName': { board: env.boards.clients, columnId: columnIds.clients.last_name },
  'owner1.dob': { board: env.boards.clients, columnId: columnIds.clients.dob },
  'owner1.email': { board: env.boards.clients, columnId: columnIds.clients.email },
  'owner1.homePhone': { board: env.boards.clients, columnId: columnIds.clients.phone },
  'owner1.ownerPercent': { board: env.boards.clients, columnId: columnIds.clients.ownership },
  'owner1.ssn': { board: env.boards.clients, columnId: columnIds.clients.social_security },
  'owner1.address.city': { board: env.boards.clients, columnId: columnIds.clients.city },
  'owner1.address.state': { board: env.boards.clients, columnId: columnIds.clients.state },
  'owner1.address.addr1': { board: env.boards.clients, columnId: columnIds.clients.address },
  'owner1.address.zipCode': { board: env.boards.clients, columnId: columnIds.clients.zip },
  'owner2.firstName': { board: env.boards.clients, columnId: columnIds.clients.first_name, type: 'partner' },
  'owner2.lastName': { board: env.boards.clients, columnId: columnIds.clients.last_name, type: 'partner' },
  'owner2.dob': { board: env.boards.clients, columnId: columnIds.clients.dob, type: 'partner' },
  'owner2.email': { board: env.boards.clients, columnId: columnIds.clients.email, type: 'partner' },
  'owner2.homePhone': { board: env.boards.clients, columnId: columnIds.clients.phone, type: 'partner' },
  'owner2.ownerPercent': { board: env.boards.clients, columnId: columnIds.clients.ownership, type: 'partner' },
  'owner2.ssn': { board: env.boards.clients, columnId: columnIds.clients.social_security, type: 'partner' },
  'owner2.address.city': { board: env.boards.clients, columnId: columnIds.clients.city, type: 'partner' },
  'owner2.address.state': { board: env.boards.clients, columnId: columnIds.clients.state, type: 'partner' },
  'owner2.address.addr1': { board: env.boards.clients, columnId: columnIds.clients.address, type: 'partner' },
  'owner2.address.zipCode': { board: env.boards.clients, columnId: columnIds.clients.zip, type: 'partner' },
};
const OnDeckPayloadValidation = async (payload) => {
  try {
    await onDeckSchema.validate(payload, { abortEarly: false });
    return null;
  } catch (err) {
    let validationErrors = [];
    if (err.inner) {
      validationErrors = err.inner.map((e) => ({
        value: e.value,
        path: e.path,
        message: e.message,
      }));
    }
    const combinedErrors = validationErrors.reduce((acc, curr) => {
      const { path, message, value } = curr;

      if (!acc[path]) {
        acc[path] = { path, value, messages: [] };
      }

      acc[path].messages.push(message);

      return acc;
    }, {});
    return Object.values(combinedErrors);
  }
};
const CFGMSPayloadValidation = async (payload) => {
  try {
    await CFGMSchema.validate(payload, { abortEarly: false });
    return null;
  } catch (err) {
    let validationErrors = [];
    if (err.inner) {
      validationErrors = err.inner.map((e) => ({
        value: e.value,
        path: e.path,
        message: e.message,
      }));
    }
    const combinedErrors = validationErrors.reduce((acc, curr) => {
      const { path, message, value } = curr;

      if (!acc[path]) {
        acc[path] = { path, value, messages: [] };
      }

      acc[path].messages.push(message);

      return acc;
    }, {});
    return Object.values(combinedErrors);
  }
};

const validateBeforeSubmissionFunc = {
  OnDeckPayloadValidation,
  CFGMSPayloadValidation,
};
export const validateBeforeSubmission = async (item, funder) => {
  const functionName = `${funder}PayloadValidation`;

  if (typeof validateBeforeSubmissionFunc[functionName] === 'function') {
    return validateBeforeSubmissionFunc[functionName](item);
  }
  console.error(`Function ${functionName} does not exist`);
  return { error: 'Function does not exist' };
};

export const validateSubmission = async (
  funders,
  alreadySubmitted,
  details,
  isResubmit,
  resubmitFunderId,
) => {
  const filterdFunders = funders.filter(
    (funder) => (
      !alreadySubmitted.includes(funder)
      || (isResubmit && allowedFunders.includes(Number(resubmitFunderId)))
    )
    && allowedFunders.includes(Number(funder)),
  );
  const fundersValidations = await Promise.all(filterdFunders.map(async (funderId) => {
    const transformed = transformDealDetails(details);
    const submissionData = transformIntoSubmission(transformed, fundersServices[funderId]);
    const validation = await validateBeforeSubmission(submissionData, fundersServices[funderId]);
    return {
      funder: fundersServices[funderId],
      errors: validation,
    };
  }));
  return fundersValidations.filter((d) => d.errors);
};
