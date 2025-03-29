import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Box, Button, Checkbox, Flex, FormControl, FormErrorMessage, Heading, Input, InputGroup, InputRightElement, Text, useToast } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const LoginPage = () => {
    const router = useRouter();
    const toast = useToast();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Field validation function
    const validateField = (name: string, value: string) => {
        let error = "";

        switch (name) {
            case "email":
                if (!value) {
                    error = "Required";
                }
                // No longer validating email format since we accept username too
                break;
            case "password":
                if (!value) {
                    error = "Required";
                }
                // No longer enforcing minimum length since Django handles this
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

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Validate onBlur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(e.target.name, e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateField("email", formData.email);
        const passwordError = validateField("password", formData.password);

        if (!emailError && !passwordError) {
            setIsLoading(true);
            
            try {
                // Call the Django JWT auth endpoint
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
                const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}auth/jwt/create/` : `${baseUrl}/auth/jwt/create/`;
                
                const response = await axios.post(
                    apiUrl, 
                    {
                        username: formData.email,
                        password: formData.password
                    }
                );
                
                // Save tokens to localStorage
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                
                // Show success message
                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                
                // Redirect to main page
                router.push("/main");
            } catch (error) {
                console.error("Login error:", error);
                
                // Show error message
                toast({
                    title: "Login failed",
                    description: "Invalid email or password. Please try again.",
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
                <Heading as="h1" size="lg" textAlign="center" mb={6}>
                    Login
                </Heading>

                <form onSubmit={handleSubmit}>
                    <FormControl isInvalid={!!errors.email} mb={4}>
                        <Input
                            type="text"
                            name="email"
                            placeholder="Username or Email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            size="lg"
                            required
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password} mb={4}>
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

                    <Flex align="center" justify="center" mb={4}>
                        <Checkbox
                            name="rememberMe"
                            isChecked={formData.rememberMe}
                            onChange={handleChange as any}
                            mr={2}
                        />
                        <Text>Remember me</Text>
                    </Flex>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Signing In"
                        mb={4}
                    >
                        Sign In
                    </Button>
                </form>

                <Text textAlign="center">
                    <Link href="/accounts/password_reset">
                        <Text as="span" color="blue.500">
                            Forgot your password?
                        </Text>
                    </Link>
                </Text>
            </Box>
        </Flex>
    );
};

export default LoginPage;
