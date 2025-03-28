"use client";

import React, { useRef, useState } from "react";
import styles from "./SetupAdAccountModal.module.css";
import SetupAdAccountPopup from "/Components/SetupAdAccountPopup/SetupAdAccountPopup";

const SetupAdAccountModal = ({ onClose, activeAccount, setActiveAccount }) => {
  const modalRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSetupAccount = () => {
    setShowPopup(true);
  };

  const handleCompleteClose = () => {
    setShowPopup(false);
    onClose();
  };

  return (
    <div>
      {!showPopup && (
        <div className={styles.modalContainer}>
          <div className={styles.interactionBlockingOverlay}></div>
          <div ref={modalRef} className={styles.modal}>
            <div className={styles.setupForm}>
              <h3 className={styles.modalHeading}>Set Up Ad Account</h3>
              <p className={styles.modalMessage}>
                To start uploading campaigns, you need to set up an ad account.
              </p>
              <div className={styles.buttonContainer}>
                <button className={styles.setupButton} onClick={handleSetupAccount}>
                  Set Up Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className={styles.popupOverlay}>
          <SetupAdAccountPopup
            onClose={() => setShowPopup(false)}
            onComplete={handleCompleteClose}
            activeAccount={activeAccount}
            setActiveAccount={setActiveAccount}
          />
        </div>
      )}
    </div>
  );
};

export default SetupAdAccountModal;