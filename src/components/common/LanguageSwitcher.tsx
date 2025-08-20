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
      className="min-w-16 h-10 px-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-accent/30 group theme-transition shadow-sm hover:shadow-md transition-all duration-200"
      onMouseEnter={handleButtonHover}
      onMouseLeave={handleButtonLeave}
    >
      <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
        {currentLang?.name}
      </span>
      <svg
        className={`w-3 h-3 ${dir.marginStart('1.5')} text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:rotate-180`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </Button>
  );

  return (
    <div className="relative">
      <Dropdown
        trigger={trigger}
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        align="start"
        className="min-w-max"
      >
        {languages.map((lang) => (
          <DropdownItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className={`
              ${currentLanguage === lang.code 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-popover-foreground hover:text-primary hover:bg-accent/50'
              }
              transition-all duration-200 theme-transition
            `}
          >
            <div className="flex items-center justify-center gap-3 min-w-max">
              <span className="text-sm font-medium whitespace-nowrap">
                {lang.name}
              </span>
              {currentLanguage === lang.code && (
                <svg
                  className="w-3 h-3 text-primary flex-shrink-0"
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