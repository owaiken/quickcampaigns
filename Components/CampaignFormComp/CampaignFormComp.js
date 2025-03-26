// app/components/ConfigForm.jsx
"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ConfigForm.module.css";
import Slider from "@mui/material/Slider";
import Select from "react-select";
import Image from "next/image";

const objectiveEventMapping = {
  OUTCOME_SALES: [
    "PURCHASE",
    "ADD_TO_CART",
    "INITIATED_CHECKOUT",
    "ADD_PAYMENT_INFO",
    "ADD_TO_WISHLIST",
    "COMPLETE_REGISTRATION",
    "DONATE",
    "SEARCH",
    "START_TRIAL",
    "SUBSCRIBE",
    "VIEW_CONTENT",
    "OTHER",
  ],
  OUTCOME_LEADS: [
    "LEAD",
    "COMPLETE_REGISTRATION",
    "CONTACT",
    "FIND_LOCATION",
    "SCHEDULE",
    "START_TRIAL",
    "SUBMIT_APPLICATION",
    "SUBSCRIBE",
    "OTHER",
  ],
  OUTCOME_TRAFFIC: ["LEAD", "CONTENT_VIEW", "AD_IMPRESSION", "SEARCH", "OTHER"],
};

const attributionSettings = [
  { label: "1-day click", value: "1d_click" },
  { label: "7-day click", value: "7d_click" },
  { label: "1-day view", value: "1d_view" },
  { label: "7-day view", value: "7d_view" },
];

const formatGoalForUI = (goal) => {
  return goal
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  return startTime.toISOString().slice(0, 19);
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2);
  endTime.setUTCHours(4, 0, 0, 0);
  return endTime.toISOString().slice(0, 19);
};

