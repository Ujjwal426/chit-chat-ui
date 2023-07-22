import { Box, Card, CardBody, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import React from 'react';
import Login from '../../components/Login';
import SignUp from '../../components/SignUp';

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent fontFamily="Poppins">
      <Box
        display="flex"
        alignItems="center" // Center horizontally
        justifyContent="center" // Center vertically
        height="100vh"
      >
        <Box>
          <Card display="flex" justifyContent="center" w="100%">
            <CardBody>
              {' '}
              <Text fontWeight="1000" fontSize="25px">
                Speak - Up - Now
              </Text>
            </CardBody>
          </Card>
          <Card w="100%">
            <CardBody>
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
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
