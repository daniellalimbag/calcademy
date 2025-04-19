import { 
  Box, Flex, Heading, Button, HStack, useColorMode, IconButton, 
  Image, Menu, MenuButton, MenuList, MenuItem, useDisclosure, Drawer,
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  VStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SunIcon, MoonIcon, HamburgerIcon } from '@chakra-ui/icons';
import icon from '../assets/icon.png';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NavLinks = ({ isMobile = false }) => {
    const Component = isMobile ? VStack : HStack;
    
    return (
      <Component spacing={isMobile ? 4 : 4} alignItems={isMobile ? "stretch" : "center"} width="full">
        <Button 
          as={RouterLink} 
          to="/" 
          variant="ghost" 
          width={isMobile ? "full" : "auto"}
          color={colorMode === 'dark' ? 'gray.200' : 'gray.700'} 
          _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
          onClick={isMobile ? onClose : undefined}
        >
          Dashboard
        </Button>
        <Button 
          as={RouterLink} 
          to="/settings" 
          variant="ghost" 
          width={isMobile ? "full" : "auto"}
          color={colorMode === 'dark' ? 'gray.200' : 'gray.700'} 
          _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
          onClick={isMobile ? onClose : undefined}
        >
          Settings
        </Button>
      </Component>
    );
  };

  return (
    <Box 
      bg={colorMode === 'dark' ? 'gray.800' : 'white'} 
      px={3} 
      boxShadow="lg"
      borderBottomWidth="1px"
      borderBottomColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={3} alignItems="center">
          <Image src={icon} alt="Calcademy Logo" boxSize="30px" />
          <Heading as="h1" size={{ base: "sm", md: "md" }} letterSpacing="tight" color="green.500">
            <RouterLink to="/">Calcademy</RouterLink>
          </Heading>
        </HStack>
        
        <HStack display={{ base: 'flex', md: 'none' }}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <SunIcon/> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
            size="sm"
          />
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
            color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}
          />
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
              <DrawerBody pt={4}>
                <NavLinks isMobile={true} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </HStack>
        
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <NavLinks />
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