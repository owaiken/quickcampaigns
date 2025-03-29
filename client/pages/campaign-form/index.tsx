import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { toast as reactToast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../utils/apiClient";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Textarea,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Grid,
  GridItem,
  VStack,
  HStack,
  Icon
} from "@chakra-ui/react";

// Import components dynamically to avoid SSR issues
const NavBar = dynamic(() => import("../../components/NavBar/NavBar"), { ssr: false });

// Create a simplified campaign form page that works with our API
const CampaignFormPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("WEBSITE_CONVERSIONS");
  const [campaignType, setCampaignType] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/accounts/login");
    }
  }, [router]);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/accounts/login");
      return;
    }
    
    // Get campaign settings from localStorage
    const storedObjective = localStorage.getItem("campaignObjective");
    const storedType = localStorage.getItem("campaignType");
    
    if (storedObjective) {
      setCampaignObjective(storedObjective);
    }
    
    if (storedType) {
      setCampaignType(storedType);
    }
  }, [router]);
  
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    const files = Array.from(event.target.files);
    const MAX_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
    
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_SIZE) {
      toast({
        title: "File size exceeded",
        description: "The total file upload size exceeds 10GB. Please select smaller files.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setUploadedFiles(files);
    
    toast({
      title: "Files uploaded",
      description: `${files.length} files have been selected.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleSaveConfig = () => {
    toast({
      title: "Configuration saved",
      description: "Your campaign settings have been saved locally.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "No creatives uploaded",
        description: "Please upload your creative files before creating a campaign.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    if (!campaignName) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real implementation, you would send the form data to your API
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Campaign created",
        description: "Your campaign has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect back to the main page instead of a non-existent loading page
      router.push("/main");
    }, 2000);
  };
  
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header/Navigation */}
      <Box bg="white" boxShadow="sm" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link href="/">
              <Box as="img" src="/assets/logo-header.png" alt="Logo" height="40px" />
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
          <Flex align="center" mb={6}>
            <Link href="/main">
              <Button variant="ghost">
                Back
              </Button>
            </Link>
            <Heading as="h1" size="lg" ml={4}>
              Choose Your Launch Setting
            </Heading>
          </Flex>
          
          <Text fontSize="md" color="gray.600" mb={8}>
            Fill in the required fields to generate and launch your Meta Ads
          </Text>
          
          {/* Tutorial Video */}
          <Box mb={8} borderRadius="md" overflow="hidden">
            <Box
              as="video"
              controls
              poster="/assets/poster1.jpg"
              width="100%"
              maxHeight="400px"
              src="https://quickcampaignvideos.s3.us-east-1.amazonaws.com/how-to-video.mp4"
            />
          </Box>
          
          <form id="campaignForm" onSubmit={handleSubmit}>
            <Accordion allowToggle defaultIndex={[0]} mb={8}>
              {/* Creative Upload Section */}
              <AccordionItem>
                <Box as="h2">
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Creative Uploading {uploadedFiles.length > 0 && `(${uploadedFiles.length} files uploaded)`}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Box>
                <AccordionPanel pb={4}>
                  <Box 
                    border="2px dashed" 
                    borderColor="gray.300" 
                    borderRadius="md" 
                    p={10} 
                    textAlign="center"
                    cursor="pointer"
                    onClick={handleFileUploadClick}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Box 
                      as="img"
                      src="/assets/Vector6.png" 
                      alt="Upload" 
                      width="48px" 
                      height="48px" 
                      margin="0 auto" 
                      mb={4} 
                    />
                    <Text>Click to upload or drag and drop</Text>
                    <Input
                      type="file"
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              
              <Divider my={4} />
              
              {/* Campaign Settings */}
              <AccordionItem>
                <Box as="h2">
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Campaign Settings
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Box>
                <AccordionPanel pb={4}>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Campaign Name</FormLabel>
                      <Input 
                        placeholder="Enter campaign name" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Daily Budget</FormLabel>
                      <Input 
                        type="number" 
                        placeholder="Enter budget amount" 
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </FormControl>
                    
                    <HStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Start Date</FormLabel>
                        <Input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <Input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </FormControl>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              
              <Divider my={4} />
              
              {/* Audience Targeting */}
              <AccordionItem>
                <Box as="h2">
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Audience Targeting
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Box>
                <AccordionPanel pb={4}>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Target Audience</FormLabel>
                      <Select 
                        placeholder="Select target audience" 
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      >
                        <option value="new">New Audience</option>
                        <option value="saved">Saved Audience</option>
                        <option value="custom">Custom Audience</option>
                        <option value="lookalike">Lookalike Audience</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Audience Details</FormLabel>
                      <Textarea 
                        placeholder="Describe your target audience" 
                        rows={4}
                      />
                    </FormControl>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            
            <HStack spacing={4} justify="center" mt={8}>
              <Button 
                type="button" 
                colorScheme="blue" 
                size="lg" 
                isLoading={isLoading}
                loadingText="Creating Campaign"
                onClick={(e) => {
                  // Explicitly call the handleSubmit function
                  handleSubmit(e);
                }}
              >
                Create Campaign
              </Button>
              
              <Link href="/main">
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  Cancel
                </Button>
              </Link>
              
              <Button 
                colorScheme="green" 
                size="lg"
                onClick={handleSaveConfig}
              >
                Save Current Settings
              </Button>
            </HStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default CampaignFormPage;
