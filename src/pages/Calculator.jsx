import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Heading, Button, Text, VStack, HStack, FormControl, FormLabel,
  Input, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, Card, CardBody,
  Divider, Flex, IconButton, Table, Thead, Tbody, Tr, Th, Td, 
  Alert, AlertIcon, useToast, Progress, SimpleGrid, useColorMode
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

function Calculator() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [subject, setSubject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [gradingScale, setGradingScale] = useState([
    { letter: 'A+', minPercentage: 95, gpa: 4.0 },
    { letter: 'A', minPercentage: 89, gpa: 3.5 },
    { letter: 'B+', minPercentage: 83, gpa: 3.0 },
    { letter: 'B', minPercentage: 78, gpa: 2.5 },
    { letter: 'C+', minPercentage: 72, gpa: 2.0 },
    { letter: 'C', minPercentage: 66, gpa: 1.5 },
    { letter: 'D', minPercentage: 60, gpa: 1.0 },
    { letter: 'F', minPercentage: 0, gpa: 0.0 },
  ]);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [finalGrade, setFinalGrade] = useState({ percentage: 0, letter: '', gpa: 0 });

  // Dynamic color variables
  const cardBg = colorMode === 'dark' ? 'gray.800' : 'white';
  const summaryCardBg = colorMode === 'dark' ? 'gray.700' : 'gray.50';
  const cardBorderColor = colorMode === 'dark' ? 'gray.700' : 'gray.200';
  const headingColor = colorMode === 'dark' ? 'gray.100' : 'gray.800';
  const subheadingColor = colorMode === 'dark' ? 'gray.200' : 'gray.600';
  const textColor = colorMode === 'dark' ? 'gray.300' : 'gray.600';
  const highlightColor = colorMode === 'dark' ? 'green.300' : 'green.600';
  const inputBg = colorMode === 'dark' ? 'gray.700' : 'white';
  const inputBorderColor = colorMode === 'dark' ? 'gray.600' : 'gray.200';
  const tableCellColor = colorMode === 'dark' ? 'gray.300' : 'gray.600';
  const tableHeaderColor = colorMode === 'dark' ? 'gray.400' : 'gray.500';
  const alertBg = colorMode === 'dark' ? 'yellow.800' : 'yellow.100';
  const alertTextColor = colorMode === 'dark' ? 'white' : 'gray.800';

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

  const findUniquePercentage = () => {
    const sortedScale = [...gradingScale].sort((a, b) => a.minPercentage - b.minPercentage);
    const lowestGrade = sortedScale[0];
    let newPercentage = Math.max(0, lowestGrade ? lowestGrade.minPercentage - 5 : 0);
    while (gradingScale.some(grade => grade.minPercentage === newPercentage)) {
      newPercentage = Math.max(0, newPercentage - 1);
    }
    
    return newPercentage;
  };

  const findUniqueGpa = () => {
    const sortedScale = [...gradingScale].sort((a, b) => a.gpa - b.gpa);
    
    const lowestGrade = sortedScale[0];
    
    let newGpa = Math.max(0, lowestGrade ? parseFloat((lowestGrade.gpa - 0.1).toFixed(1)) : 0);
    
    while (gradingScale.some(grade => grade.gpa === newGpa)) {
      newGpa = Math.max(0, parseFloat((newGpa - 0.1).toFixed(1)));
    }
    
    return newGpa;
  };

  const addGradeToScale = () => {
    const newMinPercentage = findUniquePercentage();
    const newGpa = findUniqueGpa();
    
    setGradingScale([
      ...gradingScale,
      { letter: 'New', minPercentage: newMinPercentage, gpa: newGpa }
    ]);
    
    toast({
      title: 'Grade Added',
      description: 'A new grade has been added to the scale.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Delete a grade from the grading scale
  const deleteGradeFromScale = (index) => {
    if (gradingScale.length <= 1) {
      toast({
        title: 'Cannot Delete',
        description: 'You must have at least one grade in the scale.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    const updatedScale = gradingScale.filter((_, i) => i !== index);
    setGradingScale(updatedScale);
    
    toast({
      title: 'Grade Deleted',
      description: 'The grade has been removed from the scale.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    calculateFinalGrade();
  };

  const updateGradingScale = (index, field, value) => {
    const updatedScale = [...gradingScale];
    const newValue = field === 'minPercentage' || field === 'gpa' ? Number(value) : value;
    
    if (field === 'minPercentage' || field === 'gpa') {
      const isDuplicate = gradingScale.some((grade, i) => 
        i !== index && grade[field] === newValue
      );
      
      if (isDuplicate) {
        toast({
          title: `Duplicate ${field === 'minPercentage' ? 'Percentage' : 'GPA'}`,
          description: `Another grade already has this ${field === 'minPercentage' ? 'percentage' : 'GPA'} value.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    
    updatedScale[index] = { ...updatedScale[index], [field]: newValue };
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
    return <Box color={textColor}>Loading...</Box>;
  }

  return (
    <Box>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg" color={headingColor}>{subject.name} Grade Calculator</Heading>
        <Button colorScheme="green" onClick={calculateFinalGrade}>
          Recalculate
        </Button>
      </HStack>

      <Card mb={8} bg={summaryCardBg} borderRadius="lg">
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold" color={subheadingColor}>Final Percentage</Text>
              <Text fontSize="3xl" fontWeight="bold" color={highlightColor}>
                {finalGrade.percentage.toFixed(2)}%
              </Text>
              <Progress 
                value={finalGrade.percentage} 
                colorScheme="green" 
                size="sm" 
                borderRadius="md" 
                mt={2}
              />
            </Box>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold" color={subheadingColor}>Letter Grade</Text>
              <Text fontSize="3xl" fontWeight="bold" color={highlightColor}>
                {finalGrade.letter}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold" color={subheadingColor}>GPA</Text>
              <Text fontSize="3xl" fontWeight="bold" color={highlightColor}>
                {finalGrade.gpa.toFixed(2)}
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {categories.reduce((sum, category) => sum + Number(category.weight), 0) !== 100 && (
        <Alert status="warning" mb={4} bg={alertBg} color={alertTextColor}>
          <AlertIcon />
          The category weights must add up to 100%. Currently they total 
          {" " + categories.reduce((sum, category) => sum + Number(category.weight), 0) + "%"}.
        </Alert>
      )}

      <VStack spacing={6} align="stretch" mb={8}>
        {categories.map(category => (
          <Card key={category.id} borderRadius="md" bg={cardBg} borderColor={cardBorderColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justifyContent="space-between">
                  <FormControl maxW="200px">
                    <FormLabel color={textColor}>Category Name</FormLabel>
                    <Input 
                      value={category.name} 
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorderColor}
                    />
                  </FormControl>
                  <FormControl maxW="150px">
                    <FormLabel color={textColor}>Weight (%)</FormLabel>
                    <NumberInput 
                      value={category.weight}
                      onChange={(value) => updateCategory(category.id, 'weight', Number(value))}
                      min={0}
                      max={100}
                    >
                      <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
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

                <Divider borderColor={cardBorderColor} />

                {/* Items Table */}
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th color={tableHeaderColor}>Name</Th>
                      <Th isNumeric color={tableHeaderColor}>Your Score</Th>
                      <Th isNumeric color={tableHeaderColor}>Max Score</Th>
                      <Th isNumeric color={tableHeaderColor}>Percentage</Th>
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
                              bg={inputBg}
                              borderColor={inputBorderColor}
                            />
                          </Td>
                          <Td isNumeric>
                            <NumberInput 
                              size="sm"
                              value={item.points}
                              onChange={(value) => updateItem(category.id, item.id, 'points', Number(value))}
                              min={0}
                            >
                              <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                            </NumberInput>
                          </Td>
                          <Td isNumeric>
                            <NumberInput 
                              size="sm"
                              value={item.maxPoints}
                              onChange={(value) => updateItem(category.id, item.id, 'maxPoints', Number(value))}
                              min={1}
                            >
                              <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                            </NumberInput>
                          </Td>
                          <Td isNumeric color={tableCellColor}>
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
                  colorScheme="green"
                >
                  Add Item
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <Button leftIcon={<AddIcon />} mb={8} onClick={addCategory} colorScheme="green">
        Add Category
      </Button>

      <Card mb={8} bg={cardBg} borderColor={cardBorderColor}>
        <CardBody>
          <Heading size="md" mb={4} color={subheadingColor}>Bonus Points</Heading>
          <FormControl maxW="200px">
            <FormLabel color={textColor}>Extra Percentage Points</FormLabel>
            <NumberInput 
              value={bonusPoints}
              onChange={(value) => setBonusPoints(Number(value))}
              min={0}
            >
              <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </CardBody>
      </Card>

      <Card bg={cardBg} borderColor={cardBorderColor}>
        <CardBody>
          <HStack justifyContent="space-between" mb={4}>
            <Heading size="md" color={subheadingColor}>Grading Scale</Heading>
            <Button 
              leftIcon={<AddIcon />} 
              size="sm" 
              onClick={addGradeToScale} 
              colorScheme="green"
            >
              Add Grade
            </Button>
          </HStack>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th color={tableHeaderColor}>Letter Grade</Th>
                <Th color={tableHeaderColor}>Minimum Percentage</Th>
                <Th color={tableHeaderColor}>GPA Value</Th>
                <Th width="50px"></Th>
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
                      bg={inputBg} 
                      borderColor={inputBorderColor}
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
                      <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
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
                      <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                    </NumberInput>
                  </Td>
                  <Td>
                    <IconButton
                      size="sm"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => deleteGradeFromScale(index)}
                    />
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