"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./FacebookConnectButton.module.css";

const FacebookConnectButton = ({ onConnected, className = '' }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  // Check if we're returning from Facebook OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('facebook_connected') === 'true') {
      toast.success("Your Facebook account has been successfully connected.");
      
      // Update connected status
      setIsConnected(true);
      if (onConnected) onConnected(true);
      
      // Check Facebook accounts
      checkFacebookAccounts();
      
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Check if user has connected Facebook accounts
  const checkFacebookAccounts = async () => {
    try {
      const response = await fetch("https://quickcampaigns.onrender.com/api/campaigns/auth/facebook/accounts/");
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.length > 0);
        if (onConnected) onConnected(data.length > 0);
      }
    } catch (error) {
      console.error("Error checking Facebook accounts:", error);
    }
  };

  // Connect Facebook account
  const connectFacebook = () => {
    setIsConnecting(true);
    // Use the full backend URL for the Facebook login endpoint
    const apiUrl = "https://quickcampaigns.onrender.com";
    window.location.href = `${apiUrl}/api/campaigns/auth/facebook/login/`;
  };

  // Check for connected accounts on mount
  useEffect(() => {
    checkFacebookAccounts();
  }, []);

  return (
    <button
      className={`${styles.facebookButton} ${className}`}
      onClick={connectFacebook}
      disabled={isConnecting}
    >
      <FaFacebook className={styles.facebookIcon} />
      {isConnecting ? "Connecting..." : (isConnected ? "Reconnect Facebook" : "Connect Facebook Ad Account")}
    </button>
  );
};

export default FacebookConnectButton;
