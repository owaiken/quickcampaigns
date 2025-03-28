import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { 
  Box, 
  Button, 
  Flex, 
  FormControl, 
  FormErrorMessage, 
  Heading, 
  Input, 
  Text, 
  useToast,
  VStack
} from "@chakra-ui/react";

const PasswordResetPage = () => {
  const router = useRouter();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate email
  const validateEmail = (email: string) => {
    if (!email) {
      return "Required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    setError(emailError);

    if (!emailError) {
      setIsLoading(true);
      
      try {
        // Call the Django password reset endpoint
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/'}auth/users/reset_password/`, 
          {
            email: formData.email
          }
        );
        
        setIsSubmitted(true);
        
        toast({
          title: "Reset link sent",
          description: "If an account exists with this email, you will receive a password reset link.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Password reset error:", error);
        
        // We don't show specific errors for security reasons
        toast({
          title: "Request processed",
          description: "If an account exists with this email, you will receive a password reset link.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        
        setIsSubmitted(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      minH="100vh" 
      bg="gray.50"
      p={4}
    >
      <Link href="/">
        <Box as="img" src="/assets/logo-header.png" alt="Logo" maxW="200px" mb={8} />
      </Link>

      <Box 
        bg="white" 
        p={8} 
        borderRadius="md" 
        boxShadow="md" 
        w={["95%", "80%", "450px"]}
      >
        <VStack spacing={6} align="center">
          <Heading as="h1" size="lg">
            Reset Password
          </Heading>
          
          {isSubmitted ? (
            <VStack spacing={4}>
              <Text textAlign="center">
                If an account exists with the email {formData.email}, you will receive a password reset link.
              </Text>
              <Text textAlign="center">
                Please check your email and follow the instructions to reset your password.
              </Text>
              <Button 
                as={Link} 
                href="/accounts/login"
                colorScheme="blue" 
                size="lg" 
                width="full"
                mt={4}
              >
                Back to Login
              </Button>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} width="100%">
                <FormControl isInvalid={!!error}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  mt={4}
                  isLoading={isLoading}
                  loadingText="Sending"
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>
          )}
          
          {!isSubmitted && (
            <Text mt={4} textAlign="center">
              <Link href="/accounts/login">
                <Text as="span" color="blue.500">
                  Back to Login
                </Text>
              </Link>
            </Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default PasswordResetPage;
