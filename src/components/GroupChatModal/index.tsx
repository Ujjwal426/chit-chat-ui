import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import validationSchema from './validationSchema';
import InputType from '../InputType';
import { ChatState } from '../../context/ChatProvider';
import CustomButton from '../Button';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import UserListItem from '../UserAvtar';
import UserBadgeItem from '../UserBadge';

const initialValues = {
  groupName: '',
  users: [],
};

const GroupChatModal = ({ children }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingForCreateGroup, setLoadingForCreateGroup] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  const handleGroup = (userToAdd: never) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  const handleDelete = (userToRemove: any) => {
    setSelectedUser(selectedUser.filter((user: any) => user._id !== userToRemove._id));
  };

  const handleSubmit = async (values: any) => {
    if (selectedUser.length < 1) {
      toast({
        title: 'Please select a user to create a group',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      const usersIds = selectedUser.map((user: any) => user._id);
      const config = AxiosUtils.axiosConfigConstructor(
        'post',
        `/api/group-chat`,
        {
          usersIds: usersIds,
          groupName: values.groupName,
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      const chat = await axios(config);
      setChats([chat.data.data, ...chats]);
      onClose();
      toast({
        title: 'New group chat created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Falied to create a group chat',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="poppins" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setSearchResult([]);
              setSelectedUser([]);
            }}
          />
          <ModalBody alignItems="center">
            <Formik
              validateOnMount={true}
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={async (values, { resetForm }) => {
                await handleSubmit(values);
                resetForm();
              }}
            >
              {({ errors, values, handleSubmit, handleChange, handleBlur }) => (
                <Form>
                  <InputType
                    name="groupName"
                    type="text"
                    placeHolder="Chat Name"
                    isRequired={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.groupName}
                    errorMessage={errors.groupName}
                  />
                  <InputType
                    name="users"
                    type="text"
                    placeHolder="Add users eg: Ujjwal, Raj, Pranjul"
                    isRequired={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.users}
                    errorMessage={errors.users}
                    onSearch={async e => {
                      e.preventDefault();
                      await handleSearch(e.target.value);
                    }}
                  />
                  {selectedUser.map((user: any) => (
                    <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                  ))}
                  {loading ? (
                    <div>loading....</div>
                  ) : (
                    searchResult?.slice(0, 4).map(user => <UserListItem user={user} handleFunction={() => handleGroup(user)} />)
                  )}
                  <CustomButton
                    colorScheme="blue"
                    width="100%"
                    mt={15}
                    type="submit"
                    text="Create Chat"
                    onClick={handleSubmit}
                    isLoading={loadingForCreateGroup}
                  />
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
