import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { getSender, getSenderWithFullDetails } from '../../config';
import ProfileModal from '../ProfileModal';
import UpdateGroupChatModal from '../UpdateGroupChatModal';
import AxiosUtils from '../../utils/AxiosUtils/axiosUtils';
import axios from 'axios';
import ScrollableChat from '../ScrollableChat';

import io, { Socket } from 'socket.io-client';

const ENDPOINT = 'http://localhost:9090';
var socket: Socket, selectedChatCompare: any;

const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState<Array<string>>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const toast = useToast();

  console.log('selectedChat', user);

  const typeHandler = (e: any) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit('setup', user.user);

    socket.on('connection', () => {
      setSocketConnected(true);
    });
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setloading(true);
      const config = AxiosUtils.axiosConfigConstructor(
        'get',
        `/api/fetch-message/${selectedChat._id}`,
        null,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        null,
      );
      const message = await axios(config);
      console.log('message data', message.data.data);
      setMessages(message.data.data);
      setloading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to fetch a message',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      setloading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    console.log('hiiiiii');
    socket.on('message received', newMessageReceived => {
      console.log('I am the');
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // give notification
        console.log('I am the users');
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event: any) => {
    if (event.key === 'Enter' && newMessage) {
      try {
        const config = AxiosUtils.axiosConfigConstructor(
          'post',
          `/api/send-message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
            userId: user.user._id,
          },
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          null,
        );
        setNewMessage('');
        const message = await axios(config);
        socket.emit('new message', message.data.data);
        setMessages([...messages, message.data.data]);
      } catch (error) {
        toast({
          title: 'Error Occurred',
          description: 'Failed to send a message',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="poppins"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton aria-label="" display={{ base: 'flex', md: 'none' }} icon={<IoMdArrowBack />} onClick={() => setSelectedChat('')} />
            {!selectedChat?.isGroupChat ? ( // Call getSender only when selectedChat.users is available
              <>
                {getSender(selectedChat.users, user.user)}
                <ProfileModal user={getSenderWithFullDetails(selectedChat.users, user.user)} />
              </>
            ) : (
              <>
                {selectedChat.name}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflow="hidden">
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message....." value={newMessage} onChange={typeHandler} />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="poppins">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
