import React, { useState, useEffect } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/router";
import apiClient from "../utils/apiClient";

const FacebookConnectButton = ({ onConnected, className = '' }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Check if we're returning from Facebook OAuth
  useEffect(() => {
    if (router.query.facebook_connected === "true") {
      toast({
        title: "Facebook Connected",
        description: "Your Facebook account has been successfully connected.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Remove the query parameter
      const { facebook_connected, ...query } = router.query;
      router.replace({ pathname: router.pathname, query });
      
      // Update connected status
      setIsConnected(true);
      if (onConnected) onConnected(true);
      
      // Check Facebook accounts
      checkFacebookAccounts();
    }
  }, [router.query]);

  // Check if user has connected Facebook accounts
  const checkFacebookAccounts = async () => {
    try {
      const response = await apiClient.get("/api/campaigns/auth/facebook/accounts/");
      setIsConnected(response.data.length > 0);
      if (onConnected) onConnected(response.data.length > 0);
    } catch (error) {
      console.error("Error checking Facebook accounts:", error);
    }
  };

  // Connect Facebook account
  const connectFacebook = () => {
    setIsConnecting(true);
    // Use the full backend URL for the Facebook login endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiUrl}/api/campaigns/auth/facebook/login/`;
  };

  // Check for connected accounts on mount
  useEffect(() => {
    checkFacebookAccounts();
  }, []);

  return (
    <Button
      leftIcon={<FaFacebook />}
      colorScheme="facebook"
      onClick={connectFacebook}
      isLoading={isConnecting}
      loadingText="Connecting..."
      className={className}
    >
      {isConnected ? "Reconnect Facebook" : "Connect Facebook Ad Account"}
    </Button>
  );
};

export default FacebookConnectButton;
