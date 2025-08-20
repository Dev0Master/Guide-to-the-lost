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
      <Card className="p-6 flex justify-between items-center">
        <div className={dir.textAlign}>
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {t.appTitle}
          </h1>
          <p className="text-gray-600">
            {isAuthenticated && user ? `${t.welcomeUser} ${user.displayName}` : t.appDescription}
          </p>
          {isAuthenticated && user && (
            <p className="text-sm text-center text-blue-600 font-medium">
              {user.role}
            </p>
          )}
        </div>
        {isAuthenticated && (user?.role === 'staff' || user?.role === 'main_center_staff') && (
          <Button onClick={onLogout} variant="outline">
            {t.logout}
          </Button>
        )}
      </Card>
    </header>
  );
}