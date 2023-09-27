import { FormControl, FormLabel, Input, InputProps, InputGroup, InputRightElement, Box, Text } from '@chakra-ui/react';
import { ChangeEvent, useRef } from 'react';
import CustomButton from '../Button';
import { ErrorMessage } from 'formik';

interface InputPropsType extends InputProps {
  type: any;
  label?: string;
  placeHolder?: string;
  name: string;
  isRequired?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  errorMessage?: React.ReactNode;
  onSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
}
const InputType = ({
  type,
  label,
  placeHolder,
  name,
  isRequired = false,
  onChange,
  rightElement,
  errorMessage,
  onSearch,
  ...props
}: InputPropsType) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    console.log('OnSearch', onSearch);
    if (onSearch) {
      onSearch(event);
    }
  };

  if (type !== 'file') {
    return (
      <FormControl w="100%" id={name} isRequired={isRequired} fontFamily="Poppins">
        {label && (
          <FormLabel fontWeight="700" mt="5px">
            {label}
          </FormLabel>
        )}
        <InputGroup>
          <Input autoComplete="off" placeholder={placeHolder} type={type} name={name} onChange={handleInputChange} borderColor="black" {...props} />
          {rightElement && <InputRightElement w="4.5rem">{rightElement}</InputRightElement>}
        </InputGroup>
        <Text color="red" fontSize="13px" mt={2} fontWeight={700}>
          {/* Display the error message if the field has been touched and has an error */}
          {errorMessage && <ErrorMessage name={name} component="span" />}
        </Text>
      </FormControl>
    );
  } else {
    return (
      <FormControl id={name} isRequired={isRequired} fontFamily="Poppins">
        {label && (
          <FormLabel fontWeight="700" mt="5px">
            {label}
          </FormLabel>
        )}
        <Box>
          <CustomButton text="Choose File" onClick={handleButtonClick} leftIcon={<span>📁</span>} colorScheme="blue" />
          <input type="file" name={name} ref={fileInputRef} style={{ display: 'none' }} onChange={handleInputChange} />
        </Box>
      </FormControl>
    );
  }
};

export default InputType;
