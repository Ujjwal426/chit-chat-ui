const getSender = (users: any, loggedInUser: any) => {
  return users[0]?._id === loggedInUser?._id ? users[1]?.name : users[0]?.name;
};

const getSenderWithFullDetails = (users: any, loggedInUser: any) => {
  return users[0]?._id === loggedInUser?._id ? users[1] : users[0];
};

const isSameSender = (messages: any, message: any, index: number, userId: string) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id || messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

const isLastMessage = (messages: any, index: number, userId: string) => {
  return index === messages.length - 1 && messages[messages.length - 1].sender._id !== userId && messages[messages.length - 1].sender._id;
};

const isSameSenderMargin = (messages: any, message: any, index: number, userId: string) => {
  if (index < messages.length - 1 && messages[index + 1].sender._id === message.sender._id && messages[index].sender._id !== userId) return 33;
  else if (
    (index < messages.length - 1 && messages[index + 1].sender._id !== message.sender._id && messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  )
    return 0;
  else return 'auto';
};

const isSameUser = (messages: any, message: any, index: number) => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};

export { getSender, getSenderWithFullDetails, isSameSender, isLastMessage, isSameSenderMargin, isSameUser };
