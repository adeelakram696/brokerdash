import * as Yup from 'yup';
import { dateRegex, isPastDate } from './shared';

// Address Schema
const addressSchema = (Prefix) => (Yup.object().shape({
  state: Yup.string().required(`${Prefix} State is required`).length(2, `${Prefix} State must be exactly 2 characters`),
  city: Yup.string().required(`${Prefix} City is required`),
  addressLine1: Yup.string().required(`${Prefix} Address Line 1 is required`),
  zipCode: Yup.string().required(`${Prefix} Zip Code is required`).matches(/^\d{5}$/, `${Prefix} Zip Code must be a numeric string of length 5`),
}));

// Owner Schema
const ownerSchema = Yup.object().shape({
  name: Yup.string().required('Owner Name is required'),
  dateOfBirth: Yup.string()
    .required('Owner Date of Birth is required')
    .matches(dateRegex, 'Owner Date of Birth must be in MM-DD-YYYY format')
    .test('is-past-date', 'Owner Date of Birth must be a past date', isPastDate),
  email: Yup.string().required('Owner Email is required').email('Owner Email must be a valid email address'),
  homePhone: Yup.string().required('Owner Home Phone is required').matches(/^\d{10}$/, 'Owner Home Phone must be a numeric string of 10 digits'),
  ownershipPercentage: Yup.number()
    .required('Ownership Percentage is required')
    .min(1, 'Ownership Percentage must be at least 1')
    .max(100, 'Ownership Percentage must be at most 100'),
  ssn: Yup.string().required('Owner SSN is required').matches(/^\d{9}$/, 'Owner SSN must be a numeric string of length 9'),
  homeAddress: addressSchema('Owner'),
});

// Main Schema
export const onDeckSchema = Yup.object().shape({
  business: Yup.object().shape({
    name: Yup.string().required('Business Name is required'),
    phone: Yup.string().required('Business Phone is required').matches(/^\d{10}$/, 'Business Phone must be a numeric string of 10 digits'),
    taxID: Yup.string().required('Business Tax ID is required').matches(/^\d{9}$/, 'Business Tax ID must be a numeric string of length 9'),
    businessInceptionDate: Yup.string()
      .required('Business Inception Date is required')
      .matches(dateRegex, 'Business Inception Date must be in YYYY-MM-DD format')
      .test('is-past-date', 'Business Inception Date must be a past date', isPastDate),
    address: addressSchema('Business'),
  }),
  selfReported: Yup.object().shape({
    revenue: Yup.number().required('QM Revenue is required').typeError('QM Revenue must be a number'),
    averageBalance: Yup.number().required('QM Average Balance is required').typeError('QM Average Balance must be a number'),
  }),
  owners: Yup.array().of(ownerSchema).required('Owners are required').min(1, 'At least one owner is required'),
});
