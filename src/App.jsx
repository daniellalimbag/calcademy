import { ChakraProvider, Box, Container, useColorMode } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Settings from './pages/Settings';
import theme from './theme';

function AppContent() {
  const { colorMode } = useColorMode();
  
  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      <Header />
      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculator/:subjectId" element={<Calculator />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ChakraProvider>
  );
}

export default App;