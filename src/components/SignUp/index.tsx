import { VStack } from '@chakra-ui/react';
import { useState } from 'react';
import InputType from '../InputType';
import CustomButton from '../Button';
import { Formik, Form } from 'formik';
import validationSchema from './validationSchema';

const SignUp = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    profile_picture: '',
  };

  const [show, setShow] = useState(false);
  const formStyle = {
    width: '100%',
    margin: 0,
    padding: 0,
  };

  return (
    <VStack spacing="5px" fontFamily="Poppins">
      <Formik
        validateOnMount={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={values => {
          alert(JSON.stringify(values));
        }}
      >
        {({ values, handleSubmit, handleChange, handleBlur }) => (
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
              rightElement={
                <CustomButton
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setShow(!show);
                  }}
                  text={show ? 'Hide' : 'Show'}
                />
              }
            />
            {/* <InputType
              type="file"
              label="Profile Picture"
              name="profile_picture"
              value={values.profile_picture}
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}
            <CustomButton  colorScheme="blue" width="100%" mt={15} type="submit" text="Sign Up" onClick={handleSubmit} />
          </Form>
        )}
      </Formik>
    </VStack>
  );
};

export default SignUp;
