import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config';
import GroupChatModal from '../GroupChatModal';

const MyChats = ({ fetchAgain }: any) => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = AxiosUtils.axiosConfigConstructor(
        'get',
        `/api/fetch-chat`,
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      const fetAllChats = await axios(config);
      setChats(fetAllChats.data.data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load the chat',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  console.log('Chats', chats);

  useEffect(() => {
    const userDataFromLocalStorage = localStorage.getItem('userInfo');
    const userInfo = userDataFromLocalStorage ? JSON.parse(userDataFromLocalStorage) : null;
    setLoggedUser(userInfo);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="poppins"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button display="flex" fontSize={{ base: '17px', md: '10px', lg: '17px' }} rightIcon={<AiOutlinePlus />}>
            Add New Chats
          </Button>
        </GroupChatModal>
      </Box>
      <Box display="flex" flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.length > 0 &&
              chats.map((chat: any) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>{!chat.isGroupChat ? getSender(chat.users, loggedUser) : chat.name}</Text>
                </Box>
              ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
