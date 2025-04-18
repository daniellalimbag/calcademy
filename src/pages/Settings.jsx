import { useState, useEffect } from 'react';
import {
  Box, Heading, Button, Card, CardBody, FormControl, FormLabel,
  VStack, Alert, AlertIcon, AlertTitle, AlertDescription,
  useToast
} from '@chakra-ui/react';

function Settings() {
  const toast = useToast();
  
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
      });
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6} color="gray.100">Settings</Heading>
      
      <Card mb={6} bg="gray.800" borderColor="gray.700">
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Heading size="md" color="gray.200">Data Management</Heading>
            
            <Alert status="warning" borderRadius="md" bg="yellow.800" color="white">
              <AlertIcon />
              <Box>
                <AlertTitle>Clear All Data</AlertTitle>
                <AlertDescription>
                  This will permanently delete all your subjects, categories, and grade data.
                </AlertDescription>
              </Box>
            </Alert>
            
            <Button colorScheme="red" onClick={clearAllData}>
              Clear All Data
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Settings;