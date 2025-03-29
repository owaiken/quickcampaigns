import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  useToast,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';

const CreditPurchasePage = () => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(0);
  const cardBg = useColorModeValue('white', 'gray.700');
  const highlightColor = useColorModeValue('purple.500', 'purple.300');

  // Credit package options
  const creditPackages = [
    { id: 'basic', name: 'Basic', credits: 100, price: 9.99, popular: false },
    { id: 'pro', name: 'Professional', credits: 500, price: 39.99, popular: true },
    { id: 'enterprise', name: 'Enterprise', credits: 2000, price: 149.99, popular: false },
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/accounts/login');
      return;
    }

    // Fetch current credits
    fetchCurrentCredits();
  }, []);

  const fetchCurrentCredits = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
      const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}api/credits/` : `${baseUrl}/api/credits/`;
      
      const token = localStorage.getItem('access_token');
      
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.balance) {
        setCurrentCredits(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      // For demo, set a default value
      setCurrentCredits(50);
    }
  };

  const handlePurchase = async (packageId: string) => {
    setIsLoading(true);
    
    try {
      const selectedPackage = creditPackages.find(pkg => pkg.id === packageId);
      if (!selectedPackage) return;
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
      const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}api/credits/purchase/` : `${baseUrl}/api/credits/purchase/`;
      
      const token = localStorage.getItem('access_token');
      
      const response = await axios.post(
        apiUrl, 
        { amount: selectedPackage.credits },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update current credits
      if (response.data && response.data.balance) {
        setCurrentCredits(response.data.balance);
      }
      
      toast({
        title: 'Purchase Successful',
        description: `You've added ${selectedPackage.credits} credits to your account!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>Purchase Credits</Heading>
          <Text fontSize="lg" color="gray.500">
            Power your campaigns with QuickCampaigns credits
          </Text>
        </Box>
        
        <Box bg="blue.50" p={4} borderRadius="md">
          <HStack>
            <Text fontWeight="bold">Current Balance:</Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">{currentCredits} Credits</Text>
          </HStack>
        </Box>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} pt={4}>
          {creditPackages.map((pkg) => (
            <Box 
              key={pkg.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={6}
              bg={cardBg}
              boxShadow="md"
              position="relative"
              borderColor={pkg.popular ? highlightColor : 'gray.200'}
            >
              {pkg.popular && (
                <Badge 
                  colorScheme="purple" 
                  position="absolute" 
                  top={2} 
                  right={2}
                >
                  Most Popular
                </Badge>
              )}
              
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="lg">{pkg.name}</Heading>
                <HStack>
                  <Text fontSize="3xl" fontWeight="bold">${pkg.price}</Text>
                  <Text color="gray.500">one-time</Text>
                </HStack>
                <Text fontSize="xl" fontWeight="medium" color="blue.500">
                  {pkg.credits} Credits
                </Text>
                <Text color="gray.500">
                  Perfect for {pkg.id === 'basic' ? 'small businesses' : pkg.id === 'pro' ? 'growing teams' : 'large organizations'}
                </Text>
                <Button 
                  colorScheme={pkg.popular ? 'purple' : 'blue'} 
                  size="lg" 
                  mt={4}
                  isLoading={isLoading}
                  onClick={() => handlePurchase(pkg.id)}
                >
                  Purchase Now
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
        
        <Box bg="gray.50" p={6} borderRadius="md" mt={8}>
          <Heading as="h3" size="md" mb={4}>How Credits Work</Heading>
          <Text>
            Credits are used to power your campaigns on QuickCampaigns. Each campaign you create will consume a certain number of credits based on its duration and reach. Purchase the package that best fits your marketing needs.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreditPurchasePage;