const ConfigForm = ({
  onSaveConfig,
  initialConfig,
  activeAccount,
  campaignName,
  setCampaignName,
  campaignId,
  objective,
}) => {
  const [isCBO, setIsCBO] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [filteredEventTypes, setFilteredEventTypes] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    budgetSchedule: true,
    assets: true,
    placements: true,
    targetingDelivery: true,
    campaignTracking: true,
  });

  const [config, setConfig] = useState({
    app_events: getDefaultStartTime(),
    ad_creative_primary_text: "",
    ad_creative_headline: "",
    ad_creative_description: "",
    call_to_action: "SHOP_NOW",
    link: "",
    url_parameters: "",
    display_link: initialConfig.display_link || "",
    destination_url: initialConfig.destination_url || "",
    campaign_budget_optimization: initialConfig.campaign_budget_optimization || "DAILY_BUDGET",
    ad_set_budget_optimization: initialConfig.ad_set_budget_optimization || "DAILY_BUDGET",
    ad_set_budget_value: initialConfig.ad_set_budget_value || initialConfig.budget_value || "50.00",
    ad_set_bid_strategy: initialConfig.ad_set_bid_strategy || "LOWEST_COST_WITHOUT_CAP",
    campaign_budget_value: initialConfig.campaign_budget_value || "50.00",
    campaign_bid_strategy: initialConfig.campaign_bid_strategy || "LOWEST_COST_WITHOUT_CAP",
    bid_amount: initialConfig.bid_amount || "",
    ad_format: initialConfig.ad_format || "Single image or video",
    ad_set_end_time: initialConfig.ad_set_end_time || getDefaultEndTime(),
    prediction_id: initialConfig.prediction_id || "",
    placement_type: initialConfig.placement_type || "advantage_plus",
    platforms: {
      facebook: true,
      instagram: true,
      audience_network: true,
      messenger: true,
    },
    placements: {
      feeds: true,
      profile_feed: true,
      marketplace: true,
      video_feeds: true,
      right_column: true,
      stories: true,
      reels: true,
      in_stream: true,
      search: true,
      facebook_reels: true,
      instagram_feeds: true,
      instagram_profile_feed: true,
      explore: true,
      explore_home: true,
      instagram_stories: true,
      instagram_reels: true,
      instagram_search: true,
      native_banner_interstitial: true,
      rewarded_videos: true,
      messenger_inbox: true,
      messenger_stories: true,
      messenger_sponsored: true,
    },
    buying_type: initialConfig.buying_type || "AUCTION",
    targeting_type: "Advantage",
    location: [],
    age_range: [18, 65],
    gender: "All",
    event_type: initialConfig.event_type || "PURCHASE",
    pixel_id: initialConfig.pixel_id || "",
    facebook_page_id: initialConfig.facebook_page_id || "",
    instagram_account: initialConfig.instagram_account || "",
    isCBO: initialConfig.isCBO || false,
    custom_audiences: initialConfig.custom_audiences || [],
    interests: initialConfig.interests || [],
    attribution_setting: initialConfig.attribution_setting || "7d_click",
  });

  const [showBidAmount, setShowBidAmount] = useState(
    ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(config.campaign_bid_strategy) ||
    ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(config.ad_set_bid_strategy)
  );
  const [showEndDate, setShowEndDate] = useState(
    config.ad_set_budget_optimization === "LIFETIME_BUDGET" ||
    config.campaign_budget_optimization === "LIFETIME_BUDGET"
  );
  const [showPredictionId, setShowPredictionId] = useState(
    config.buying_type === "RESERVED"
  );

  // Static sample data instead of API calls
  const countries = [
    { label: "United Kingdom", value: "GB" },
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
  ];
  const customAudiences = [
    { id: "1", name: "Audience 1" },
    { id: "2", name: "Audience 2" },
  ];
  const interests = [
    { label: "Technology", value: "1" },
    { label: "Sports", value: "2" },
    { label: "Music", value: "3" },
  ];
  const pixels = [
    { id: "pixel1", name: "Pixel 1" },
    { id: "pixel2", name: "Pixel 2" },
  ];
  const pages = [
    { id: "page1", name: "Page 1" },
    { id: "page2", name: "Page 2" },
  ];
  const instagramAccounts = [
    { value: "insta1", label: "Instagram 1" },
    { value: "insta2", label: "Instagram 2" },
  ];

  useEffect(() => {
    if (objective && objectiveEventMapping[objective]) {
      setFilteredEventTypes(objectiveEventMapping[objective]);
    } else {
      setFilteredEventTypes([]);
    }
  }, [objective]);

  useEffect(() => {
    setShowBidAmount(
      ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(config.campaign_bid_strategy) ||
      ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(config.ad_set_bid_strategy)
    );
    setShowEndDate(
      config.ad_set_budget_optimization === "LIFETIME_BUDGET" ||
      config.campaign_budget_optimization === "LIFETIME_BUDGET"
    );
    setShowPredictionId(config.buying_type === "RESERVED");
  }, [
    config.campaign_bid_strategy,
    config.ad_set_bid_strategy,
    config.ad_set_budget_optimization,
    config.campaign_budget_optimization,
    config.buying_type,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig, [name]: value };
      if (name === "buying_type" && value === "RESERVED") {
        newConfig.campaign_budget_optimization = "AD_SET_BUDGET_OPTIMIZATION";
        newConfig.ad_set_bid_strategy = "";
        setIsCBO(false);
      }
      if (name === "campaign_budget_optimization" && value !== "AD_SET_BUDGET_OPTIMIZATION") {
        newConfig.buying_type = "AUCTION";
      }
      return newConfig;
    });
  };

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
    setConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        platforms: { ...prevConfig.platforms, [name]: checked },
      };
      if (!checked) {
        if (name === "facebook") {
          newConfig.placements = {
            ...newConfig.placements,
            feeds: false,
            profile_feed: false,
            marketplace: false,
            video_feeds: false,
            right_column: false,
            stories: false,
            reels: false,
            in_stream: false,
            search: false,
            facebook_reels: false,
          };
        } else if (name === "instagram") {
          newConfig.placements = {
            ...newConfig.placements,
            instagram_feeds: false,
            instagram_profile_feed: false,
            explore: false,
            explore_home: false,
            instagram_stories: false,
            instagram_reels: false,
            instagram_search: false,
          };
        } else if (name === "audience_network") {
          newConfig.placements = {
            ...newConfig.placements,
            native_banner_interstitial: false,
            rewarded_videos: false,
          };
        } else if (name === "messenger") {
          newConfig.placements = {
            ...newConfig.placements,
            messenger_inbox: false,
            messenger_stories: false,
            messenger_sponsored: false,
          };
        }
      }
      return newConfig;
    });
  };

  const handleSliderChange = (event, newValue) => {
    setConfig((prevConfig) => ({ ...prevConfig, age_range: newValue }));
  };

  const handlePlacementChange = (e) => {
    const { name, checked } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      placements: { ...prevConfig.placements, [name]: checked },
    }));
  };

  const handleCountryChange = (selectedOptions) => {
    setSelectedCountries(selectedOptions || []);
    const selectedCountryCodes = selectedOptions.map((option) => option.value);
    setConfig((prevConfig) => ({
      ...prevConfig,
      location: selectedCountryCodes,
    }));
  };

  const handleCustomAudienceChange = (selectedOptions) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      custom_audiences: selectedOptions || [],
    }));
  };

  const handleInterestChange = (selectedOptions) => {
    setSelectedInterests(selectedOptions || []);
    setConfig((prevConfig) => ({
      ...prevConfig,
      interests: selectedOptions || [],
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  useEffect(() => {
    onSaveConfig(config);
  }, [config, onSaveConfig]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("budgetSchedule")}>
          <h3>Budget & Schedule</h3>
          <Image
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            width={16}
            height={16}
            className={`${styles.toggleIcon} ${expandedSections["budgetSchedule"] ? styles.expanded : ""}`}
          />
        </div>
        {expandedSections["budgetSchedule"] && (
          <div className={styles.sectionContent}>
            <div className={styles.budgetOptimizationToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${!isCBO ? styles.active : ""}`}
                onClick={() => {
                  setIsCBO(false);
                  setConfig((prev) => ({ ...prev, isCBO: false }));
                }}
              >
                ABO
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${styles.lastButton} ${isCBO ? styles.active : ""}`}
                onClick={() => {
                  setIsCBO(true);
                  setConfig((prev) => ({ ...prev, isCBO: true }));
                }}
              >
                CBO
              </button>
              <span className={styles.optimizationLabel}>BUDGET OPTIMIZATION</span>
            </div>

            {isCBO ? (
              <>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="campaign_budget_optimization">
                    Campaign Budget Optimization:
                  </label>
                  <select
                    id="campaign_budget_optimization"
                    name="campaign_budget_optimization"
                    value={config.campaign_budget_optimization}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="DAILY_BUDGET">Daily Budget</option>
                    <option value="LIFETIME_BUDGET">Lifetime Budget</option>
                  </select>
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="campaign_budget_value">
                    Campaign Budget Value:
                  </label>
                  <input
                    type="number"
                    id="campaign_budget_value"
                    name="campaign_budget_value"
                    value={config.campaign_budget_value}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="ad_set_bid_strategy">
                  Buying Type:
                  </label>
                  <select
                    id="ad_set_bid_strategy"
                    name="ad_set_bid_strategy"
                    value={config.ad_set_bid_strategy}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="">Auction</option>
                    <option value="">Reserved</option>
                  </select>
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="campaign_bid_strategy">
                    Campaign Bid Strategy:
                  </label>
                  <select
                    id="campaign_bid_strategy"
                    name="campaign_bid_strategy"
                    value={config.campaign_bid_strategy}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost</option>
                    <option value="COST_CAP">Cost Cap</option>
                    <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="ad_set_budget_optimization">
                    Ad Set Budget Optimization:
                  </label>
                  <select
                    id="ad_set_budget_optimization"
                    name="ad_set_budget_optimization"
                    value={config.ad_set_budget_optimization}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="DAILY_BUDGET">Daily Budget</option>
                    <option value="LIFETIME_BUDGET">Lifetime Budget</option>
                  </select>
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="ad_set_budget_value">
                    Ad Set Budget Value:
                  </label>
                  <input
                    type="number"
                    id="ad_set_budget_value"
                    name="ad_set_budget_value"
                    value={config.ad_set_budget_value}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="ad_set_bid_strategy">
                  Buying Type:
                  </label>
                  <select
                    id="ad_set_bid_strategy"
                    name="ad_set_bid_strategy"
                    value={config.ad_set_bid_strategy}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="">Auction</option>
                    <option value="">Reserved</option>
                  </select>
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="ad_set_bid_strategy">
                    Ad Set Bid Strategy:
                  </label>
                  <select
                    id="ad_set_bid_strategy"
                    name="ad_set_bid_strategy"
                    value={config.ad_set_bid_strategy}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost</option>
                    <option value="COST_CAP">Cost Cap</option>
                    <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
                  </select>
                </div>
              </>
            )}

            {showEndDate && (
              <div className={styles.column}>
                <label className={styles.labelText} htmlFor="ad_set_end_time">
                  Ad Set End Time:
                </label>
                <input
                  type="datetime-local"
                  id="ad_set_end_time"
                  name="ad_set_end_time"
                  value={config.ad_set_end_time}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            )}
            {showBidAmount && (
              <div className={styles.column}>
                <label className={styles.labelText} htmlFor="bid_amount">
                  Bid Amount:
                </label>
                <input
                  type="number"
                  id="bid_amount"
                  name="bid_amount"
                  value={config.bid_amount}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            )}
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="app_events">
                Schedule:
              </label>
              <input
                type="datetime-local"
                id="app_events"
                name="app_events"
                value={config.app_events}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("assets")}>
          <h3>Assets</h3>
          <Image
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            width={16}
            height={16}
            className={`${styles.toggleIcon} ${expandedSections["assets"] ? styles.expanded : ""}`}
          />
        </div>
        {expandedSections["assets"] && (
          <div className={styles.sectionContent}>
            <div className={styles.column}>
              <label htmlFor="event_type" className={styles.labelText}>
                Event Type:
              </label>
              <select
                id="event_type"
                name="event_type"
                value={config.event_type}
                onChange={handleChange}
                className={styles.selectField}
              >
                {filteredEventTypes.map((event) => (
                  <option key={event} value={event}>
                    {formatGoalForUI(event)}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.column}>
              <label htmlFor="pixel_id" className={styles.labelText}>
                Pixel ID:
              </label>
              <select
                id="pixel_id"
                name="pixel_id"
                value={config.pixel_id}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select Pixel</option>
                {pixels.map((pixel) => (
                  <option key={pixel.id} value={pixel.id}>
                    {pixel.name || pixel.id}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.column}>
              <label htmlFor="facebook_page_id" className={styles.labelText}>
                Facebook Page:
              </label>
              <select
                id="facebook_page_id"
                name="facebook_page_id"
                value={config.facebook_page_id}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select Facebook Page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name || page.id}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.column}>
              <label htmlFor="instagram_account" className={styles.labelText}>
                Instagram Account:
              </label>
              <select
                id="instagram_account"
                name="instagram_account"
                value={config.instagram_account}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select Instagram Account</option>
                {instagramAccounts.map((account) => (
                  <option key={account.value} value={account.value}>
                    {account.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("placements")}>
          <h3>Placements</h3>
          <Image
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            width={16}
            height={16}
            className={`${styles.toggleIcon} ${expandedSections["placements"] ? styles.expanded : ""}`}
          />
        </div>
        {expandedSections["placements"] && (
          <div className={styles.sectionContent}>
            <div className={styles.placementToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${config.placement_type === "advantage_plus" ? styles.active : ""}`}
                onClick={() => setConfig((prev) => ({ ...prev, placement_type: "advantage_plus" }))}
              >
                On
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${styles.lastButton} ${config.placement_type === "Manual" ? styles.active : ""}`}
                onClick={() => setConfig((prev) => ({ ...prev, placement_type: "Manual" }))}
              >
                Off
              </button>
              <span className={styles.optimizationLabel}>ADVANTAGE+ PLACEMENTS</span>
            </div>
            <div className={`${styles.platformContainer} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.platforms.facebook}
                    onChange={handlePlatformChange}
                    name="facebook"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.platforms.instagram}
                    onChange={handlePlatformChange}
                    name="instagram"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Instagram"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.platforms.audience_network}
                    onChange={handlePlatformChange}
                    name="audience_network"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Audience Network"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              
            </div>
            <hr className={styles.sectionDivider2} />
            <div className={`${styles.manualOptions} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.feeds}
                    onChange={handlePlacementChange}
                    name="feeds"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Feed"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.profile_feed}
                    onChange={handlePlacementChange}
                    name="profile_feed"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Profile Feed"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.marketplace}
                    onChange={handlePlacementChange}
                    name="marketplace"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Marketplace"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.video_feeds}
                    onChange={handlePlacementChange}
                    name="video_feeds"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Video Feeds"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.right_column}
                    onChange={handlePlacementChange}
                    name="right_column"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Right Column"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.stories}
                    onChange={handlePlacementChange}
                    name="stories"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Stories"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.reels}
                    onChange={handlePlacementChange}
                    name="reels"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Facebook Reels"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.instagram_feeds}
                    onChange={handlePlacementChange}
                    name="instagram_feeds"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Instagram Feed"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.instagram_stories}
                    onChange={handlePlacementChange}
                    name="instagram_stories"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Instagram Stories"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.instagram_reels}
                    onChange={handlePlacementChange}
                    name="instagram_reels"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Instagram Reels"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.native_banner_interstitial}
                    onChange={handlePlacementChange}
                    name="native_banner_interstitial"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Audience Network Native, Banner and Interstitial"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.placements.rewarded_videos}
                    onChange={handlePlacementChange}
                    name="rewarded_videos"
                    sx={{ "&.Mui-checked": { "& .MuiSvgIcon-root": { color: "#5356FF" } } }}
                  />
                }
                label="Audience Network Rewarded Videos"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1E1E1E" } }}
              />
             
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("targetingDelivery")}>
          <h3>Targeting & Delivery</h3>
          <Image
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            width={16}
            height={16}
            className={`${styles.toggleIcon} ${expandedSections["targetingDelivery"] ? styles.expanded : ""}`}
          />
        </div>
        {expandedSections["targetingDelivery"] && (
          <div className={styles.sectionContent}>
            <div className={styles.budgetOptimizationToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${config.targeting_type === "Advantage" ? styles.active : ""}`}
                onClick={() => setConfig((prev) => ({ ...prev, targeting_type: "Advantage" }))}
              >
                On
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${styles.lastButton} ${config.targeting_type === "Manual" ? styles.active : ""}`}
                onClick={() => setConfig((prev) => ({ ...prev, targeting_type: "Manual" }))}
              >
                Off
              </button>
              <span className={styles.optimizationLabel}>ADVANTAGE+ AUDIENCE</span>
            </div>
            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="custom_audiences" className={styles.labelText}>
                Custom Audiences:
              </label>
              <Select
                id="custom_audiences"
                isMulti
                options={customAudiences.map((audience) => ({
                  label: audience.name,
                  value: audience.id,
                }))}
                value={config.custom_audiences}
                onChange={handleCustomAudienceChange}
                placeholder="Select custom audiences"
                className={styles.selectField}
              />
            </div>
            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="interests" className={styles.labelText}>
                Targeting Interests:
              </label>
              <Select
                id="interests"
                isMulti
                options={interests}
                value={selectedInterests}
                onChange={handleInterestChange}
                placeholder="Select interests"
                className={styles.selectField}
              />
            </div>
            <div className={styles.column}>
              <label htmlFor="location" className={styles.labelText}>
                Locations:
              </label>
              <Select
                id="location"
                isMulti
                options={countries}
                value={selectedCountries}
                onChange={handleCountryChange}
                placeholder="Select countries"
                className={styles.selectField}
              />
            </div>
            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="gender" className={styles.labelText}>
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={config.gender}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="age_range" className={styles.labelText}>
                Age Range ({config.age_range[0]} - {config.age_range[1]} Years)
              </label>
              <Slider
                value={config.age_range}
                onChange={handleSliderChange}
                min={18}
                max={65}
                sx={{
                  color: "#6A00FF",
                  height: 8,
                  "& .MuiSlider-thumb": { height: 22, width: 22 },
                  "& .MuiSlider-track": { height: 8, borderRadius: 4 },
                  "& .MuiSlider-rail": { height: 8, borderRadius: 4 },
                }}
              />
            </div>
            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="attribution_setting" className={styles.labelText}>
                Attribution Setting:
              </label>
              <select
                id="attribution_setting"
                name="attribution_setting"
                value={config.attribution_setting}
                onChange={handleChange}
                className={styles.selectField}
              >
                {attributionSettings.map((setting) => (
                  <option key={setting.value} value={setting.value}>
                    {setting.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("campaignTracking")}>
          <h3>Campaign & Tracking</h3>
          <Image
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            width={16}
            height={16}
            className={`${styles.toggleIcon} ${expandedSections["campaignTracking"] ? styles.expanded : ""}`}
          />
        </div>
        {expandedSections["campaignTracking"] && (
          <div className={styles.sectionContent}>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="ad_format">
                Ad Format:
              </label>
              <select
                id="ad_format"
                name="ad_format"
                value={config.ad_format}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="Single image or video">Single image or video</option>
                <option value="Carousel">Carousel</option>
              </select>
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="ad_creative_primary_text">
                Primary Text:
              </label>
              <textarea
                id="ad_creative_primary_text"
                name="ad_creative_primary_text"
                value={config.ad_creative_primary_text}
                onChange={handleChange}
                rows="4"
                className={styles.textareaField}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="ad_creative_headline">
                Headline:
              </label>
              <textarea
                id="ad_creative_headline"
                name="ad_creative_headline"
                value={config.ad_creative_headline}
                onChange={handleChange}
                rows="4"
                className={styles.textareaField}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="ad_creative_description">
                Description:
              </label>
              <textarea
                id="ad_creative_description"
                name="ad_creative_description"
                value={config.ad_creative_description}
                onChange={handleChange}
                rows="4"
                className={styles.textareaField}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="call_to_action">
                Call to Action:
              </label>
              <select
                id="call_to_action"
                name="call_to_action"
                value={config.call_to_action}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="SHOP_NOW">Shop Now</option>
                <option value="LEARN_MORE">Learn More</option>
                <option value="SIGN_UP">Sign Up</option>
              </select>
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="destination_url">
                Destination URL:
              </label>
              <input
                type="text"
                id="destination_url"
                name="destination_url"
                value={config.destination_url}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="url_parameters">
                UTM Parameters:
              </label>
              <input
                type="text"
                id="url_parameters"
                name="url_parameters"
                value={config.url_parameters}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="campaignName">
                Campaign Name:
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                placeholder="Enter Name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className={styles.inputField}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ConfigForm.propTypes = {
  onSaveConfig: PropTypes.func.isRequired,
  initialConfig: PropTypes.object.isRequired,
  activeAccount: PropTypes.object.isRequired,
  campaignName: PropTypes.string.isRequired,
  setCampaignName: PropTypes.func.isRequired,
  campaignId: PropTypes.string,
  objective: PropTypes.string.isRequired,
};

export default ConfigForm;