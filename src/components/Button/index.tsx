import { Button, ButtonProps } from '@chakra-ui/react';

interface CustomButtonProps extends Omit<ButtonProps, 'ref'> {
  text: any;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset'; // Explicitly set the type for the prop
}

const CustomButton = ({ type, text, onClick, ...props }: CustomButtonProps) => {
  return (
    <Button type={type} onClick={onClick} {...props}>
      {text}
    </Button>
  );
};

export default CustomButton;
