// Utility functions for handling Bangla numbers with custom fonts

export const banglaNumberFont = 'Roboto, "Segoe UI", Arial, sans-serif';

// Function to wrap Bangla numbers with a specific font class
export const formatBanglaNumbersWithFont = (text: string): string => {
  // Replace Bangla numbers with HTML spans that have custom font
  return text.replace(/([০-৯]+)/g, `<span style="font-family: ${banglaNumberFont};">$1</span>`);
};

// Function to check if text contains Bangla numbers
export const hasBanglaNumbers = (text: string): boolean => {
  return /[০-৯]/.test(text);
};

// CSS class name for Bangla numbers
export const banglaNumberClass = 'bangla-number-font';

// CSS styles to be added to global CSS
export const banglaNumberStyles = `
.bangla-number-font {
  font-family: ${banglaNumberFont} !important;
}

/* Style specifically for Bangla numbers in any context */
.bangla-text [data-bangla-number] {
  font-family: ${banglaNumberFont} !important;
}
`;