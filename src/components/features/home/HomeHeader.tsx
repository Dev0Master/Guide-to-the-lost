import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language/languageStore";
import { homeTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface HomeHeaderProps {
  isAuthenticated: boolean;
  user?: {
    id: string;
    displayName: string;
    email: string;
    role: string;
    disabled: boolean;
  };
  onLogout: () => void;
}

export function HomeHeader({ isAuthenticated, user, onLogout }: HomeHeaderProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(homeTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);

  return (
    <header className="mb-8">
      <Card className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className={`${dir.textAlign} flex-1`}>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
            {t.appTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center leading-relaxed">
            {isAuthenticated && user ? `${t.welcomeUser} ${user.displayName}` : t.appDescription}
          </p>
          {isAuthenticated && user && (
            <p className="text-base text-center text-primary font-semibold mt-2 bg-primary/10 rounded-full px-4 py-1 inline-block">
              {user.role}
            </p>
          )}
        </div>
        {isAuthenticated && (user?.role === 'staff' || user?.role === 'main_center_staff') && (
          <Button onClick={onLogout} variant="outline" size="lg" className="min-w-[120px]">
            {t.logout}
          </Button>
        )}
      </Card>
    </header>
  );
}