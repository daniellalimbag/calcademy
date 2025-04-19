import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Heading, Button, Text, VStack, HStack, FormControl, FormLabel,
  Input, NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, Card, CardBody,
  Divider, IconButton, Table, Thead, Tbody, Tr, Th, Td, 
  Alert, AlertIcon, useToast, Progress, SimpleGrid, useColorMode,
  Stack, Flex
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
    setGradingScale([
      ...gradingScale,
      { letter: 'New', minPercentage: findUniquePercentage(), gpa: findUniqueGpa() }
    ]);
    
    toast({
      title: 'Grade Added',
      description: 'A new grade has been added to the scale.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

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
    
    setGradingScale(gradingScale.filter((_, i) => i !== index));
    calculateFinalGrade();
  };

  const updateGradingScale = (index, field, value) => {
    const newValue = field === 'minPercentage' || field === 'gpa' ? Number(value) : value;
    
    if ((field === 'minPercentage' || field === 'gpa') && 
        gradingScale.some((grade, i) => i !== index && grade[field] === newValue)) {
      toast({
        title: `Duplicate ${field === 'minPercentage' ? 'Percentage' : 'GPA'}`,
        description: `Another grade already has this ${field === 'minPercentage' ? 'percentage' : 'GPA'} value.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const updatedScale = [...gradingScale];
    updatedScale[index] = { ...updatedScale[index], [field]: newValue };
    setGradingScale(updatedScale);
    calculateFinalGrade();
  };

  const calculateFinalGrade = () => {
    const totalWeight = categories.reduce((sum, category) => sum + Number(category.weight), 0);
    if (totalWeight !== 100) return;

    let totalWeightedPercentage = categories.reduce((acc, category) => {
      if (category.items.length === 0) return acc;
      
      const totalPoints = category.items.reduce((sum, item) => sum + Number(item.points), 0);
      const totalMaxPoints = category.items.reduce((sum, item) => sum + Number(item.maxPoints), 0);
      
      if (totalMaxPoints > 0) {
        const categoryPercentage = (totalPoints / totalMaxPoints) * 100;
        return acc + (categoryPercentage * Number(category.weight)) / 100;
      }
      return acc;
    }, 0);

    let finalPercentage = Math.min(100, totalWeightedPercentage + Number(bonusPoints));

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

  const MobileItemRow = ({ item, category, onDelete, onUpdate }) => {
    const percentage = item.maxPoints > 0 
      ? (item.points / item.maxPoints) * 100 
      : 0;
    
    return (
      <Box 
        borderWidth="1px" 
        borderColor={cardBorderColor} 
        borderRadius="md" 
        p={2} 
        mb={2}
        bg={inputBg}
      >
        <VStack spacing={2} align="stretch">
          <FormControl>
            <FormLabel fontSize="xs" mb={0} color={textColor}>Name</FormLabel>
            <Input
              size="sm"
              value={item.name}
              onChange={(e) => onUpdate(category.id, item.id, 'name', e.target.value)}
              bg={inputBg}
              borderColor={inputBorderColor}
            />
          </FormControl>
          
          <Flex justify="space-between" gap={2}>
            <FormControl flex="1">
              <FormLabel fontSize="xs" mb={0} color={textColor}>Score</FormLabel>
              <NumberInput 
                size="sm"
                value={item.points}
                onChange={(val) => onUpdate(category.id, item.id, 'points', Number(val))}
                min={0}
              >
                <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
              </NumberInput>
            </FormControl>
            
            <FormControl flex="1">
              <FormLabel fontSize="xs" mb={0} color={textColor}>Max</FormLabel>
              <NumberInput 
                size="sm"
                value={item.maxPoints}
                onChange={(val) => onUpdate(category.id, item.id, 'maxPoints', Number(val))}
                min={1}
              >
                <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
              </NumberInput>
            </FormControl>
          </Flex>
          
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color={tableCellColor}>{percentage.toFixed(1)}%</Text>
            <IconButton
              size="sm"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              onClick={() => onDelete(category.id, item.id)}
            />
          </Flex>
        </VStack>
      </Box>
    );
  };

  const MobileGradeRow = ({ grade, index, onUpdate, onDelete }) => {
    return (
      <Box 
        borderWidth="1px" 
        borderColor={cardBorderColor} 
        borderRadius="md" 
        p={2} 
        mb={2}
        bg={cardBg}
      >
        <Flex
          wrap="wrap"
          gap={2}
          justify="space-between"
        >
          <FormControl flex="1" minW={{ base: "48%", sm: "30%" }}>
            <FormLabel fontSize="xs" mb={0} color={textColor}>Letter</FormLabel>
            <Input 
              size="sm"
              value={grade.letter}
              onChange={(e) => onUpdate(index, 'letter', e.target.value)}
              bg={inputBg} 
              borderColor={inputBorderColor}
            />
          </FormControl>
          
          <FormControl flex="1" minW={{ base: "48%", sm: "30%" }}>
            <FormLabel fontSize="xs" mb={0} color={textColor}>Min %</FormLabel>
            <NumberInput 
              size="sm"
              value={grade.minPercentage}
              onChange={(val) => onUpdate(index, 'minPercentage', val)}
              min={0}
              max={100}
            >
              <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
            </NumberInput>
          </FormControl>
          
          <FormControl flex="1" minW={{ base: "48%", sm: "30%" }}>
            <FormLabel fontSize="xs" mb={0} color={textColor}>GPA</FormLabel>
            <NumberInput 
              size="sm"
              value={grade.gpa}
              onChange={(val) => onUpdate(index, 'gpa', val)}
              step={0.1}
              min={0}
              max={4.0}
              precision={1}
            >
              <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
            </NumberInput>
          </FormControl>
  
          <Box minW="40px">
            <IconButton
              size="sm"
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              onClick={() => onDelete(index)}
              alignSelf="flex-end"
              mt="auto"
            />
          </Box>
        </Flex>
      </Box>
    );
  };
  

  if (!subject) return <Box color={textColor}>Loading...</Box>;

  return (
    <Box px={{ base: 2, md: 4 }} maxW="100%" overflow="hidden">
      <Stack 
        direction={{ base: "column", md: "row" }} 
        justifyContent="space-between" 
        alignItems={{ base: "flex-start", md: "center" }} 
        mb={4}
        spacing={2}
      >
        <Heading 
          size={{ base: "md", md: "lg" }} 
          color={headingColor}
          noOfLines={1}
        >
          {subject.name} Grade Calculator
        </Heading>
        <Button 
          size="sm" 
          colorScheme="green" 
          onClick={calculateFinalGrade}
          width={{ base: "100%", md: "auto" }}
        >
          Recalculate
        </Button>
      </Stack>
  
      <Card mb={4} bg={summaryCardBg} borderRadius="md">
        <CardBody py={4}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[
              { label: 'Final Percentage', value: `${finalGrade.percentage.toFixed(2)}%` },
              { label: 'Letter Grade', value: finalGrade.letter },
              { label: 'GPA', value: finalGrade.gpa.toFixed(1) }
            ].map((item, i) => (
              <Box key={i} textAlign="center">
                <Text fontSize="sm" fontWeight="medium" color={subheadingColor}>{item.label}</Text>
                <Text fontSize="2xl" fontWeight="bold" color={highlightColor}>{item.value}</Text>
                {i === 0 && (
                  <Progress value={finalGrade.percentage} colorScheme="green" size="sm" borderRadius="md" mt={2} />
                )}
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
  
      {categories.reduce((sum, cat) => sum + Number(cat.weight), 0) !== 100 && (
        <Alert status="warning" mb={4} py={2} fontSize="sm" bg={alertBg} color={alertTextColor}>
          <AlertIcon />
          <Text fontSize="xs">
            The category weights must add up to 100%. Currently they total 
            {" " + categories.reduce((sum, cat) => sum + Number(cat.weight), 0) + "%"}.
          </Text>
        </Alert>
      )}
  
      <VStack spacing={4} align="stretch" mb={6}>
        {categories.map(category => (
          <Card key={category.id} borderRadius="md" bg={cardBg} borderColor={cardBorderColor}>
            <CardBody p={{ base: 2, md: 4 }}>
              <VStack spacing={4} align="stretch">
                <Stack 
                  direction={{ base: "column", md: "row" }}
                  justifyContent="space-between" 
                  spacing={2}
                >
                  <FormControl>
                    <FormLabel fontSize="xs" mb={1} color={textColor}>Category Name</FormLabel>
                    <Input 
                      size="sm"
                      value={category.name} 
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorderColor}
                    />
                  </FormControl>
                  <Stack direction="row" width={{ base: "100%", md: "auto" }}>
                    <FormControl flex="1">
                      <FormLabel fontSize="xs" mb={1} color={textColor}>Weight (%)</FormLabel>
                      <NumberInput 
                        size="sm"
                        value={category.weight}
                        onChange={(val) => updateCategory(category.id, 'weight', Number(val))}
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
                      size="sm"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => deleteCategory(category.id)}
                      alignSelf="flex-end"
                    />
                  </Stack>
                </Stack>
  
                <Divider borderColor={cardBorderColor} />
  
                <Box display={{ base: "none", md: "block" }}>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th px={2} color={tableHeaderColor} fontSize="xs">Name</Th>
                        <Th isNumeric px={2} color={tableHeaderColor} fontSize="xs">Your Score</Th>
                        <Th isNumeric px={2} color={tableHeaderColor} fontSize="xs">Max Score</Th>
                        <Th isNumeric px={2} color={tableHeaderColor} fontSize="xs">%</Th>
                        <Th w="40px" px={2}></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {category.items.map(item => {
                        const percentage = item.maxPoints > 0 
                          ? (item.points / item.maxPoints) * 100 
                          : 0;
                        return (
                          <Tr key={item.id}>
                            <Td px={2}>
                              <Input
                                size="sm"
                                value={item.name}
                                onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                                bg={inputBg}
                                borderColor={inputBorderColor}
                              />
                            </Td>
                            <Td isNumeric px={2}>
                              <NumberInput 
                                size="sm"
                                value={item.points}
                                onChange={(val) => updateItem(category.id, item.id, 'points', Number(val))}
                                min={0}
                              >
                                <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                              </NumberInput>
                            </Td>
                            <Td isNumeric px={2}>
                              <NumberInput 
                                size="sm"
                                value={item.maxPoints}
                                onChange={(val) => updateItem(category.id, item.id, 'maxPoints', Number(val))}
                                min={1}
                              >
                                <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                              </NumberInput>
                            </Td>
                            <Td isNumeric px={2} color={tableCellColor}>
                              {percentage.toFixed(1)}%
                            </Td>
                            <Td px={2}>
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
                </Box>
                
                <Box display={{ base: "block", md: "none" }}>
                  {category.items.length > 0 ? (
                    <VStack spacing={2} align="stretch">
                      {category.items.map(item => (
                        <MobileItemRow 
                          key={item.id} 
                          item={item} 
                          category={category} 
                          onDelete={deleteItem} 
                          onUpdate={updateItem} 
                        />
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color={textColor} textAlign="center" py={2}>
                      No items added yet
                    </Text>
                  )}
                </Box>
  
                <Button 
                  leftIcon={<AddIcon />} 
                  size="sm" 
                  onClick={() => addItem(category.id)} 
                  width={{ base: "100%", md: "auto" }}
                  colorScheme="green"
                >
                  Add Item
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
  
      <Button 
        leftIcon={<AddIcon />} 
        mb={6} 
        size="sm" 
        onClick={addCategory} 
        colorScheme="green"
        width={{ base: "100%", md: "auto" }}
      >
        Add Category
      </Button>
  
      <Card mb={4} bg={cardBg} borderColor={cardBorderColor}>
        <CardBody p={{ base: 3, md: 4 }}>
          <Heading size="sm" mb={3} color={subheadingColor}>Bonus Points</Heading>
          <FormControl maxW={{ base: "100%", md: "160px" }}>
            <FormLabel fontSize="xs" mb={1} color={textColor}>Extra Percentage Points</FormLabel>
            <NumberInput 
              size="sm"
              value={bonusPoints}
              onChange={(val) => setBonusPoints(Number(val))}
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
  
      <Card bg={cardBg} borderColor={cardBorderColor} mb={6}>
        <CardBody p={{ base: 3, md: 4 }}>
          <Stack 
            direction={{ base: "column", md: "row" }} 
            justifyContent="space-between" 
            mb={3}
            spacing={2}
            align={{ base: "stretch", md: "center" }}
          >
            <Heading size="sm" color={subheadingColor}>Grading Scale</Heading>
            <Button 
              leftIcon={<AddIcon />} 
              size="sm" 
              onClick={addGradeToScale} 
              colorScheme="green"
              width={{ base: "100%", md: "auto" }}
            >
              Add Grade
            </Button>
          </Stack>
          
          <Box display={{ base: "none", md: "block" }}>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th px={2} color={tableHeaderColor}>Letter</Th>
                  <Th px={2} color={tableHeaderColor}>Min %</Th>
                  <Th px={2} color={tableHeaderColor}>GPA</Th>
                  <Th w="40px" px={2}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {gradingScale.map((grade, index) => (
                  <Tr key={index}>
                    <Td px={2}>
                      <Input 
                        size="sm"
                        value={grade.letter}
                        onChange={(e) => updateGradingScale(index, 'letter', e.target.value)}
                        bg={inputBg} 
                        borderColor={inputBorderColor}
                      />
                    </Td>
                    <Td px={2}>
                      <NumberInput 
                        size="sm"
                        value={grade.minPercentage}
                        onChange={(val) => updateGradingScale(index, 'minPercentage', val)}
                        min={0}
                        max={100}
                      >
                        <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                      </NumberInput>
                    </Td>
                    <Td px={2}>
                      <NumberInput 
                        size="sm"
                        value={grade.gpa}
                        onChange={(val) => updateGradingScale(index, 'gpa', val)}
                        step={0.1}
                        min={0}
                        max={4.0}
                        precision={1}
                      >
                        <NumberInputField bg={inputBg} borderColor={inputBorderColor} />
                      </NumberInput>
                    </Td>
                    <Td px={2}>
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
          </Box>
          
          <Box display={{ base: "block", md: "none" }}>
            <VStack spacing={2} align="stretch">
              {gradingScale.map((grade, index) => (
                <MobileGradeRow 
                  key={index} 
                  grade={grade} 
                  index={index} 
                  onUpdate={updateGradingScale} 
                  onDelete={deleteGradeFromScale} 
                />
              ))}
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Calculator;