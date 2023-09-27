import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }: any) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message: any, index: number) => (
          <div style={{ display: 'flex' }} key={message._id}>
            {(isSameSender(messages, message, index, user.user._id) || isLastMessage(messages, index, user.user._id)) && (
              <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={message.sender.name} src={message.sender.profilePicture} />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${message.sender._id === user.user._id ? '#BEE3F8' : '#B9F5D0'}`,
                marginLeft: isSameSenderMargin(messages, message, index, user.user._id),
                marginTop: isSameUser(messages, message, index) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
