"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import {
  BarChart3,
  MapPin,
  Target,
  Map,
  Settings,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { Button } from "../ui/button";

interface NavigationItem {
  href: string;
  icon: React.ElementType;
  label: {
    en: string;
    ar: string;
    fa: string;
  };
}

export function DashboardNavigation() {
  const { currentLanguage } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const dir = getDirectionalClasses(currentLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      href: '/dashboard',
      icon: BarChart3,
      label: {
        en: 'Overview',
        ar: 'نظرة عامة',
        fa: 'نمای کلی'
      }
    },
    {
      href: '/dashboard/centers',
      icon: MapPin,
      label: {
        en: 'Centers',
        ar: 'المراكز',
        fa: 'مراکز'
      }
    },
    {
      href: '/dashboard/campaigns',
      icon: Target,
      label: {
        en: 'Campaigns',
        ar: 'الحملات',
        fa: 'کمپین ها'
      }
    },
    {
      href: '/dashboard/map',
      icon: Map,
      label: {
        en: 'Live Map',
        ar: 'الخريطة المباشرة',
        fa: 'نقشه زنده'
      }
    },
    {
      href: '/dashboard/settings',
      icon: Settings,
      label: {
        en: 'Settings',
        ar: 'الإعدادات',
        fa: 'تنظیمات'
      }
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:flex items-center space-x-1 ${
        currentLanguage === 'en' ? 'flex-row' : 'flex-row-reverse'
      }`}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              } ${currentLanguage !== 'en' ? 'flex-row-reverse' : ''}`}
            >
              <IconComponent className={`h-4 w-4 ${
                currentLanguage === 'en' ? 'mr-2' : 'ml-2'
              }`} />
              <span className={dir.textAlign}>
                {item.label[currentLanguage as keyof typeof item.label]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden relative">
        <Button
          variant="outline"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-[80px] flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-foreground hover:bg-muted"
        >
          <span>
            {currentLanguage === 'ar' ? 'القائمة' :
             currentLanguage === 'fa' ? 'منو' :
             'Menu'}
          </span>
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </Button>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg z-50">
            <div className="py-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    } ${dir.textAlign}`}
                  >
                    <IconComponent className={`h-4 w-4 ${currentLanguage === 'ar' || currentLanguage === 'fa' ? 'ml-3' : 'mr-3'}`} />
                    {item.label[currentLanguage as keyof typeof item.label]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}