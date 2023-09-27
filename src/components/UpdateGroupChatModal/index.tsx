import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserBadge';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import UserListItem from '../UserAvtar';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>([]);

  const handleRemove = async (userToRemove: any) => {
    if (!selectedChat.groupAdmin.find((userCheck: any) => userCheck._id === user.user._id) && userToRemove._id !== user.user._id) {
      toast({
        title: 'Error Occurred',
        description: 'Only admin can remove the user',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'put',
        `/api/remove-user-chat`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
          adminId: user.user._id,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      const remopveUserFromGroup = await axios(config);
      userToRemove._id === user.user._id ? setSelectedChat() : setSelectedChat(remopveUserFromGroup.data.data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to remove user from the chat',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  const handleRename = async (userToRemove: any) => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'put',
        `/api/rename-group`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
          userId: user.user._id,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      const renameGroup = await axios(config);
      setSelectedChat(renameGroup.data.data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to rename the group',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  const handleSearch = async (searchName: string) => {
    if (!searchName) {
      return;
    }
    try {
      setLoading(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'get',
        `/api/users/search/${searchName}`,
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );

      const searchUsersList = await axios(config);
      console.log('SearchUsersList', searchUsersList);
      setLoading(false);
      setSearchResult(searchUsersList.data.data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  const handleAddGroup = async (userToAdd: any) => {
    if (selectedChat.users.find((user: any) => user._id === userToAdd._id)) {
      toast({
        title: 'User already in a group',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (!selectedChat.groupAdmin.find((userCheck: any) => userCheck._id === user.user._id)) {
      toast({
        title: 'Only admin can add users in the group',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      setLoading(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'put',
        `/api/add-user-chat`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
          adminId: user.user._id,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      const updateUsersInGroup = await axios(config);
      setSelectedChat(updateUsersInGroup.data.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to add user in the group',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }

    setSelectedUser([...selectedUser, userToAdd]);
  };

  return (
    <>
      <IconButton aria-label="" icon={<AiFillEye />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="poppins" display="flex" justifyContent="center">
            {selectedChat.name}
          </ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setSearchResult([]);
              setSelectedUser([]);
              setGroupChatName('');
            }}
          />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users?.map((user: any) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
              ))}
            </Box>
            <FormControl display="flex">
              <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e: any) => setGroupChatName(e.target.value)} />
              <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input placeholder="Add User to group" mb={1} onChange={(e: any) => handleSearch(e.target.value)} />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.slice(0, 4).map(user => <UserListItem user={user} handleFunction={() => handleAddGroup(user)} />)
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
