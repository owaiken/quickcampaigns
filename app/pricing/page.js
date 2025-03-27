"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PricingSection.css"; 
import "./DowngradeModal.css"; 
import StickySide from "@/Components/StickySide/StickySide";
import Navbar from "@/Components/NavBar/NavBar";
const DowngradeModal = ({ onCancel, onConfirm }) => {
  const [adAccounts, setAdAccounts] = useState([
    { id: "1", name: "Ad Account 1" },
    { id: "2", name: "Ad Account 2" },
  ]);
  const [selectedAdAccount, setSelectedAdAccount] = useState(adAccounts[0]?.id || "");

  const handleConfirm = () => {
    if (!selectedAdAccount) {
      toast.warning("Please select an ad account.");
      return;
    }
    onConfirm(selectedAdAccount);
  };

  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3 className="h3">Choose an Ad Account to Retain</h3>
        <select
          className="dropdown"
          value={selectedAdAccount}
          onChange={(e) => setSelectedAdAccount(e.target.value)}
        >
          {adAccounts.map((account, index) => (
            <option key={account.id} value={account.id}>
              {`${index + 1} - ${account.name}`}
            </option>
          ))}
        </select>
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="confirmButton"
            onClick={handleConfirm}
            disabled={!selectedAdAccount}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Pricing Component
const Pricing = ({ onPlanUpgrade }) => {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("Professional");
  const [hasUsedFreeTrial] = useState(false);
  const [adAccounts] = useState([
    { id: "1", name: "Ad Account 1" },
    { id: "2", name: "Ad Account 2" },
  ]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState(adAccounts[0]?.id || null);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [availableAdAccounts] = useState(adAccounts);
  const [pendingDowngradePlan, setPendingDowngradePlan] = useState("");

  const handleSubscribe = (plan) => {
    if (!selectedAdAccountId) {
      toast.warn("Please select an ad account before subscribing.");
      return;
    }
    if (plan === "Free Trial" && hasUsedFreeTrial) {
      toast.info("You have already used the Free Trial. Please choose a different plan.");
      return;
    }
    if (plan === currentPlan) {
      toast.info(`You are already subscribed to the ${plan} plan.`);
      return;
    }
    if (currentPlan === "Enterprise" && plan === "Professional") {
      setPendingDowngradePlan(plan);
      setShowDowngradeModal(true);
      return;
    }
    proceedWithSubscription(plan, selectedAdAccountId);
  };

  const proceedWithSubscription = (plan, adAccountToRetain) => {
    toast.success(`Subscription to ${plan} successful! Thank you for subscribing.`);
    setCurrentPlan(plan);
    if (onPlanUpgrade) {
      onPlanUpgrade();
    }
    router.push("/");
  };

  const plans = [
    {
      name: "Professional",
      price: "$129.95/Month",
      description: "Perfect for Individual Advertisers and Small Teams",
      features: [
        "Upload unlimited ads to 1 ad account.",
        "Perfect for solo marketers and small teams.",
        "Access all features and customization tools.",
        "Receive dedicated support for ad management.",
      ],
    },
    {
      name: "Enterprise",
      price: "$99.95/Month",
      description: "Ideal for Agencies and Businesses",
      features: [
        "Upload unlimited ads to multiple ad accounts.",
        "Perfect for agencies and businesses.",
        "Access all features and customization tools.",
        "Receive dedicated support for ad management.",
      ],
    },
  ];

  return (
    <div className="pricingSection">
      <div className="header">
        <img
          src="/assets/Vector4.png"
          alt="Go Back"
          className="goBackIcon"
          onClick={() => router.push("/main")}
        />
        <p className="priceHeading">
          Choose the <span>Perfect Plan</span> for Your Needs
        </p>
      </div>
      <p className="priceDesc">Flexible Pricing to Suit Every Advertiser</p>
      <div className="priceCardContainer">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`priceCard ${plan.name === "Professional" ? "popularPlan" : ""}`}
          >
            <p className="priceCardPrice">{plan.price}</p>
            <p className="priceCardAccounts">
              {plan.name === "Enterprise" ? "For 2 or more ad accounts, with pricing per account." : "1 Ad Account"}
            </p>
            <p className="priceCardPlan">{plan.name} Plan</p>
            <p className="priceCardPlanDesc">{plan.description}</p>
            <div className="priceCardFeatureContainer">
              {plan.features.map((feature, i) => (
                <div key={i} className="priceCardFeature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z"
                      fill="#EEEEEE"
                    />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSubscribe(plan.name)}
              className={`priceStartBtn ${currentPlan === plan.name ? "currentPlanBtn" : ""} ${
                currentPlan === "Enterprise" && plan.name === "Professional" ? "downgradeBtn" : ""
              }`}
            >
              {currentPlan === plan.name
                ? "Downgrade"
                : currentPlan === "Enterprise" && plan.name === "Professional"
                ? "Current Plan"
                : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => router.push("/main")} className="button goBackButton">
        Go Back
      </button>
      {showDowngradeModal && (
        <DowngradeModal
          adAccounts={availableAdAccounts}
          onConfirm={(selectedAccount) => {
            setShowDowngradeModal(false);
            proceedWithSubscription(pendingDowngradePlan, selectedAccount);
          }}
          onCancel={() => setShowDowngradeModal(false)}
        />
      )}
    </div>
  );
};

const Page = () => {
  return (
    <div className="content">
      <div className="pageContainer">
            <Navbar />
            <div className="mainContent">
              <StickySide />
      <Pricing />
    </div>
    </div>
    </div>
  );
};

export default Page;