import { type Language } from "@/store/language/languageStore";

/**
 * Utility functions for RTL/LTR responsive styling
 */

export function isRTL(language: Language): boolean {
  // English: LTR, Arabic & Persian: RTL
  return language === 'ar' || language === 'fa';
}

export function getTextAlign(language: Language): string {
  return isRTL(language) ? 'text-right' : 'text-left';
}

export function getFlexDirection(language: Language): string {
  return isRTL(language) ? 'flex-row-reverse' : 'flex-row';
}

export function getJustifyContent(language: Language, position: 'start' | 'end' | 'between' | 'center'): string {
  if (position === 'between' || position === 'center') {
    return `justify-${position}`;
  }
  
  if (isRTL(language)) {
    return position === 'start' ? 'justify-end' : 'justify-start';
  }
  return `justify-${position}`;
}

export function getMarginStart(language: Language, size: string): string {
  return isRTL(language) ? `mr-${size}` : `ml-${size}`;
}

export function getMarginEnd(language: Language, size: string): string {
  return isRTL(language) ? `ml-${size}` : `mr-${size}`;
}

export function getPaddingStart(language: Language, size: string): string {
  return isRTL(language) ? `pr-${size}` : `pl-${size}`;
}

export function getPaddingEnd(language: Language, size: string): string {
  return isRTL(language) ? `pl-${size}` : `pr-${size}`;
}

export function getDirection(language: Language): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}

/**
 * Enhanced RTL support for better Arabic experience
 */
export function getBorderRadius(language: Language, radius: 'sm' | 'md' | 'lg' | 'xl'): string {
  const baseRadius = {
    sm: 'rounded-sm',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };
  return baseRadius[radius];
}

export function getPlacement(language: Language, position: 'start' | 'end'): 'left' | 'right' {
  if (isRTL(language)) {
    return position === 'start' ? 'right' : 'left';
  }
  return position === 'start' ? 'left' : 'right';
}

export function getTransform(language: Language, transform: string): string {
  if (isRTL(language) && transform.includes('translateX')) {
    return transform.replace('translateX(', 'translateX(-').replace('translateX(-(-', 'translateX(');
  }
  return transform;
}

export function getFloatDirection(language: Language, direction: 'start' | 'end'): string {
  if (isRTL(language)) {
    return direction === 'start' ? 'float-right' : 'float-left';
  }
  return direction === 'start' ? 'float-left' : 'float-right';
}

/**
 * Enhanced comprehensive class generator for directional styling with accessibility
 */
export function getDirectionalClasses(language: Language) {
  return {
    textAlign: getTextAlign(language),
    direction: getDirection(language),
    isRTL: isRTL(language),
    flexDirection: getFlexDirection(language),
    justifyStart: getJustifyContent(language, 'start'),
    justifyEnd: getJustifyContent(language, 'end'),
    marginStart: (size: string) => getMarginStart(language, size),
    marginEnd: (size: string) => getMarginEnd(language, size),
    paddingStart: (size: string) => getPaddingStart(language, size),
    paddingEnd: (size: string) => getPaddingEnd(language, size),
    placement: (position: 'start' | 'end') => getPlacement(language, position),
    float: (direction: 'start' | 'end') => getFloatDirection(language, direction),
    transform: (transform: string) => getTransform(language, transform),
  };
}

/**
 * CSS Custom properties for RTL support
 */
export function getRTLCustomProperties(language: Language) {
  const isRtl = isRTL(language);
  return {
    '--text-align': isRtl ? 'right' : 'left',
    '--flex-direction': isRtl ? 'row-reverse' : 'row',
    '--margin-start': isRtl ? '0 var(--margin-value) 0 0' : '0 0 0 var(--margin-value)',
    '--margin-end': isRtl ? '0 0 0 var(--margin-value)' : '0 var(--margin-value) 0 0',
    '--border-start': isRtl ? 'border-right' : 'border-left',
    '--border-end': isRtl ? 'border-left' : 'border-right',
  } as React.CSSProperties;
}

/**
 * Accessibility-focused RTL classes for screen readers and navigation
 */
export function getA11yDirectionalClasses(language: Language) {
  const rtl = isRTL(language);
  return {
    // Screen reader support
    dir: getDirection(language),
    lang: language,
    
    // Navigation focus order
    tabIndex: rtl ? -1 : undefined, // Let browser handle RTL tab order
    
    // ARIA attributes for RTL
    'aria-orientation': 'horizontal',
    
    // CSS classes for enhanced RTL support
    className: [
      rtl ? 'rtl' : 'ltr',
      rtl ? 'text-right' : 'text-left',
      rtl ? 'flex-row-reverse' : 'flex-row'
    ].join(' ')
  };
}