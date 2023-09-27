import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext<any>('');

interface Props {
  children: any;
}

const ChatProvider = ({ children }: Props) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userDataFromLocalStorage = localStorage.getItem('userInfo');
    const userInfo = userDataFromLocalStorage ? JSON.parse(userDataFromLocalStorage) : null;

    setUser(userInfo);
    setIsLoading(false);

    if (!userInfo) {
      navigate('/');
    }
  }, [navigate]);

  if (isLoading) {
    // You can render a loading indicator here if needed
    return <div>Loading...</div>;
  }

  return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
