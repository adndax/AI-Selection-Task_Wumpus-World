import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button 
      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-16 py-2.5 text-xl tracking-wider transition-colors duration-200 border-2 border-yellow-400 hover:border-yellow-300"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;