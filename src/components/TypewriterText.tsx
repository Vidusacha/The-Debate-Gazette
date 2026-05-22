import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  delay = 0, 
  className 
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset when props change
    setDisplayedText('');

    let typingInterval: number;

    const startTimeout = setTimeout(() => {
      let i = 0;
      typingInterval = window.setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayedText}</span>;
};
