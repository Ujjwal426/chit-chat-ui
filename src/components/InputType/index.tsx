import { FormControl, FormLabel, Input, InputProps, InputGroup, InputRightElement, Box, Container, Card } from '@chakra-ui/react';
import { ChangeEvent, useRef } from 'react';
import CustomButton from '../Button';
import { ErrorMessage } from 'formik';

interface InputPropsType extends InputProps {
  type: string;
  label: string;
  placeHolder?: string;
  name: string;
  isRequired?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}

const InputType = ({ type, label, placeHolder, name, isRequired = false, onChange, rightElement, ...props }: InputPropsType) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  if (type !== 'file') {
    return (
      <FormControl w="100%" id={name} isRequired={isRequired}>
        <FormLabel fontWeight={700} mt="5px">
          {label}
        </FormLabel>
        <InputGroup>
          <Input placeContent={placeHolder} type={type} name={name} onChange={onChange} borderColor="black" {...props} />
          {rightElement && <InputRightElement w="4.5rem">{rightElement}</InputRightElement>}
        </InputGroup>
        {/* <Container color="red" fontSize="13px">
          <small>
            <ErrorMessage name={name} />
          </small>
        </Container> */}
      </FormControl>
    );
  } else {
    return (
      <FormControl id={name} isRequired={isRequired}>
        <FormLabel fontWeight={700} mt="5px">
          {label}
        </FormLabel>
        <Card>
          <CustomButton text="Choose File" onClick={handleButtonClick} leftIcon={<span>📁</span>} colorScheme="blue" />
          <input type="file" name={name} ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
        </Card>
      </FormControl>
    );
  }
};

export default InputType;
