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
  InputGroup, 
  InputRightElement, 
  Text, 
  useToast,
  VStack
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import apiClient from "../../../utils/apiClient";

const SignupPage = () => {
  const router = useRouter();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        error = value.trim() === "" ? "Name is required" : "";
        break;
      case "email":
        error = /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email";
        break;
      case "password":
        error = value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        error = value === formData.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check all fields before submission
    let hasErrors = false;
    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof typeof formData, formData[key as keyof typeof formData]);
      if (error) hasErrors = true;
    });

    if (!hasErrors) {
      setIsLoading(true);
      
      try {
        // Call the Django registration endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/'}auth/users/`, 
          {
            username: formData.name,
            email: formData.email,
            password: formData.password,
            re_password: formData.confirmPassword
          }
        );
        
        toast({
          title: "Registration successful",
          description: "Please check your email to activate your account.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Redirect to login page
        router.push("/accounts/login");
      } catch (error: any) {
        console.error("Registration error:", error);
        
        // Handle different error responses
        let errorMessage = "Registration failed. Please try again.";
        
        if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.email) {
            errorMessage = `Email error: ${errorData.email[0]}`;
          } else if (errorData.username) {
            errorMessage = `Username error: ${errorData.username[0]}`;
          } else if (errorData.password) {
            errorMessage = `Password error: ${errorData.password[0]}`;
          } else if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors[0];
          }
        }
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
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
        <VStack spacing={4} align="center" mb={6}>
          <Heading as="h1" size="lg">
            Complete Your Registration
          </Heading>
          <Text>Set your username and password to proceed.</Text>
        </VStack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {/* Name Input */}
            <FormControl isInvalid={!!errors.name}>
              <Input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                size="lg"
                required
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            {/* Email Input */}
            <FormControl isInvalid={!!errors.email}>
              <Input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                size="lg"
                required
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Password Input */}
            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  required
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            {/* Confirm Password Input */}
            <FormControl isInvalid={!!errors.confirmPassword}>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  required
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              mt={4}
              isLoading={isLoading}
              loadingText="Registering"
            >
              Finish
            </Button>
          </VStack>
        </form>

        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Link href="/accounts/login">
            <Text as="span" color="blue.500">
              Login
            </Text>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default SignupPage;
