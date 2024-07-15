import * as Yup from 'yup';

// Helper to validate past dates
const isPastDate = (date) => {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate < today;
};

const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;

// Address Schema
const addressSchema = Yup.object().shape({
  state: Yup.string().required('State is required').length(2, 'State must be exactly 2 characters'),
  city: Yup.string().required('City is required'),
  addressLine1: Yup.string().required('Address Line 1 is required'),
  zipCode: Yup.string().required('Zip Code is required').matches(/^\d{5}$/, 'Zip Code must be a numeric string of length 5'),
});

// Owner Schema
const ownerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  dateOfBirth: Yup.string()
    .required('Date of Birth is required')
    .matches(dateRegex, 'Date of Birth must be in YYYY-MM-DD format')
    .test('is-past-date', 'Date of Birth must be a past date', isPastDate),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  homePhone: Yup.string().required('Home Phone is required').matches(/^\d{10}$/, 'Home Phone must be a numeric string of 10 digits'),
  ownershipPercentage: Yup.number()
    .required('Ownership Percentage is required')
    .min(1, 'Ownership Percentage must be at least 1')
    .max(100, 'Ownership Percentage must be at most 100'),
  ssn: Yup.string().required('SSN is required').matches(/^\d{9}$/, 'SSN must be a numeric string of length 9'),
  homeAddress: addressSchema,
});

// Main Schema
export const onDeckSchema = Yup.object().shape({
  business: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required').matches(/^\d{10}$/, 'Phone must be a numeric string of 10 digits'),
    taxID: Yup.string().required('Tax ID is required').matches(/^\d{9}$/, 'Tax ID must be a numeric string of length 9'),
    businessInceptionDate: Yup.string()
      .required('Business Inception Date is required')
      .matches(dateRegex, 'Business Inception Date must be in YYYY-MM-DD format')
      .test('is-past-date', 'Business Inception Date must be a past date', isPastDate),
    address: addressSchema,
  }),
  selfReported: Yup.object().shape({
    revenue: Yup.number().required('Revenue is required').typeError('Revenue must be a number'),
    averageBalance: Yup.number().required('Average Balance is required').typeError('Average Balance must be a number'),
  }),
  owners: Yup.array().of(ownerSchema).required('Owners are required').min(1, 'At least one owner is required'),
});
