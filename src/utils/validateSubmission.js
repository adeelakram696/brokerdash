import { onDeckSchema } from 'app/schemas/onDeckSchema';
import { allowedFunders, fundersServices } from './constants';
import { transformDealDetails, transformIntoSubmission } from './funderSubmissionTransformDetails';

const OnDeckPayloadValidation = async (payload) => {
  try {
    await onDeckSchema.validate(payload, { abortEarly: false });
    return null;
  } catch (err) {
    let validationErrors = [];
    if (err.inner) {
      validationErrors = err.inner.map((e) => (e.message));
    }
    return validationErrors;
  }
};

const validateBeforeSubmissionFunc = {
  OnDeckPayloadValidation,
};
export const validateBeforeSubmission = async (item, funder) => {
  const functionName = `${funder}PayloadValidation`;

  if (typeof validateBeforeSubmissionFunc[functionName] === 'function') {
    return validateBeforeSubmissionFunc[functionName](item);
  }
  console.error(`Function ${functionName} does not exist`);
  return { error: 'Function does not exist' };
};

export const validateSubmission = async (funders, alreadySubmitted, details, isResubmit) => {
  const filterdFunders = funders.filter(
    (funder) => (!alreadySubmitted.includes(funder) || isResubmit)
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
