import React from 'react';

const Button = ({ 
  icon, 
  bgColor, 
  color, 
  bgHoverColor, 
  size, 
  text, 
  borderRadius, 
  width,
  customFunc 
}) => {
  return (
    <button
      type="button"
      onClick={customFunc}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
