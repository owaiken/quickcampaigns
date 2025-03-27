"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./SetupAdAccountPopup.css";

const SetupAdAccountPopup = ({ onClose, onComplete, activeAccount, setActiveAccount }) => {
  const [adAccounts] = useState([
    { id: "act_001", name: "Ad Account 1" },
    { id: "act_002", name: "Ad Account 2" },
    { id: "act_003", name: "Ad Account 3" },
  ]);
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [selectedAdAccountName, setSelectedAdAccountName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (id, name) => {
    setSelectedAdAccount(id);
    setSelectedAdAccountName(name);
    setDropdownOpen(false);
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
            <div className="dropdownContainer">
              <div className="customDropdown">
                <div className="dropdownHeader" onClick={toggleDropdown}>
                  {selectedAdAccountName ? selectedAdAccountName : "Select an ad account"}
                </div>
                {dropdownOpen && (
                  <div className="dropdownList">
                    {adAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="dropdownItem"
                        onClick={() => handleSelect(account.id, account.name)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAdAccount === account.id}
                          onChange={() => handleSelect(account.id, account.name)}
                        />
                        <span>{account.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="TheButtons">
            <button onClick={onClose} className="cancelButton">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="primaryButton"
              disabled={!selectedAdAccount}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAdAccountPopup;