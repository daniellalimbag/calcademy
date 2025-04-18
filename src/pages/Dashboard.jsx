import { useState, useEffect } from 'react';
import { 
  Box, Heading, Button, SimpleGrid, Card, CardHeader, CardBody, CardFooter,
  Text, HStack, VStack, Input, FormControl, FormLabel, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useToast, Alert, AlertIcon, useColorMode
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ id: '', name: '', description: '' });
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();

  useEffect(() => {
    try {
      const testKey = '__test_key__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      setIsStorageAvailable(true);
    } catch (error) {
      setIsStorageAvailable(false);
      toast({
        title: 'Storage unavailable',
        description: 'Local storage is not available. Your data will not persist between sessions.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem('calcademy-subjects');
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } catch (error) {
      console.error('Error retrieving subjects from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      try {
        localStorage.setItem('calcademy-subjects', JSON.stringify(subjects));
      } catch (error) {
        console.error('Error saving subjects to localStorage:', error);
      }
    }
  }, [subjects]);

  const handleAddSubject = () => {
    const trimmedName = newSubject.name.trim();

    if (trimmedName === '') {
      toast({
        title: 'Subject name required',
        description: 'Please enter a name for your subject',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const id = Date.now().toString();
    const subjectToAdd = { ...newSubject, id, name: trimmedName };
    const updatedSubjects = [...subjects, subjectToAdd];

    setSubjects(updatedSubjects);
    setNewSubject({ id: '', name: '', description: '' });
    onClose();

    toast({
      title: 'Subject added',
      description: `${trimmedName} has been added successfully`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteSubject = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will remove all associated grade data.`)) {
      const updatedSubjects = subjects.filter(subject => subject.id !== id);
      setSubjects(updatedSubjects);
  
      try {
        localStorage.setItem('calcademy-subjects', JSON.stringify(updatedSubjects));
      } catch (error) {
        console.error('Error saving updated subjects to localStorage:', error);
      }
  
      try {
        localStorage.removeItem(`calcademy-categories-${id}`);
        localStorage.removeItem(`calcademy-scale-${id}`);
        localStorage.removeItem(`calcademy-bonus-${id}`);
      } catch (error) {
        console.error('Error removing related localStorage data:', error);
      }
  
      toast({
        title: 'Subject deleted',
        description: `${name} has been deleted`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };  

  const cardBg = colorMode === 'dark' ? 'gray.800' : 'white';
  const cardBorderColor = colorMode === 'dark' ? 'gray.700' : 'gray.200';
  const headingColor = colorMode === 'dark' ? 'gray.100' : 'gray.800';
  const subheadingColor = colorMode === 'dark' ? 'green.300' : 'green.600';
  const textColor = colorMode === 'dark' ? 'gray.300' : 'gray.600';
  const descriptionColor = colorMode === 'dark' ? 'gray.400' : 'gray.500';
  const inputBg = colorMode === 'dark' ? 'gray.700' : 'white';
  const inputBorderColor = colorMode === 'dark' ? 'gray.600' : 'gray.200';

  return (
    <Box>
      {!isStorageAvailable && (
        <Alert status="warning" mb={2}>
          <AlertIcon boxSize="4" />
          <Text fontSize="sm">Local storage is not available. Your data will not persist between sessions.</Text>
        </Alert>
      )}

      <HStack justifyContent="space-between" mb={4} spacing={2}>
        <Heading size="md" color={headingColor}>My Subjects</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="green" onClick={onOpen} size="sm">
          Add Subject
        </Button>
      </HStack>

      {subjects.length === 0 ? (
        <Card textAlign="center" p={4} bg={cardBg} borderColor={cardBorderColor}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color={textColor}>No subjects added yet.</Text>
              <Button colorScheme="green" onClick={onOpen} size="sm">Add Your First Subject</Button>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {subjects.map(subject => (
            <Card key={subject.id} boxShadow="md" borderRadius="md" bg={cardBg} borderColor={cardBorderColor}>
              <CardHeader pb={0}>
                <Heading size="sm" color={subheadingColor}>{subject.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text fontSize="sm" color={descriptionColor}>{subject.description || 'No description'}</Text>
              </CardBody>
              <CardFooter pt={1} justifyContent="space-between">
                <Button
                  as={RouterLink}
                  to={`/calculator/${subject.id}`}
                  colorScheme="green"
                  size="xs"
                >
                  Calculate Grades
                </Button>
                <Button
                  colorScheme="red"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleDeleteSubject(subject.id, subject.name)}
                >
                  <DeleteIcon boxSize="3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={cardBg} color={textColor} maxWidth="sm">
          <ModalHeader fontSize="sm">Add New Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Subject Name</FormLabel>
              <Input
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="e.g. GERIZAL"
                bg={inputBg}
                borderColor={inputBorderColor}
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Description (Optional)</FormLabel>
              <Input
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                placeholder="e.g. Term 2 - Jose Rizal"
                bg={inputBg}
                borderColor={inputBorderColor}
                size="sm"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={2} size="sm" onClick={onClose} _hover={{ bg: colorMode === 'dark' ? "gray.700" : "gray.100" }}>
              Cancel
            </Button>
            <Button colorScheme="green" size="sm" onClick={handleAddSubject}>
              Add Subject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Dashboard;