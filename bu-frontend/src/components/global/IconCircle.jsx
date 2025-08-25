import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook de navegación

const IconCircle = ({ icon, hoverIcon, text, size = 64, bgColor = 'bg-gray-200', iconSize, url }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const sizes = {
    xxl: 180,
    '2xl': 240,
  };

  const actualSize = sizes[size] || size;
  const calculatedIconSize = iconSize || `w-${Math.floor(actualSize * 0.5)} h-${Math.floor(actualSize * 0.5)}`;

  const handleClick = () => {
    if (url) {
      navigate(url);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full ${bgColor} transition-colors duration-300 cursor-pointer`}
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#C20E1A' : '#e2e8f0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div
          className={`flex items-center justify-center ${calculatedIconSize}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {isHovered ? hoverIcon : icon}
        </div>
      </div>
      {text && (
        <span className="icon-circle-text">
          {text}
        </span>
      )}
    </div>
  );
};

export default IconCircle;

