import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  Divider,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import apiClient from '../../utils/apiClient';

const CreditPurchasePage = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(0);
  interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    popular: boolean;
    description: string;
  }

  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const cardBg = 'white';
  const highlightColor = '#4299E1'; // blue.500 to match your app's color scheme

  // Credit package options
  const creditPackages = [
    { id: 'basic', name: 'Starter', credits: 100, price: 9.99, popular: false, description: 'Perfect for small businesses just getting started with digital marketing.' },
    { id: 'pro', name: 'Professional', credits: 500, price: 39.99, popular: true, description: 'Ideal for growing businesses with regular campaign needs.' },
    { id: 'enterprise', name: 'Enterprise', credits: 2000, price: 149.99, popular: false, description: 'Best value for agencies and businesses with extensive marketing requirements.' },
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
      // For demo purposes, we'll use a simulated response
      // In a real implementation, you would use apiClient:
      /*
      const response = await apiClient.get('api/credits/');
      if (response.data && response.data.balance) {
        setCurrentCredits(response.data.balance);
      }
      */
      
      // Simulate a response for the demo
      setCurrentCredits(50);
    } catch (error) {
      console.error('Error fetching credits:', error);
      // For demo, set a default value
      setCurrentCredits(50);
    }
  };

  const openPurchaseModal = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    onOpen();
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate a successful API call
      setTimeout(() => {
        // Update current credits
        if (selectedPackage) {
          setCurrentCredits(prev => prev + selectedPackage.credits);
          
          toast({
            title: 'Purchase Successful',
            description: `You've added ${selectedPackage.credits} credits to your account!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
        
        onClose();
        setIsLoading(false);
      }, 1500);
      
      // In a real implementation, you would call the API:
      /*
      const response = await apiClient.post(
        'api/credits/purchase/', 
        { amount: selectedPackage.credits }
      );
      
      if (response.data && response.data.balance) {
        setCurrentCredits(response.data.balance);
      }
      */
      
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#f9f9f9">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading as="h1" size="xl" color="#333" fontWeight="bold">Purchase Credits</Heading>
              <Text fontSize="md" color="gray.600" mt={1}>
                Power your campaigns with QuickCampaigns credits
              </Text>
            </Box>
            <Link href="/main">
              <Button colorScheme="gray" size="md">Back to Dashboard</Button>
            </Link>
          </Flex>
          
          <Divider my={2} />
          
          <Box bg="blue.50" p={4} borderRadius="md" boxShadow="sm">
            <HStack>
              <Text fontWeight="bold">Current Balance:</Text>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">{currentCredits} Credits</Text>
            </HStack>
          </Box>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} pt={4}>
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
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg'
                }}
              >
                {pkg.popular && (
                  <Badge 
                    bg="blue.500"
                    color="white" 
                    position="absolute" 
                    top={2} 
                    right={2}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    Most Popular
                  </Badge>
                )}
                
                <VStack spacing={4} align="stretch">
                  <Heading as="h3" size="lg" color="#333">{pkg.name}</Heading>
                  <HStack>
                    <Text fontSize="3xl" fontWeight="bold" color="#333">${pkg.price}</Text>
                    <Text color="gray.500">one-time</Text>
                  </HStack>
                  <Text fontSize="xl" fontWeight="medium" color="blue.500">
                    {pkg.credits} Credits
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {pkg.description}
                  </Text>
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    mt={4}
                    onClick={() => openPurchaseModal(pkg)}
                    w="full"
                  >
                    Purchase Now
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          
          <Box bg="white" p={6} borderRadius="md" mt={8} boxShadow="sm">
            <Heading as="h3" size="md" mb={4} color="#333">How Credits Work</Heading>
            <Text color="gray.600">
              Credits are used to power your campaigns on QuickCampaigns. Each campaign you create will consume a certain number of credits based on its duration and reach. Purchase the package that best fits your marketing needs.
            </Text>
            <HStack mt={4} spacing={4}>
              <Box p={4} bg="gray.50" borderRadius="md" flex="1">
                <Heading as="h4" size="sm" mb={2} color="#333">Campaign Creation</Heading>
                <Text fontSize="sm" color="gray.600">Creating a new campaign uses 5-10 credits depending on complexity.</Text>
              </Box>
              <Box p={4} bg="gray.50" borderRadius="md" flex="1">
                <Heading as="h4" size="sm" mb={2} color="#333">Campaign Duration</Heading>
                <Text fontSize="sm" color="gray.600">Longer campaigns require more credits to maintain.</Text>
              </Box>
              <Box p={4} bg="gray.50" borderRadius="md" flex="1">
                <Heading as="h4" size="sm" mb={2} color="#333">Audience Reach</Heading>
                <Text fontSize="sm" color="gray.600">Targeting larger audiences consumes more credits.</Text>
              </Box>
            </HStack>
          </Box>
        </VStack>
        
        {/* Purchase Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Purchase</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedPackage && (
                <>
                  <Text>You are about to purchase:</Text>
                  <Box p={4} bg="gray.50" borderRadius="md" my={4}>
                    <Heading as="h4" size="md">{selectedPackage.name} Package</Heading>
                    <Text fontWeight="bold" fontSize="xl" mt={2}>${selectedPackage.price}</Text>
                    <Text mt={1}>{selectedPackage.credits} Credits</Text>
                  </Box>
                  <Text fontWeight="medium">Payment Method:</Text>
                  <Flex align="center" p={3} border="1px" borderColor="gray.200" borderRadius="md" mt={2}>
                    <Image src="/assets/credit-card-icon.png" alt="Credit Card" fallbackSrc="https://via.placeholder.com/30" boxSize="30px" mr={3} />
                    <Text>•••• •••• •••• 4242</Text>
                  </Flex>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>Cancel</Button>
              <Button colorScheme="blue" onClick={handlePurchase} isLoading={isLoading}>
                Complete Purchase
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default CreditPurchasePage;
