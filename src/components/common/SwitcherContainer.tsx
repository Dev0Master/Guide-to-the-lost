"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth/authStore";
import { useLanguageStore } from "@/store/language/languageStore";
import { homeTranslations, getFeatureTranslations } from "@/localization";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { DashboardNavigation } from "./DashboardNavigation";

export function SwitcherContainer() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const { currentLanguage } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const t = getFeatureTranslations(homeTranslations, currentLanguage);

  // Check if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard');

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-sm theme-transition">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between" style={{ direction: 'ltr' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            
            {/* Show dashboard navigation only on dashboard pages and when authenticated */}
            {isDashboardPage && isAuthenticated && (
              <>
                <DashboardNavigation />
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="text-white"
              >
                {t.logout}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}