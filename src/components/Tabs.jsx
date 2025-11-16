import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="d-flex gap-2 mb-4 flex-wrap">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
