import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import CustomButton from '../Button';
import { FaSearch } from 'react-icons/fa';
import { HiBellAlert, HiBell } from 'react-icons/hi2';
import { BiChevronDown } from 'react-icons/bi';
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from '../ProfileModal';
import { useNavigate } from 'react-router-dom';
import { title } from 'process';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvtar';

import './style.css';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const navigate = useNavigate();

  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in search',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'get',
        `/api/users/search/${search}`,
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

  const accessChat = async (id: string) => {
    console.log('Id', id);
    try {
      setLoadingChat(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'post',
        `/api/access-chat`,
        { userId: id },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      console.log('Check Config', config);
      const createOrFetchChat = await axios(config);
      console.log('createOrFetchChat', createOrFetchChat.data.data);
      if (!chats.find((chat: any) => chat._id === createOrFetchChat.data.data._id)) setChats([createOrFetchChat.data.data, ...chats]);
      setLoadingChat(false);
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error Occurred',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <CustomButton
            type="button"
            text={
              <>
                <FaSearch />
                <Text display={{ base: 'none', md: 'flex' }} px="2">
                  Search User
                </Text>
              </>
            }
            variant="ghost"
            onClick={onOpen}
          />
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Poppins" fontWeight="1000">
          Speak - Up - Now
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <HiBellAlert style={{ fontSize: '20px', margin: '10px' }} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<BiChevronDown />} marginTop="-28px">
              <Avatar size="sm" cursor="pointer" name={user.user.name} src={user.user.profilePicture} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  localStorage.removeItem('userInfo');
                  navigate('/');
                }}
              >
                {' '}
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input placeholder="Search by name or email" mr={2} value={search} onChange={e => setSearch(e.target.value)} />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? <ChatLoading /> : searchResult?.map((user: any) => <UserListItem user={user} handleFunction={() => accessChat(user._id)} />)}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
