import { Box, Flex, Heading, Button, HStack, useColorMode, IconButton, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import icon from '../assets/icon.png';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box 
      bg={colorMode === 'dark' ? 'gray.800' : 'white'} 
      px={4} 
      boxShadow="lg"
      borderBottomWidth="1px"
      borderBottomColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={3} alignItems="center">
          <Image src={icon} alt="Calcademy Logo" boxSize="30px" />
          <Heading as="h1" size="md" letterSpacing="tight" color="green.500">
            <RouterLink to="/">Calcademy</RouterLink>
          </Heading>
        </HStack>
        <HStack spacing={4}>
          <Button 
            as={RouterLink} 
            to="/" 
            variant="ghost" 
            color={colorMode === 'dark' ? 'gray.200' : 'gray.700'} 
            _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
          >
            Dashboard
          </Button>
          <Button 
            as={RouterLink} 
            to="/settings" 
            variant="ghost" 
            color={colorMode === 'dark' ? 'gray.200' : 'gray.700'} 
            _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
          >
            Settings
          </Button>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <SunIcon/> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
            _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
          />
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;