import { VStack } from '@chakra-ui/react';
import { useState } from 'react';
import InputType from '../InputType';
import CustomButton from '../Button';
import { Formik, Form } from 'formik';
import validationSchema from './validationSchema';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import ToastUtils from '../../utils/toast/toast-utils';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  name: '',
  email: '',
  password: '',
  profilePicture: '',
};

const SignUp = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [uploadingToCloud, setUploadingToCloud] = useState(false);
  const [loading, setLoading] = useState(false);
  const formStyle = {
    width: '100%',
    margin: 0,
    padding: 0,
  };

  const uploadToCloud = async (pic: any) => {
    console.log('pic-type', pic.type);
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dsp7gg7u8');
      const imageUpload = await axios.post('https://api.cloudinary.com/v1_1/dsp7gg7u8/image/upload', data);
      console.log('imageUpload', imageUpload.data.url);
      return imageUpload.data.url;
    }
  };

  const createUser = async (values: any) => {
    try {
      setLoading(true);
      const signUpConfig = AxiosUtils.axiosConfigConstructor('post', '/api/users', values, {
        'Content-Type': 'application/json',
      });
      const createdUser = await axios(signUpConfig);
      console.log('CreatedUser', createdUser);
      setLoading(false);
      localStorage.setItem('userInfo', JSON.stringify(createdUser.data.data));
      ToastUtils.showSuccessToast('User created successfully');
      navigate('/chats');
    } catch (error: any) {
      console.log('error-message', error.message);
      setLoading(false);
      ToastUtils.showErrorToast(error.message);
    }
  };

  return (
    <VStack spacing="5px" fontFamily="Poppins">
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await createUser(values);
          resetForm();
        }}
      >
        {({ errors, values, handleSubmit, handleChange, handleBlur }) => (
          <Form style={formStyle}>
            <InputType
              name="name"
              label="Name"
              type="text"
              placeHolder="Enter Your Name"
              isRequired={true}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              errorMessage={errors.name}
            />
            <InputType
              name="email"
              label="Email"
              type="email"
              placeHolder="Enter Your Email"
              isRequired={true}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              errorMessage={errors.email}
            />
            <InputType
              name="password"
              label="Password"
              type={show ? 'text' : 'password'}
              placeHolder="Enter Your Password"
              isRequired={true}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              errorMessage={errors.password}
              rightElement={
                <CustomButton
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setShow(!show);
                  }}
                  text={show ? <AiFillEye /> : <AiFillEyeInvisible />}
                />
              }
            />
            <InputType
              type="file"
              label="Profile Picture"
              name="profilePicture"
              value={values.profilePicture}
              isRequired={false}
              isDisabled={uploadingToCloud}
              onChange={async (e: any) => {
                setUploadingToCloud(true);
                const imageUrl = await uploadToCloud(e.target.files[0]);
                values.profilePicture = imageUrl;
                setUploadingToCloud(false);
              }}
              onBlur={handleBlur}
            />
            <CustomButton
              colorScheme={uploadingToCloud ? 'yellow' : 'blue'}
              width="100%"
              mt={15}
              type="submit"
              text="Sign Up"
              onClick={handleSubmit}
              isDisabled={uploadingToCloud || loading}
              isLoading={loading}
            />
          </Form>
        )}
      </Formik>
    </VStack>
  );
};

export default SignUp;
