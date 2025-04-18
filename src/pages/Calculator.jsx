import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Heading, Button, Text, VStack, HStack, FormControl, FormLabel,
  Input, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, Card, CardBody,
  Divider, Flex, IconButton, Table, Thead, Tbody, Tr, Th, Td, 
  Alert, AlertIcon, useToast, Progress, SimpleGrid
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

function Calculator() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [subject, setSubject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [gradingScale, setGradingScale] = useState([
    { letter: 'A', minPercentage: 90, gpa: 4.0 },
    { letter: 'B', minPercentage: 80, gpa: 3.0 },
    { letter: 'C', minPercentage: 70, gpa: 2.0 },
    { letter: 'D', minPercentage: 60, gpa: 1.0 },
    { letter: 'F', minPercentage: 0, gpa: 0.0 },
  ]);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [finalGrade, setFinalGrade] = useState({ percentage: 0, letter: '', gpa: 0 });

  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem('calcademy-subjects') || '[]');
    const currentSubject = savedSubjects.find(s => s.id === subjectId);
    
    if (!currentSubject) {
      navigate('/');
      return;
    }
    
    setSubject(currentSubject);
    
    const savedCategories = JSON.parse(localStorage.getItem(`calcademy-categories-${subjectId}`) || '[]');
    if (savedCategories.length === 0) {
      const defaults = [
        { id: 'assignments', name: 'Assignments', weight: 30, items: [] },
        { id: 'projects', name: 'Projects', weight: 30, items: [] },
        { id: 'exams', name: 'Exams', weight: 40, items: [] }
      ];
      setCategories(defaults);
      localStorage.setItem(`calcademy-categories-${subjectId}`, JSON.stringify(defaults));
    } else {
      setCategories(savedCategories);
    }
    
    const savedGradingScale = JSON.parse(localStorage.getItem(`calcademy-scale-${subjectId}`) || '[]');
    if (savedGradingScale.length > 0) {
      setGradingScale(savedGradingScale);
    }
    
    const savedBonusPoints = localStorage.getItem(`calcademy-bonus-${subjectId}`);
    if (savedBonusPoints !== null) {
      setBonusPoints(Number(savedBonusPoints));
    }
  }, [subjectId, navigate]);

  useEffect(() => {
    if (categories.length > 0 && subject) {
      localStorage.setItem(`calcademy-categories-${subjectId}`, JSON.stringify(categories));
      calculateFinalGrade();
    }
  }, [categories, subjectId, subject]);

  useEffect(() => {
    if (gradingScale.length > 0 && subject) {
      localStorage.setItem(`calcademy-scale-${subjectId}`, JSON.stringify(gradingScale));
    }
  }, [gradingScale, subjectId, subject]);

  useEffect(() => {
    if (subject) {
      localStorage.setItem(`calcademy-bonus-${subjectId}`, bonusPoints.toString());
      calculateFinalGrade();
    }
  }, [bonusPoints, subjectId, subject]);

  const addCategory = () => {
    const id = `category-${Date.now()}`;
    setCategories([...categories, { id, name: 'New Category', weight: 0, items: [] }]);
  };

  const updateCategory = (id, field, value) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, [field]: value } : category
    ));
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const addItem = (categoryId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const items = [
          ...category.items, 
          { id: `item-${Date.now()}`, name: 'New Item', points: 0, maxPoints: 100 }
        ];
        return { ...category, items };
      }
      return category;
    }));
  };

  const updateItem = (categoryId, itemId, field, value) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const items = category.items.map(item => 
          item.id === itemId ? { ...item, [field]: value } : item
        );
        return { ...category, items };
      }
      return category;
    }));
  };

  const deleteItem = (categoryId, itemId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const items = category.items.filter(item => item.id !== itemId);
        return { ...category, items };
      }
      return category;
    }));
  };

  const updateGradingScale = (index, field, value) => {
    const updatedScale = [...gradingScale];
    updatedScale[index] = { ...updatedScale[index], [field]: field === 'minPercentage' ? Number(value) : value };
    setGradingScale(updatedScale);
    calculateFinalGrade();
  };

  const calculateFinalGrade = () => {
    const totalWeight = categories.reduce((sum, category) => sum + Number(category.weight), 0);
    if (totalWeight !== 100) {
      return;
    }

    let totalWeightedPercentage = 0;

    categories.forEach(category => {
      if (category.items.length === 0) return;
      
      const totalPoints = category.items.reduce((sum, item) => sum + Number(item.points), 0);
      const totalMaxPoints = category.items.reduce((sum, item) => sum + Number(item.maxPoints), 0);
      
      if (totalMaxPoints > 0) {
        const categoryPercentage = (totalPoints / totalMaxPoints) * 100;
        const weightedPercentage = (categoryPercentage * Number(category.weight)) / 100;
        totalWeightedPercentage += weightedPercentage;
      }
    });

    let finalPercentage = totalWeightedPercentage + Number(bonusPoints);
    if (finalPercentage > 100) finalPercentage = 100;

    const grade = gradingScale
      .slice()
      .sort((a, b) => b.minPercentage - a.minPercentage)
      .find(grade => finalPercentage >= grade.minPercentage);

    setFinalGrade({
      percentage: finalPercentage,
      letter: grade ? grade.letter : 'N/A',
      gpa: grade ? grade.gpa : 0
    });
  };

  if (!subject) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg">{subject.name} Grade Calculator</Heading>
        <Button colorScheme="blue" onClick={calculateFinalGrade}>
          Recalculate
        </Button>
      </HStack>

      <Card mb={8} bg="blue.50" borderRadius="lg">
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold">Final Percentage</Text>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                {finalGrade.percentage.toFixed(2)}%
              </Text>
              <Progress 
                value={finalGrade.percentage} 
                colorScheme="blue" 
                size="sm" 
                borderRadius="md" 
                mt={2}
              />
            </Box>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold">Letter Grade</Text>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                {finalGrade.letter}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold">GPA</Text>
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                {finalGrade.gpa.toFixed(2)}
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {categories.reduce((sum, category) => sum + Number(category.weight), 0) !== 100 && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          The category weights must add up to 100%. Currently they total 
          {" " + categories.reduce((sum, category) => sum + Number(category.weight), 0) + "%"}.
        </Alert>
      )}

      <VStack spacing={6} align="stretch" mb={8}>
        {categories.map(category => (
          <Card key={category.id} borderRadius="md">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justifyContent="space-between">
                  <FormControl maxW="200px">
                    <FormLabel>Category Name</FormLabel>
                    <Input 
                      value={category.name} 
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    />
                  </FormControl>
                  <FormControl maxW="150px">
                    <FormLabel>Weight (%)</FormLabel>
                    <NumberInput 
                      value={category.weight}
                      onChange={(value) => updateCategory(category.id, 'weight', Number(value))}
                      min={0}
                      max={100}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => deleteCategory(category.id)}
                    alignSelf="flex-end"
                  />
                </HStack>

                <Divider />

                {/* Items Table */}
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th isNumeric>Points Earned</Th>
                      <Th isNumeric>Max Points</Th>
                      <Th isNumeric>Percentage</Th>
                      <Th w="50px"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {category.items.map(item => {
                      const percentage = item.maxPoints > 0 
                        ? (item.points / item.maxPoints) * 100 
                        : 0;
                      
                      return (
                        <Tr key={item.id}>
                          <Td>
                            <Input
                              size="sm"
                              value={item.name}
                              onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                            />
                          </Td>
                          <Td isNumeric>
                            <NumberInput 
                              size="sm"
                              value={item.points}
                              onChange={(value) => updateItem(category.id, item.id, 'points', Number(value))}
                              min={0}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td isNumeric>
                            <NumberInput 
                              size="sm"
                              value={item.maxPoints}
                              onChange={(value) => updateItem(category.id, item.id, 'maxPoints', Number(value))}
                              min={1}
                            >
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td isNumeric>
                            {percentage.toFixed(2)}%
                          </Td>
                          <Td>
                            <IconButton
                              size="sm"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => deleteItem(category.id, item.id)}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>

                <Button 
                  leftIcon={<AddIcon />} 
                  size="sm" 
                  onClick={() => addItem(category.id)} 
                  alignSelf="flex-start"
                >
                  Add Item
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <Button leftIcon={<AddIcon />} mb={8} onClick={addCategory}>
        Add Category
      </Button>

      <Card mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>Bonus Points</Heading>
          <FormControl maxW="200px">
            <FormLabel>Extra Percentage Points</FormLabel>
            <NumberInput 
              value={bonusPoints}
              onChange={(value) => setBonusPoints(Number(value))}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Grading Scale</Heading>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Letter Grade</Th>
                <Th>Minimum Percentage</Th>
                <Th>GPA Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gradingScale.map((grade, index) => (
                <Tr key={index}>
                  <Td>
                    <Input 
                      size="sm"
                      value={grade.letter}
                      onChange={(e) => updateGradingScale(index, 'letter', e.target.value)}
                    />
                  </Td>
                  <Td>
                    <NumberInput 
                      size="sm"
                      value={grade.minPercentage}
                      onChange={(value) => updateGradingScale(index, 'minPercentage', value)}
                      min={0}
                      max={100}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </Td>
                  <Td>
                    <NumberInput 
                      size="sm"
                      value={grade.gpa}
                      onChange={(value) => updateGradingScale(index, 'gpa', value)}
                      step={0.1}
                      min={0}
                      max={4.0}
                      precision={1}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Calculator;