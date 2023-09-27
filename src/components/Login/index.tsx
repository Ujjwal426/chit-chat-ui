import { VStack } from '@chakra-ui/react';
import { useState } from 'react';
import InputType from '../InputType';
import CustomButton from '../Button';
import { Form, Formik } from 'formik';
import validationSchema from './validationSchema';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import ToastUtils from '../../utils/toast/toast-utils';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  email: '',
  password: '',
};

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const formStyle = {
    width: '100%',
    margin: 0,
    padding: 0,
  };

  const loginUser = async (values: any) => {
    try {
      setLoading(true);
      const loginConfig = AxiosUtils.axiosConfigConstructor('post', '/api/login', values, {
        'Content-Type': 'application/json',
      });
      console.log('loginConfig', loginConfig);
      const loginUser = await axios(loginConfig);
      console.log('CreatedUser', loginUser);
      setLoading(false);
      localStorage.setItem('userInfo', JSON.stringify(loginUser.data.data));
      ToastUtils.showSuccessToast('User created successfully');
      navigate('/chats');
    } catch (error: any) {
      console.log('error-message', error);
      setLoading(false);
      ToastUtils.showErrorToast(error.message);
    }
  };

  return (
    <VStack fontFamily="Poppins">
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await loginUser(values);
          resetForm();
        }}
      >
        {({ errors, values, handleSubmit, handleChange, handleBlur }) => (
          <Form style={formStyle}>
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
            <CustomButton colorScheme="blue" width="100%" mt={15} type="submit" text="Login" onClick={handleSubmit} isLoading={loading} />
          </Form>
        )}
      </Formik>
    </VStack>
  );
};

export default Login;
