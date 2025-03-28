"use client"; // Required for client-side interactivity in Next.js App Router

import React from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation
import styles from "/Components/SuccessScreen.module.css"; // Adjust path based on your structure

const SuccessScreen = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/"); // Adjust this to your desired "go back" route
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Success!</h2>
        <p>Your ad campaign has been successfully created.</p>
        <video
          src="/assets/WhatsApp Video 2024-09-09 at 3.03.28 PM.mp4" // Public folder path in Next.js
          className={styles.successVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <p>Your ads are automatically paused.</p>
        <p>
          When you're ready, just turn them on from the ads section in your Ads
          manager.
        </p>
        <button className={styles.successGoBackButton} onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;