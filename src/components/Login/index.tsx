import { VStack } from '@chakra-ui/react';
import { useState } from 'react';
import InputType from '../InputType';
import CustomButton from '../Button';

const Login = () => {
  const [show, setShow] = useState(false);
  return (
    <VStack>
      <InputType
        name="email"
        label="Email"
        type="email"
        placeHolder="Enter Your Email"
        isRequired={true}
        onChange={(event: any) => {
          console.log(event.target.value);
        }}
      />
      <InputType
        name="password"
        label="Password"
        type={show ? 'text' : 'password'}
        placeHolder="Enter Your Password"
        isRequired={true}
        onChange={(event: any) => {
          console.log(event.target.value);
        }}
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
      <CustomButton colorScheme="blue" width="100%" mt={15} type="submit" text="Login" onClick={() => {}} />
    </VStack>
  );
};

export default Login;
