import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language/languageStore";
import { homeTranslations, getFeatureTranslations } from "@/localization";

interface ServiceCardsProps {
  userRole?: string;
}

export function ServiceCards({ userRole }: ServiceCardsProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(homeTranslations, currentLanguage);

  if (!userRole) {
    // Public service cards - no cards for public users
    return null;
  }

  // Authenticated user service cards
  const cards = [];

  // Search card for searchers and staff
  if (userRole === 'searcher' || userRole === 'main_center_staff') {
    cards.push(
      <Card key="search" className="text-center hover:scale-[1.02] transition-transform duration-200">
        <h3 className="text-xl font-bold mb-3 text-foreground">{t.searchCard.title}</h3>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          {t.searchCard.description}
        </p>
        <Button className="w-full" size="lg">{t.searchCard.action}</Button>
      </Card>
    );
  }

  // Staff control panel
  if (userRole === 'main_center_staff') {
    cards.push(
      <Card key="dashboard" className="text-center hover:scale-[1.02] transition-transform duration-200">
        <h3 className="text-xl font-bold mb-3 text-foreground">{t.dashboardCard.title}</h3>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          {t.dashboardCard.description}
        </p>
        <Button className="w-full" variant="outline" size="lg">{t.dashboardCard.action}</Button>
      </Card>
    );
  }

  // Only show grid if there are cards
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 ${cards.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
      {cards}
    </div>
  );
}