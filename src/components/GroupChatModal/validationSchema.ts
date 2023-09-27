import * as Yup from 'yup';

const validationSchema = Yup.object({
  groupName: Yup.string().required('Group name is required'),
  // users: Yup.array().required('users is required'),
});

export default validationSchema;
