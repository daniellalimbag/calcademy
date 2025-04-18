import { ChakraProvider, Box, Container, useColorModeValue } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Settings from './pages/Settings';
import theme from './theme';

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Header />
          <Container maxW="container.xl" py={8}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator/:subjectId" element={<Calculator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;