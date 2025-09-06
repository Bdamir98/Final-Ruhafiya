# Bangla Number Font Styling Guide

This guide explains how to apply different fonts specifically to Bangla numbers (০-৯) while keeping regular Bangla text in the default font.

## Components Available

### 1. BanglaText Component
Located: `src/react-app/components/BanglaText.tsx`

**Usage:**
```tsx
import BanglaText from './BanglaText';

// Automatic detection and styling of Bangla numbers
<BanglaText>আমাদের ৭০০০+ গ্রাহক সন্তুষ্ট</BanglaText>

// As different HTML elements
<BanglaText as="h1" className="text-2xl font-bold">
  ১৫-৩০ দিন নিয়মিত ব্যবহার
</BanglaText>

<BanglaText as="p" className="text-lg">
  ৩৭% ছাড় পান
</BanglaText>
```

### 2. CSS Classes
The following CSS classes are available in `globals.css`:

- `.bangla-number-font` - Apply directly to elements containing only numbers
- `.bangla-text` - Container class for text with mixed content
- `.bangla-number` - Automatically applied to number spans within `.bangla-text`

**Direct CSS Usage:**
```html
<span class="bangla-number-font">৭০০০</span>
<p class="bangla-text">আমাদের <span class="bangla-number">৭০০০</span>+ গ্রাহক</p>
```

## How It Works

1. **Automatic Detection**: The `BanglaText` component automatically detects Bangla numbers (০-৯) in the text
2. **Font Application**: Numbers get wrapped with `.bangla-number` class that applies `Roboto, 'Segoe UI', Arial, sans-serif`
3. **Inheritance**: All other text properties (size, weight, color) are inherited from parent

## Font Settings

**Current Font Stack for Numbers:**
- Primary: `Roboto`
- Fallbacks: `Segoe UI`, `Arial`, `sans-serif`
- Features: Tabular numbers for consistent spacing

**To Change the Font:**
Edit the font-family in `app/globals.css`:
```css
.bangla-number-font,
.bangla-text .bangla-number {
  font-family: 'Your-Preferred-Font', 'Roboto', Arial, sans-serif !important;
}
```

## Examples in Components

### Hero Component
```tsx
// Before
<h1>১৫-৩০ দিন নিয়মিত ব্যবহারে ব্যথা থেকে মুক্তি</h1>

// After
<h1>
  <BanglaText>১৫-৩০ দিন নিয়মিত ব্যবহারে ব্যথা থেকে মুক্তি</BanglaText>
</h1>
```

### Order Form
```tsx
// Before
<span>৮৫০ টাকা</span>

// After  
<span><BanglaText>৮৫০ টাকা</BanglaText></span>
```

## Benefits

1. **Consistent Numbering**: All Bangla numbers use the same modern font
2. **Better Readability**: Numbers are more legible with western fonts
3. **Professional Look**: Mixed font usage creates visual hierarchy
4. **Automatic**: No manual wrapping of individual numbers needed
5. **Flexible**: Works with any HTML element or React component

## Files Updated

- `src/react-app/components/BanglaText.tsx` - Main component
- `src/lib/bangla-font-utils.ts` - Utility functions
- `app/globals.css` - CSS styles
- `src/react-app/components/Hero.tsx` - Example implementation

## Migration Guide

To update existing components:

1. Import `BanglaText` component
2. Wrap text containing Bangla numbers with `<BanglaText></BanglaText>`
3. The component will automatically handle font styling for numbers

That's it! The system will automatically detect and style Bangla numbers with the specified font while keeping all other Bangla text in the default font.