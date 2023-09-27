import {
  Avatar,
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { AiFillEye } from 'react-icons/ai';

const ProfileModal = ({ user, children }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: 'flex' }} icon={<AiFillEye />} onClick={onOpen} aria-label="" />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="40px" fontFamily="Poppins" display="flex" justifyContent="center">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Avatar size="xl" cursor="pointer" name={user.name} src={user.profilePicture} />
            <Text fontSize={{ base: '28px', md: '30px' }} fontFamily="Poppins">
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
