import {
  Box, Heading, Button, Card, CardBody, VStack,
  Alert, AlertIcon, AlertTitle, AlertDescription,
  useToast, useColorMode, Text
} from '@chakra-ui/react';

function Settings() {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const cardBg = colorMode === 'dark' ? 'gray.800' : 'white';
  const cardBorderColor = colorMode === 'dark' ? 'gray.700' : 'gray.200';
  const headingColor = colorMode === 'dark' ? 'gray.100' : 'gray.800';
  const subheadingColor = colorMode === 'dark' ? 'gray.300' : 'gray.600';
  const alertBg = colorMode === 'dark' ? 'yellow.800' : 'yellow.100';
  const alertTextColor = colorMode === 'dark' ? 'white' : 'gray.800';

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('calcademy-')) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      toast({
        title: 'Data cleared',
        description: 'All application data has been removed',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    }
  };

  return (
    <Box>
      <Heading size={{ base: "sm", md: "md" }} mb={4} color={headingColor}>Settings</Heading>

      <Card bg={cardBg} borderColor={cardBorderColor} borderWidth="1px" borderRadius="md" mb={4}>
        <CardBody p={{ base: 3, md: 4 }}>
          <VStack align="stretch" spacing={3}>
            <Heading size={{ base: "xs", md: "sm" }} color={subheadingColor}>Data Management</Heading>

            <Alert status="warning" borderRadius="md" bg={alertBg} color={alertTextColor} py={2}>
              <AlertIcon boxSize={{ base: "3", md: "4" }} />
              <Box>
                <AlertTitle fontSize={{ base: "xs", md: "sm" }}>Clear All Data</AlertTitle>
                <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
                  This will permanently delete all your subjects, categories, and grade data.
                </AlertDescription>
              </Box>
            </Alert>

            <Button 
              colorScheme="red" 
              size={{ base: "xs", md: "sm" }} 
              onClick={clearAllData}
              width={{ base: "full", md: "auto" }}
            >
              Clear All Data
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Settings;