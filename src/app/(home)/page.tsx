"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <HomeHeader 
            isAuthenticated={false}
            onLogout={handleLogout}
          />

          <main className="space-y-8">
            <Card className="text-center">
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
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
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <HomeHeader 
            isAuthenticated={false}
            onLogout={handleLogout}
          />

          <main className="space-y-8">
            <Card className="text-center">
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
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
    <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
      <div className="text-center">
        <Card className="p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {t.appTitle}
            </h2>
            <p className="text-muted-foreground">
              Welcome back! Please go to your dashboard to continue.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="min-w-[200px]"
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
