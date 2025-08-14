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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <HomeHeader 
            isAuthenticated={false}
            onLogout={handleLogout}
          />

          <main className="space-y-6">
            <Card className="p-8">
              <div className="text-center space-y-6">
                <p className="text-lg text-gray-700 mb-6">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <HomeHeader 
            isAuthenticated={false}
            onLogout={handleLogout}
          />

          <main className="space-y-6">
            <Card className="p-8">
              <div className="text-center space-y-6">
                <p className="text-lg text-gray-700 mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <HomeHeader 
          isAuthenticated={true}
          user={user}
          onLogout={handleLogout}
        />

        <main className="space-y-6">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <p className="text-lg text-gray-700 mb-6">
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
