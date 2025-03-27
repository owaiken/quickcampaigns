"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./MainStyles.module.css"; 
import NavBar from "@/Components/NavBar/NavBar";
import StickySide from "@/Components/StickySide/StickySide";
import '/public/Styles/fonts.css'

const Page = ({ activeAccount, setActiveAccount }) => {
  const [selectedObjective, setSelectedObjective] = useState("website");
  const [campaignType, setCampaignType] = useState("new");
  const [existingCampaigns, setExistingCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleObjectiveSelect = (objective) => {
    setSelectedObjective(objective);
    setSelectedCampaign("");
  };

  const handleCampaignTypeSelect = (type) => {
    setCampaignType(type);
    if (type === "existing") {
      const mockCampaigns = [
        { id: "1", name: "findproccesserror" },
        { id: "2", name: "LIVE APP" },
        { id: "3", name: "instagram screencast" },
      ];
      setExistingCampaigns(mockCampaigns);
    } else {
      setExistingCampaigns([]);
    }
  };

  const handleCampaignSelect = (event) => {
    setSelectedCampaign(event.target.value);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (campaignType === "existing") {
      handleCampaignTypeSelect("existing");
    }
  }, [selectedObjective]);

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.mainContent}>
        <StickySide />
        <div className={styles.formContainer}>
          <h2 className={styles.heading}>Choose Campaign Objective</h2>
          <div className={styles.objectiveContainer}>
            <div
              className={`${styles.objective} ${
                selectedObjective === "website" ? styles.selected : ""
              }`}
              onClick={() => handleObjectiveSelect("website")}
            >
              <div className={styles.icon}>
                <img
                  src="/assets/Website-Ad--Streamline-Atlas.png"
                  alt="Website Conversions"
                />
              </div>
              <div className={styles.content}>
                <h3>Website Conversions</h3>
                <p>
                  Send people to your website and track conversions using the FB Pixel.
                </p>
              </div>
            </div>
            {/* Other objective divs remain the same */}
            <div
              className={`${styles.objective} ${
                selectedObjective === "lead" ? styles.selected : ""
              }`}
              onClick={() => handleObjectiveSelect("lead")}
            >
              <div className={styles.icon}>
                <img
                  src="/assets/Device-Tablet-Search--Streamline-Tabler.png"
                  alt="Lead Form Campaign"
                />
              </div>
              <div className={styles.content}>
                <h3>Lead Form Campaign</h3>
                <p>Capture leads using instant forms from your ad account.</p>
              </div>
            </div>
            <div
              className={`${styles.objective} ${
                selectedObjective === "traffic" ? styles.selected : ""
              }`}
              onClick={() => handleObjectiveSelect("traffic")}
            >
              <div className={styles.icon}>
                <img
                  src="/assets/Click--Streamline-Tabler.png"
                  alt="Traffic Campaign"
                />
              </div>
              <div className={styles.content}>
                <h3>Traffic Campaign</h3>
                <p>Drive more visitors to your website through targeted traffic campaigns.</p>
              </div>
            </div>
          </div>

          <h2 className={styles.heading}>Configure Your Campaign</h2>
          <div className={styles.campaignTypeContainer}>
            <button
              className={`${styles.campaignTypeButton} ${
                campaignType === "new" ? styles.selected : ""
              }`}
              onClick={() => handleCampaignTypeSelect("new")}
            >
              <img
                className={styles.buttonIcon}
                src="/assets/Component 2.png"
                alt="New Campaign"
              />
              New Campaign
            </button>
            <button
              className={`${styles.campaignTypeButton} ${
                campaignType === "existing" ? styles.selected : ""
              }`}
              onClick={() => handleCampaignTypeSelect("existing")}
            >
              <img
                className={styles.buttonIcon}
                src="/assets/Component 2 (1).png"
                alt="Existing Campaign"
              />
              Existing Campaign
            </button>
          </div>

          {campaignType === "existing" && existingCampaigns.length > 0 && (
            <div className={styles.dropdownContainer}>
              <label htmlFor="campaignSelect"></label>
              <div className={styles.customDropdown}>
                <div
                  className={styles.dropdownHeader}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedCampaign
                    ? existingCampaigns.find(
                        (campaign) => campaign.id === selectedCampaign
                      ).name
                    : "Select a campaign"}
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdownList}>
                    {existingCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className={styles.dropdownItem}
                        onClick={() =>
                          handleCampaignSelect({
                            target: { value: campaign.id },
                          })
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedCampaign === campaign.id}
                          onChange={() =>
                            handleCampaignSelect({
                              target: { value: campaign.id },
                            })
                          }
                        />
                        <span>{campaign.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <Link href="/campaign-form">
            <button className={styles.nextButton}>Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;