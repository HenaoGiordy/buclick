import React from 'react';

const MenuButton = ({ text, isActive, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const buttonStyle = {
    backgroundColor: isActive ? 'white' : (isHovered ? '#841F1C' : '#C20E1A'),
    color: isActive ? '#C20E1A' : 'white',
    borderRadius: '8px',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    margin: '5px',
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default MenuButton;
