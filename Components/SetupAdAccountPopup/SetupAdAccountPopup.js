"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./SetupAdAccountPopup.css";
import { FaFacebook } from "react-icons/fa";

const SetupAdAccountPopup = ({ onClose, onComplete, activeAccount, setActiveAccount }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [selectedAdAccountName, setSelectedAdAccountName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const popupRef = useRef(null);

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  // Check if user has connected Facebook accounts
  useEffect(() => {
    const checkFacebookAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://quickcampaigns.onrender.com/api/auth/facebook/accounts/");
        if (response.ok) {
          const data = await response.json();
          setAdAccounts(data);
          setIsConnected(data.length > 0);
          
          // If there's an active account, select it
          if (activeAccount) {
            const account = data.find(acc => acc.account_id === activeAccount);
            if (account) {
              setSelectedAdAccount(account.account_id);
              setSelectedAdAccountName(account.name);
            }
          } else if (data.length > 0) {
            // Select the first account by default
            setSelectedAdAccount(data[0].account_id);
            setSelectedAdAccountName(data[0].name);
          }
        }
      } catch (error) {
        console.error("Error checking Facebook accounts:", error);
        toast.error("Failed to fetch Facebook ad accounts");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkFacebookAccounts();
  }, [activeAccount]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (id, name) => {
    setSelectedAdAccount(id);
    setSelectedAdAccountName(name);
    setDropdownOpen(false);
  };

  // Connect Facebook account
  const connectFacebook = () => {
    setIsConnecting(true);
    // Use the full backend URL for the Facebook login endpoint
    const apiUrl = "https://quickcampaigns.onrender.com";
    window.location.href = `${apiUrl}/api/auth/facebook/login/`;
  };

  const handleSubmit = () => {
    if (!selectedAdAccount) {
      toast.error("Please select an ad account.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setActiveAccount({
      ...activeAccount,
      ad_account_id: selectedAdAccount,
      is_bound: true,
    });

    toast.success("Ad account set up successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    onComplete();
  };

  return (
    <div className="popupOverlay">
      <div className="popupContent" ref={popupRef}>
        <div className="leftSide">
          <h3>
            “QuickCampaigns Makes It Incredibly Easy To Create Multiple Campaigns With Just One Click, Saving You Countless Hours Of Work.”
          </h3>
        </div>
        <div className="rightSide">
          <div className="stepContent active2">
            <h3>Which Ad Account Will You Be Using?</h3>
            <p>You'll be able to create and manage campaigns with this ad account.</p>
            
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : !isConnected ? (
              <div className="facebook-connect-container">
                <p>Connect your Facebook ad account to proceed:</p>
                <button 
                  className="facebook-connect-button"
                  onClick={connectFacebook}
                  disabled={isConnecting}
                >
                  <FaFacebook className="facebook-icon" />
                  {isConnecting ? "Connecting..." : "Connect Facebook Ad Account"}
                </button>
              </div>
            ) : (
              <div className="dropdownContainer">
                <div className="customDropdown">
                  <div className="dropdownHeader" onClick={toggleDropdown}>
                    {selectedAdAccountName ? selectedAdAccountName : "Select an ad account"}
                  </div>
                  {dropdownOpen && (
                    <div className="dropdownList">
                      {adAccounts.map((account) => (
                        <div
                          key={account.account_id}
                          className="dropdownItem"
                          onClick={() => handleSelect(account.account_id, account.name)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAdAccount === account.account_id}
                            onChange={() => handleSelect(account.account_id, account.name)}
                          />
                          <span>{account.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="TheButtons">
            <button onClick={onClose} className="cancelButton">
              Cancel
            </button>
            {isConnected && (
              <button
                onClick={handleSubmit}
                className="primaryButton"
                disabled={!selectedAdAccount}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAdAccountPopup;