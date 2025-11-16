import React, { useState } from 'react';
import { MdAccountBalanceWallet } from 'react-icons/md';

const UserProfile = () => {
  const [balance, setBalance] = useState(1250.50);
  const userName = "Bhupender Singh";

  const handleAddMoney = () => {
    alert('Add Money feature - Payment gateway integration');
  };

  // ====== get user initials =====
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-profile d-flex align-items-center gap-2 gap-md-3">
      <div className="user-avatar d-flex align-items-center justify-content-center">
        {getInitials(userName)}
      </div>
      <div className="user-info d-none d-md-block">
        <div className="user-name fw-bold">{userName}</div>
        <div className="user-wallet d-flex align-items-center gap-2">
          <MdAccountBalanceWallet className="wallet-icon" />
          <span className="wallet-balance">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <button 
            className="btn btn-sm btn-success add-money-btn"
            onClick={handleAddMoney}
            title="Add Money"
          >
            <span>+</span>
            <span className="ms-1">Add Money</span>
          </button>
        </div>
      </div>
      <div className="user-info-mobile d-md-none">
        <div className="user-name-mobile fw-bold text-truncate" style={{ maxWidth: '120px' }}>
          {userName}
        </div>
        <div className="user-wallet-mobile d-flex align-items-center gap-1">
          <MdAccountBalanceWallet className="wallet-icon-mobile" style={{ fontSize: '1rem' }} />
          <span className="wallet-balance-mobile" style={{ fontSize: '0.75rem' }}>
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </span>
        </div>
      </div>
      <button 
        className="btn btn-sm btn-success add-money-btn-mobile d-md-none"
        onClick={handleAddMoney}
        title="Add Money"
        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
      >
        +
      </button>
    </div>
  );
};

export default UserProfile;

