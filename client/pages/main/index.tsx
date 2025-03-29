import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import apiClient from "../../utils/apiClient";
import { campaignAPI } from "../../utils/api";

// Define campaign interface
interface Campaign {
  id: string;
  name: string;
  [key: string]: any; // Allow for additional properties
}

// Fallback mock data in case API fails
const mockCampaigns: Campaign[] = [
  { id: "1", name: "findproccesserror" },
  { id: "2", name: "LIVE APP" },
  { id: "3", name: "instagram screencast" },
];

const MainPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  
  const [selectedObjective, setSelectedObjective] = useState("website");
  const [campaignType, setCampaignType] = useState("new");
  const [existingCampaigns, setExistingCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [activeAccount, setActiveAccount] = useState({ id: "default", is_bound: false });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/accounts/login");
      return;
    }
    
    // Fetch user's campaigns from the API
    fetchUserCampaigns();
  }, [router]);
  
  const fetchUserCampaigns = async () => {
    try {
      const response = await campaignAPI.getCampaigns();
      if (response.data && Array.isArray(response.data)) {
        setExistingCampaigns(response.data);
      } else {
        // If API returns unexpected format, use mock data for demo
        console.warn('API returned unexpected format, using mock data');
        setExistingCampaigns(mockCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Use mock data as fallback
      setExistingCampaigns(mockCampaigns);
      
      toast({
        title: "Could not fetch campaigns",
        description: "Using demo data instead",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleObjectiveSelect = (objective: string) => {
    setSelectedObjective(objective);
    setSelectedCampaign("");
  };

  const handleCampaignTypeSelect = (type: string) => {
    setCampaignType(type);
  };

  const handleCampaignSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCampaign(event.target.value);
  };

  const handleNextClick = () => {
    // Store selected options in localStorage for use in the campaign form
    localStorage.setItem("campaignObjective", selectedObjective);
    localStorage.setItem("campaignType", campaignType);
    
    if (campaignType === "existing" && selectedCampaign) {
      localStorage.setItem("selectedCampaignId", selectedCampaign);
    }
    
    router.push("/campaign-form");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header/Navigation */}
      <Box bg="white" boxShadow="sm" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link href="/">
              <Image src="/assets/logo-header.png" alt="Logo" height="40px" />
            </Link>
            <Flex align="center">
              <Text mr={4}>Welcome, User</Text>
              <Button 
                colorScheme="red" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  router.push("/accounts/login");
                }}
              >
                Logout
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.lg" py={8}>
        <Box bg="white" borderRadius="md" boxShadow="md" p={8}>
          <Heading as="h2" size="lg" mb={6}>
            Choose Campaign Objective
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
            {/* Website Conversions */}
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              cursor="pointer"
              bg={selectedObjective === "website" ? "blue.50" : "white"}
              borderColor={selectedObjective === "website" ? "blue.500" : "gray.200"}
              onClick={() => handleObjectiveSelect("website")}
            >
              <Flex direction="column" align="center" mb={4}>
                <Image 
                  src="/assets/Website-Ad--Streamline-Atlas.png" 
                  alt="Website Conversions"
                  boxSize="50px"
                  mb={2}
                />
                <Heading size="md">Website Conversions</Heading>
              </Flex>
              <Text textAlign="center">
                Send people to your website and track conversions using the FB Pixel.
              </Text>
            </Box>
            
            {/* Lead Form Campaign */}
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              cursor="pointer"
              bg={selectedObjective === "lead" ? "blue.50" : "white"}
              borderColor={selectedObjective === "lead" ? "blue.500" : "gray.200"}
              onClick={() => handleObjectiveSelect("lead")}
            >
              <Flex direction="column" align="center" mb={4}>
                <Image 
                  src="/assets/Device-Tablet-Search--Streamline-Tabler.png" 
                  alt="Lead Form Campaign"
                  boxSize="50px"
                  mb={2}
                />
                <Heading size="md">Lead Form Campaign</Heading>
              </Flex>
              <Text textAlign="center">
                Capture leads using instant forms from your ad account.
              </Text>
            </Box>
            
            {/* Traffic Campaign */}
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              cursor="pointer"
              bg={selectedObjective === "traffic" ? "blue.50" : "white"}
              borderColor={selectedObjective === "traffic" ? "blue.500" : "gray.200"}
              onClick={() => handleObjectiveSelect("traffic")}
            >
              <Flex direction="column" align="center" mb={4}>
                <Image 
                  src="/assets/Click--Streamline-Tabler.png" 
                  alt="Traffic Campaign"
                  boxSize="50px"
                  mb={2}
                />
                <Heading size="md">Traffic Campaign</Heading>
              </Flex>
              <Text textAlign="center">
                Drive more visitors to your website through targeted traffic campaigns.
              </Text>
            </Box>
          </Grid>

          <Heading as="h2" size="lg" mb={6}>
            Configure Your Campaign
          </Heading>
          
          <RadioGroup onChange={handleCampaignTypeSelect} value={campaignType} mb={6}>
            <Stack direction={{ base: "column", md: "row" }} spacing={5}>
              <Radio value="new" colorScheme="blue" size="lg">
                <Flex align="center">
                  <Image src="/assets/Component 2.png" alt="New Campaign" boxSize="20px" mr={2} />
                  <Text fontWeight="medium">New Campaign</Text>
                </Flex>
              </Radio>
              <Radio value="existing" colorScheme="blue" size="lg">
                <Flex align="center">
                  <Image src="/assets/Component 2 (1).png" alt="Existing Campaign" boxSize="20px" mr={2} />
                  <Text fontWeight="medium">Existing Campaign</Text>
                </Flex>
              </Radio>
            </Stack>
          </RadioGroup>
          
          {campaignType === "existing" && (
            <Box mb={6}>
              <Select 
                placeholder="Select a campaign" 
                value={selectedCampaign}
                onChange={handleCampaignSelect}
                size="lg"
              >
                {existingCampaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </Select>
            </Box>
          )}
          
          <Button 
            colorScheme="blue" 
            size="lg" 
            width={{ base: "full", md: "auto" }}
            onClick={handleNextClick}
            isDisabled={campaignType === "existing" && !selectedCampaign}
          >
            Next
          </Button>
        </Box>
      </Container>

      {/* Setup Ad Account Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set Up Ad Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              To create campaigns, you need to connect your Facebook Ad Account.
            </Text>
            <Button 
              colorScheme="facebook" 
              leftIcon={<Image src="/assets/facebook-icon.png" alt="Facebook" boxSize="20px" />}
              width="full"
              mb={3}
              onClick={() => {
                // In a real implementation, this would initiate Facebook OAuth flow
                // For now, we'll simulate a successful connection
                setActiveAccount({ id: "fb_123456789", is_bound: true });
                toast({
                  title: "Facebook Account Connected",
                  description: "Your Facebook Ad Account has been successfully connected.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                // Store in localStorage to persist the connection
                localStorage.setItem('fb_account_connected', 'true');
                // Close the modal after showing the toast
                onClose();
              }}
            >
              Connect Facebook Ad Account
            </Button>
            <Text fontSize="sm" color="gray.500">
              We&apos;ll only request the permissions needed to create and manage your campaigns.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Skip for now
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MainPage;
