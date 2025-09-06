"use client";
import React, { memo } from 'react';

interface BanglaTextProps {
  children: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

// Function to wrap Bangla numbers with special styling
const formatBanglaNumbers = (text: string): React.ReactElement[] => {
  // Split text by Bangla numbers and preserve the delimiters
  const parts = text.split(/([০-৯]+)/);
  
  return parts.map((part, index) => {
    // Check if this part contains only Bangla numbers
    if (/^[০-৯]+$/.test(part)) {
      return (
        <span 
          key={index} 
          className="bangla-number"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const BanglaText = memo(({ 
  children, 
  className = '', 
  as: Component = 'span'
}: BanglaTextProps) => {
  // Check if text contains Bangla numbers
  const hasBanglaNumbers = /[০-৯]/.test(children);

  // If no Bangla numbers, return text as is
  if (!hasBanglaNumbers) {
    return <Component className={className}>{children}</Component>;
  }

  // If contains Bangla numbers, apply special formatting
  return (
    <Component className={`bangla-text ${className}`}>
      {formatBanglaNumbers(children)}
    </Component>
  );
});

BanglaText.displayName = 'BanglaText';

export default BanglaText;

// Hook for easy usage in components
export const useBanglaText = (text: string) => {
  const hasBanglaNumbers = /[০-৯]/.test(text);
  
  if (!hasBanglaNumbers) {
    return { formattedText: text, needsFormatting: false };
  }
  
  return { 
    formattedText: text, 
    needsFormatting: true,
    component: <BanglaText>{text}</BanglaText>
  };
};