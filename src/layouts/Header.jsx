import { Box, Flex, Heading, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
  return (
    <Box bg={useColorModeValue('white', 'gray.800')} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Heading as="h1" size="md" letterSpacing="tight">
            <RouterLink to="/">Calcademy</RouterLink>
          </Heading>
        </HStack>
        <HStack spacing={4}>
          <Button as={RouterLink} to="/" variant="ghost">
            Dashboard
          </Button>
          <Button as={RouterLink} to="/settings" variant="ghost">
            Settings
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;