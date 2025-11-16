import React from 'react';
import { FaTrophy, FaUsers, FaGift, FaUserPlus, FaFire } from 'react-icons/fa';

const PromotionalRibbon = () => {
  const promotions = [
    {
      id: 1,
      message: "Make teams and win up to ₹1,00,000!",
      subMessage: "Grand Prize",
      icon: <FaTrophy />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#fff",
      iconBg: "rgba(255, 255, 255, 0.3)"
    },
    {
      id: 2,
      message: "Join contests and compete with millions!",
      subMessage: "Join Now",
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#fff",
      iconBg: "rgba(255, 255, 255, 0.3)"
    },
    {
      id: 3,
      message: "Daily cash prizes up to ₹50,000!",
      subMessage: "Daily Rewards",
      icon: <FaGift />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      color: "#fff",
      iconBg: "rgba(255, 255, 255, 0.3)"
    },
    {
      id: 4,
      message: "Refer friends and earn bonus!",
      subMessage: "Refer & Earn",
      icon: <FaUserPlus />,
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      color: "#fff",
      iconBg: "rgba(255, 255, 255, 0.3)"
    },
    {
      id: 5,
      message: "Special weekend contests with 2x rewards!",
      subMessage: "Weekend Special",
      icon: <FaFire />,
      gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      color: "#fff",
      iconBg: "rgba(255, 255, 255, 0.3)"
    }
  ];

  // ====== duplicate for infinite scroll =====
  const duplicatedPromotions = [...promotions, ...promotions];

  return (
    <div className="promotional-ribbon-wrapper mb-4">
      <div className="promotional-ribbon-container">
        <div className="ribbon-cards-wrapper">
          <div className="ribbon-cards-scroll">
            {duplicatedPromotions.map((promo, index) => (
              <div 
                key={`${promo.id}-${index}`} 
                className="ribbon-card"
                style={{
                  background: promo.gradient,
                  color: promo.color,
                  boxShadow: `0 8px 16px rgba(0, 0, 0, 0.15)`
                }}
              >
                <div 
                  className="ribbon-card-icon"
                  style={{ backgroundColor: promo.iconBg }}
                >
                  {promo.icon}
                </div>
                <div className="ribbon-card-content">
                  <div className="ribbon-card-subtitle">{promo.subMessage}</div>
                  <div className="ribbon-card-text">{promo.message}</div>
                </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalRibbon;
