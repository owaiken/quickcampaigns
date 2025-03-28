'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer

import "react-toastify/dist/ReactToastify.css";
import styles from './StickySide.module.css';
import '/app/main/MainStyles.module.css'
import '../ToastifyOverrides.css';

const StickySide = ({ refreshTrigger }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [activeAdAccountsCount, setActiveAdAccountsCount] = useState(0);
  const [userSubscriptionPlan, setUserSubscriptionPlan] = useState('Enterprise');  // Set to 'Enterprise' for testing
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAccount, setActiveAccount] = useState(null); // Internal state
  const sidebarRef = useRef(null);
  const activeAccountRef = useRef(null);
  const router = useRouter();

  // Mock data initialization
  useEffect(() => {
    const mockAdAccounts = [
      { id: '1', name: 'Ad Account 1' },
      { id: '2', name: 'Ad Account 2' },
    ];
    setAdAccounts(mockAdAccounts);
    setActiveAdAccountsCount(1);
    setActiveAccount(mockAdAccounts[0]); // Set internally
    setAdAccountDetails({ name: 'Ad Account 1' });
    setIsLoading(false);
  }, [refreshTrigger]);

  // Scroll to the active account when it changes
  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount]);

  const handleAccountClick = (index) => {
    const selectedAccount = adAccounts[index];
    setActiveAccount(selectedAccount); // Update internally
    setAdAccountDetails({ name: selectedAccount.name });

    // Trigger success toast when an account is selected
    toast.success(`Switched to ${selectedAccount.name}`);

    if (router.pathname === '/pricing') {
      router.push('/');
    }
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  const handleUpgradeClick = () => {
    router.push('/pricing');
  };

  const handleAddAdAccountClick = () => {
    console.log('Add New Ad Account clicked'); // Debug log
    // Trigger info toast when adding a new ad account
    toast.info("Adding a new Ad Account...");
  };

  console.log(userSubscriptionPlan); // Debugging log to check the subscription plan

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error("Error loading ad accounts");
    return <div>Error loading ad accounts</div>;
  }

  return (
    <div>
      <div className={styles.hamburgerIcon} onClick={toggleSidebar}>
        <img src={isSidebarOpen ? '/assets/x.svg' : '/assets/Vector2.png'} alt='Menu' />
      </div>
      {isSidebarOpen && <div className={styles.overlay} onClick={handleOverlayClick}></div>}
      <div ref={sidebarRef} className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.open : ''}`}>
        <div>
          <div className={styles.logo}>
            <Link href='/main'>
              <img src='/assets/logo-footer.png' alt='Logo' className={styles.logoImage} />
            </Link>
          </div>
          <hr className={styles.horizontalRule} />
          <div className={styles.accountsContainer}>
            {adAccounts.length > 0 ? (
              adAccounts.map((account, index) => (
                <button
                  key={index}
                  ref={activeAccount?.id === account.id ? activeAccountRef : null}
                  className={`${styles.accountButton} ${activeAccount?.id === account.id ? styles.active : ''}`}
                  onClick={() => handleAccountClick(index)}
                  aria-label={`Switch to Ad Account ${index + 1}`}
                >
                  <img src='./assets/user-round.png' alt='User Icon' className={styles.icon} /> {`Ad Account ${index + 1}`}
                </button>
              ))
            ) : (
              <p>No ad accounts available</p>
            )}
          </div>
          <hr className={styles.horizontalRule} />
          {userSubscriptionPlan === 'Enterprise' && (
            <button
              className={styles.accountButton2}
              onClick={handleAddAdAccountClick}
              aria-label='Create New Ad Account'
            >
              Add New Ad Account
            </button>
          )}
          <div className={styles.dropdownSection}>
            <div className={styles.sectionHeader} onClick={handleDropdownToggle}>
              <div className={styles.sectionTitle}>Facebook Setting</div>
              <img
                src='/assets/Vector.png'
                alt='Dropdown Icon'
                className={`${styles.dropdownIcon} ${isDropdownVisible ? styles.rotated : ''}`}
              />
            </div>
            {isDropdownVisible && activeAccount && (
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownRow}>
                  <div className={styles.inlineContainer}>
                    <span className={`${styles.input} ${styles.input1} ${styles.lab}`}>Ad Account - </span>
                    <input
                      className={`${styles.input} ${styles.input1}`}
                      placeholder='Ad Account ID'
                      value={adAccountDetails.name || ''}
                      readOnly
                    />
                  </div>
                  <hr className={styles.horizontalRule1} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <button className={styles.upgradeButton} onClick={handleUpgradeClick}>
            Upgrade Plan
          </button>
          <div className={styles.footer}>
            {userSubscriptionPlan.toLowerCase() === 'professional'
              ? `${activeAdAccountsCount > 0 ? '1' : '0'} Ad account on ${userSubscriptionPlan.toLowerCase()} plan`
              : `${activeAdAccountsCount} Ad accounts on ${userSubscriptionPlan.toLowerCase()} plan`}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default StickySide;
