'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ToastifyOverrides.css';
import './NavBar.css';
import Link from 'next/link';

const Navbar = ({ activeAccount, setActiveAccount, refreshTrigger }) => {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState('/assets/no-profile-picture-15257.svg');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [adAccounts, setAdAccounts] = useState([]);
  const [activeAdAccountsCount, setActiveAdAccountsCount] = useState(0);

  useEffect(() => {
    const mockAdAccounts = [
      { id: '1', name: 'Ad Account 1' },
      { id: '2', name: 'Ad Account 2' },
    ];
    setAdAccounts(mockAdAccounts);
    setActiveAdAccountsCount(1);
  }, [refreshTrigger]);

  useEffect(() => {
    setProfilePic('/assets/no-profile-picture-15257.svg');
  }, []);

  const handleProfileClick = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleOptionClick = (path) => {
    setDropdownVisible(false);
    router.push(path);
    toast.info(`Navigating to ${path}`);
  };

  const handleLogout = () => {
    // Internal logout logic (e.g., redirect to home)
    setDropdownVisible(false);
    router.push('/');
    toast.success('Logged out successfully!');
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <img
          src={profilePic}
          alt="Profile"
          className="navbar-profile"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        />
        {dropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-item1">
              Active Ad Accounts: {activeAdAccountsCount || 0}
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleOptionClick('/profile-management')}
            >
              Manage Subscription
            </div>
            <Link href="/" className="linktag">
              <div className="dropdown-item" onClick={handleLogout}>
                Log Out
              </div>
            </Link>
          </div>
        )}
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;