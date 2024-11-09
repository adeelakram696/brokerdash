import * as Yup from 'yup';
import { dateRegex, isPastDate } from './shared';

const addressSchema = (Prefix) => (Yup.object().shape({
  state: Yup.string().required(`${Prefix} State is required`).length(2, 'State must be exactly 2 characters'),
  city: Yup.string().required(`${Prefix} City is required`),
  addr1: Yup.string().required(`${Prefix} Address Line 1 is required`),
  zip: Yup.string().required(`${Prefix} Zip Code is required`).matches(/^\d{5}$/, `${Prefix} Zip Code must be a numeric string of length 5`),
}));

const CFGMSchema = Yup.object().shape({
  business: Yup.object().shape({
    name: Yup.string().required('Business Name is required'),
    address: addressSchema('Business'),
    ein: Yup.string().required('Tax Id is required'),
  }),

  owner1: Yup.object().shape({
    firstName: Yup.string().required('Client First Name is required'),
    lastName: Yup.string().required('Client Last Name is required'),
    address: addressSchema('Client'),
    ssn: Yup.string().required('Client SSN is required'),
    dob: Yup.string()
      .required('Client Date of Birth is required in MM-DD-YYYY format')
      .matches(dateRegex, 'Client Date of Birth must be in MM-DD-YYYY format')
      .test('is-past-date', 'Client Date of Birth must be a past date', isPastDate),
  }),

  owner2: Yup.object().shape({
    firstName: Yup.string().required('Partner First Name is required'),
    lastName: Yup.string().required('Partner Last Name is required'),
    address: addressSchema('Partner'),
    ssn: Yup.string().required('Partner SSN is required'),
    dob: Yup.string()
      .required('Partner Date of Birth is required in MM-DD-YYYY format')
      .matches(dateRegex, 'Partner Date of Birth must be in MM-DD-YYYY format')
      .test('is-past-date', 'Partner Date of Birth must be a past date', isPastDate),
  }).nullable()
    .notRequired()
    .default(undefined),

  selectedDocs: Yup.array().min(2, 'You must select at least 2 PDF documents.')
    .required('Selected documents are required.'),
});

export default CFGMSchema;
