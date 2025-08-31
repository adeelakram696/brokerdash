import * as Yup from 'yup';
import { dateRegex, isPastDate } from './shared';

// Address Schema - matching backend requirements
const addressSchema = (prefix) => Yup.object().shape({
  state: Yup.string()
    .required(`${prefix} State is required`)
    .length(2, `${prefix} State must be exactly 2 characters`),
  city: Yup.string().required(`${prefix} City is required`),
  addressLine1: Yup.string().required(`${prefix} Address Line 1 is required`),
  zipCode: Yup.string()
    .required(`${prefix} Zip Code is required`)
    .matches(/^\d{5}$/, `${prefix} Zip Code must be a numeric string of length 5`),
});

// Owner Schema - matching backend requirements
const ownerSchema = Yup.object().shape({
  name: Yup.string().required('Owner Name is required'),
  // Note: Backend splits name into firstName/lastName during transform
  dateOfBirth: Yup.string()
    .nullable() // Backend allows null
    .matches(dateRegex, 'Owner Date of Birth must be in YYYY-MM-DD format')
    .test('is-past-date', 'Owner Date of Birth must be a past date', (value) => {
      if (!value) return true; // Allow null/undefined
      return isPastDate(value);
    }),
  email: Yup.string()
    .required('Owner Email is required')
    .email('Owner Email must be a valid email address'),
  homePhone: Yup.string()
    .required('Owner Home Phone is required')
    .matches(/^\d{10}$/, 'Owner Home Phone must be a numeric string of 10 digits'),
  ownershipPercentage: Yup.number()
    .min(0, 'Ownership Percentage must be at least 0')
    .max(100, 'Ownership Percentage must be at most 100'),
  ssn: Yup.string()
    .required('Owner SSN is required')
    .matches(/^\d{9}$/, 'Owner SSN must be a numeric string of length 9'),
  homeAddress: addressSchema('Owner'),
});

// Main Schema for Expansion/ECG - matching backend requirements
export const expansionECGSchema = Yup.object().shape({
  business: Yup.object().shape({
    name: Yup.string().required('Business Name is required'),
    phone: Yup.string()
      .required('Business Phone is required')
      .matches(/^\d{10}$/, 'Business Phone must be a numeric string of 10 digits'),
    email: Yup.string()
      .required('Business Email is required')
      .email('Business Email must be a valid email address'),
    taxID: Yup.string()
      .required('Business Tax ID (EIN) is required')
      .matches(/^\d{9}$/, 'Business Tax ID must be a numeric string of length 9'),
    businessInceptionDate: Yup.string()
      .nullable() // Backend allows null
      .matches(dateRegex, 'Business Inception Date must be in YYYY-MM-DD format')
      .test('is-past-date', 'Business Inception Date must be a past date', (value) => {
        if (!value) return true; // Allow null/undefined
        return isPastDate(value);
      }),
    address: addressSchema('Business'),
  }),
  selfReported: Yup.object().shape({
    revenue: Yup.number()
      .nullable() // Backend allows null
      .positive('Revenue must be positive')
      .typeError('QM Revenue must be a number'),
    averageBalance: Yup.number()
      .nullable() // Backend allows null
      .positive('Average Balance must be positive')
      .typeError('QM Average Balance must be a number'),
    requestedAmount: Yup.number()
      .nullable() // Backend allows null
      .positive('Requested Amount must be positive')
      .typeError('Requested Amount must be a number'),
  }),
  owners: Yup.array()
    .of(ownerSchema)
    .required('Owners are required')
    .min(1, 'At least one owner is required'),
  selectedDocs: Yup.array()
    .min(1, 'You must select at least 1 document')
    .required('Selected documents are required'),
});

export default expansionECGSchema;
