import { Box } from '@chakra-ui/react';
import React from 'react';
import { GrFormClose } from 'react-icons/gr';

const UserBadgeItem = ({ user, handleFunction }: any) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="inline-block"
    >
      {user?.name}
      <span style={{ paddingLeft: '3px', display: 'inline-block' }}>
        <GrFormClose />
      </span>
    </Box>
  );
};

export default UserBadgeItem;
