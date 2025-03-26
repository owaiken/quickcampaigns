"use client";

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import dynamic from 'next/dynamic';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/Components/CampaignFormComp/CampaignForm.module.css";
import Header from "@/Components/Header/Header";
import Link from "next/link";
import "/public/Styles/side-menu.css";
import "/public/Styles/style.css";
import "/public/Styles/home.css";
import Image from "next/image";

const ConfigForm = dynamic(
  () => import("@/Components/CampaignFormComp/CampaignFormComp"),
  { ssr: false }
);

const CampaignForm = ({
  formId,
  onSubmit,
  initialConfig = {},
  isNewCampaign,
  onGoBack,
  activeAccount,
  campaignId: initialCampaignId,
  objective,
}) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignId, setCampaignId] = useState(initialCampaignId || "");
  const [savedConfig, setSavedConfig] = useState(initialConfig);
  const [expandedSections, setExpandedSections] = useState({
    creativeUploading: true,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleSaveConfig = () => {
    toast.success("Configuration saved locally");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (uploadedFiles.length === 0) {
      toast.error("Please Upload Your Creatives.");
      if (fileInputRef.current) {
        window.scrollBy({ top: -2900, left: 0, behavior: "smooth" });
      } else {
        toggleSection("creativeUploading");
      }
      return;
    }

    const formData = new FormData(event.target);
    if (isNewCampaign) {
      formData.append("campaign_name", campaignName);
    } else {
      formData.append("campaign_id", campaignId);
    }
    formData.append("objective", objective);

    for (const [key, value] of Object.entries(savedConfig)) {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }

    onSubmit(formData, isNewCampaign);
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const MAX_SIZE = 10 * 1024 * 1024 * 1024;

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_SIZE) {
      toast.error("The total file upload size exceeds 10GB. Please select smaller files.");
      return;
    }

    setUploadedFiles(files);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <Link href="/main">
            <Image
              src="/assets/Vector4.png"
              alt="Go Back"
              width={24}
              height={24}
              className={styles.goBackIcon}
              onClick={onGoBack}
            />
          </Link>
        </div>
        <h2 className={styles.title}>Choose Your Launch Setting</h2>
        <p className={styles.subtitle}>
          Fill In The Required Fields To Generate And Launch Your Meta Ads
        </p>

        <div className={styles.tutorialVideo}>
          <video
            src="https://quickcampaignvideos.s3.us-east-1.amazonaws.com/how-to-video.mp4"
            playsInline
            controls
            poster="/assets/poster1.jpg"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <form id={formId} onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.formSectionsContainer}>
            <div className={styles.sectionBox}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleSection("creativeUploading")}
              >
                <h3>
                  Creative Uploading{" "}
                  {uploadedFiles.length > 0 &&
                    `(${uploadedFiles.length} files uploaded)`}
                </h3>
                <Image
                  src="/assets/Vectorw.svg"
                  alt="Toggle Section"
                  width={16}
                  height={16}
                  className={`${styles.toggleIcon} ${
                    expandedSections.creativeUploading ? styles.expanded : ""
                  }`}
                />
              </div>
              {expandedSections.creativeUploading && (
                <div className={styles.sectionContent}>
                  <div
                    className={styles.uploadBox}
                    onClick={handleFileUploadClick}
                  >
                    <Image
                      src="/assets/Vector6.png"
                      alt="Upload Icon"
                      width={24}
                      height={24}
                      className={styles.uploadIcon}
                    />
                    <p>Click to upload or drag and drop</p>
                  </div>
                  <input
                    type="file"
                    id="uploadFolders"
                    name="uploadFolders"
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    className={styles.hiddenFileInput}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
            <hr className={styles.sectionDivider} />

            <ConfigForm
              initialConfig={initialConfig}
              onSaveConfig={setSavedConfig}
              activeAccount={activeAccount}
              campaignName={campaignName}
              setCampaignName={setCampaignName}
              objective={objective}
              campaignId={campaignId}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.createAdButton}>
              {isNewCampaign ? "Create Campaign" : "Create Ad Set"}
            </button>
            <button
              type="button"
              className={styles.goBackButton}
              onClick={onGoBack}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveConfig}
              className={styles.createAdButton}
            >
              Save Current Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CampaignForm.propTypes = {
  formId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialConfig: PropTypes.object,
  isNewCampaign: PropTypes.bool.isRequired,
  onGoBack: PropTypes.func.isRequired,
  activeAccount: PropTypes.object.isRequired,
  campaignId: PropTypes.string,
  objective: PropTypes.string.isRequired,
};

export default CampaignForm;