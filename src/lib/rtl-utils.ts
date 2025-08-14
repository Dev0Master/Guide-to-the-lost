import { type Language } from "@/store/language/languageStore";

/**
 * Utility functions for RTL/LTR responsive styling
 */

export function isRTL(language: Language): boolean {
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
 * Comprehensive class generator for directional styling
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
  };
}