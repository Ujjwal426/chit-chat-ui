import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Login from '../../components/Login';
import SignUp from '../../components/SignUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userDataFromLocalStorage = localStorage.getItem('user');
    const userInfo = userDataFromLocalStorage ? JSON.parse(userDataFromLocalStorage) : null;
    console.log('userInfo', userInfo);
    if (!userInfo) {
      navigate('/');
    }
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Box display="flex" justifyContent="center" p={3} bg="white" w="100%" m={'40px 0 15px 0'} borderRadius={'1g'} borderWidth={'1px'}>
        <Text fontFamily="Poppins" fontWeight="1000" fontSize="25px">
          Speak - Up - Now
        </Text>
      </Box>
      <Box bg="white" w="100%" borderRadius="1g" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList m="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
