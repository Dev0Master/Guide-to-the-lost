"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useLanguageStore, type Language } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { buttonAnimations, languageSwitchAnimations } from "@/lib/animations";

const languages = [
  { code: 'ar' as Language, name: 'العربية' },
  { code: 'en' as Language, name: 'English' },
  { code: 'fa' as Language, name: 'فارسی' },
];

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, initializeLanguage, isInitialized } = useLanguageStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dir = getDirectionalClasses(currentLanguage);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  // Don't render until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = (langCode: Language) => {
    // Animate language change
    if (contentRef.current) {
      languageSwitchAnimations.fadeContent(contentRef.current, () => {
        setLanguage(langCode);
        setIsDropdownOpen(false);
      });
    } else {
      setLanguage(langCode);
      setIsDropdownOpen(false);
    }
  };

  // Button hover animations
  const handleButtonHover = () => {
    if (buttonRef.current) {
      buttonAnimations.hover(buttonRef.current);
    }
  };

  const handleButtonLeave = () => {
    if (buttonRef.current) {
      buttonAnimations.leave(buttonRef.current);
    }
  };

  const trigger = (
    <Button
      ref={buttonRef}
      variant="outline"
      className="min-w-20 h-12 px-4 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200/60 hover:border-blue-300/80 hover:bg-blue-50/30 group"
      onMouseEnter={handleButtonHover}
      onMouseLeave={handleButtonLeave}
    >
      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200 truncate">
        {currentLang?.name}
      </span>
      <svg
        className={`w-3.5 h-3.5 ${dir.marginStart('2')} text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:rotate-180`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </Button>
  );

  return (
    <div className="fixed top-4 left-4 z-50">
      <Dropdown
        trigger={trigger}
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        align="start"
      >
        {languages.map((lang) => (
          <DropdownItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className={`
              ${currentLanguage === lang.code 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }
              transition-all duration-200
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate flex-1">
                {lang.name}
              </span>
              {currentLanguage === lang.code && (
                <svg
                  className="w-3.5 h-3.5 text-blue-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}