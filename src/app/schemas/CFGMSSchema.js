import * as Yup from 'yup';

const addressSchema = Yup.object().shape({
  state: Yup.string().required('State is required').length(2, 'State must be exactly 2 characters'),
  city: Yup.string().required('City is required'),
  addr1: Yup.string().required('Address Line 1 is required'),
  zip: Yup.string().required('Zip Code is required').matches(/^\d{5}$/, 'Zip Code must be a numeric string of length 5'),
});

const CFGMSchema = Yup.object().shape({
  business: Yup.object().shape({
    name: Yup.string().required('Business Name is required'),
    address: addressSchema,
    ein: Yup.string().required('Tax Id is required'),
  }),

  owner1: Yup.object().shape({
    firstName: Yup.string().required('Client First Name is required'),
    lastName: Yup.string().required('Client Last Name is required'),
    address: addressSchema,
    ssn: Yup.string().required('Client SSN is required'),
  }),

  owner2: Yup.object().shape({
    firstName: Yup.string().required('Partner First Name is required'),
    lastName: Yup.string().required('Partner Last Name is required'),
    address: addressSchema,
    ssn: Yup.string().required('Partner SSN is required'),
  }).nullable()
    .notRequired()
    .default(undefined),

  // applicationPdf: Yup.object().shape({
  //   name: Yup.string().required('Application PDF Name is required'),
  //   pdf: Yup.string().required('Application PDF is required'),
  // }),

  // bankStatementPdfs: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required('Bank Statement PDF Name is required'),
  //     pdf: Yup.string().required('Bank Statement PDF is required'),
  //   }),
  // ).required('At least one bank statement PDF is required'),
});

export default CFGMSchema;
