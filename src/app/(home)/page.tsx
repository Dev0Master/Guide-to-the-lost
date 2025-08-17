"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth/authStore";
import { useHydrated } from "@/hooks/useHydrated";
import { useLanguageStore } from "@/store/language/languageStore";
import { homeTranslations, getFeatureTranslations } from "@/localization";
import { HomeHeader } from "@/components/features/home/HomeHeader";
import { ActionButtons } from "@/components/features/home/ActionButtons";
import { UserInfo } from "@/components/features/home/UserInfo";
import { ServiceCards } from "@/components/features/home/ServiceCards";

export default function HomePage() {
  const { user, isAuthenticated, clearAuth, initAuth } = useAuthStore();
  const { currentLanguage, initializeLanguage, isInitialized } = useLanguageStore();
  const router = useRouter();
  const isHydrated = useHydrated();
  const t = getFeatureTranslations(homeTranslations, currentLanguage);

  useEffect(() => {
    initAuth();
    initializeLanguage();
  }, [initAuth, initializeLanguage]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  // Show loading state during hydration and language initialization to prevent mismatch
  if (!isHydrated || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <HomeHeader 
            isAuthenticated={false}
            onLogout={handleLogout}
          />

          <main className="space-y-8">
            <Card className="text-center">
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  {t.welcomeMessage}
                </p>
                <ActionButtons />
              </div>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Show public interface if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <HomeHeader 
            isAuthenticated={false}
            onLogout={handleLogout}
          />

          <main className="space-y-8">
            <Card className="text-center">
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  {t.welcomeMessage}
                </p>
                <ActionButtons />
              </div>
            </Card>

            <ServiceCards />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <HomeHeader 
          isAuthenticated={true}
          user={user}
          onLogout={handleLogout}
        />

        <main className="space-y-8">
          <Card className="text-center">
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                {t.welcomeMessage}
              </p>
              <ActionButtons />
              <UserInfo user={user} />
            </div>
          </Card>

          <ServiceCards userRole={user.role} />
        </main>
      </div>
    </div>
  );
}
