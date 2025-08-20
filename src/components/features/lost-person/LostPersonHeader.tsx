import { Card } from "@/components/ui/card";
import { useLanguageStore } from "@/store/language/languageStore";
import { lostPersonTranslations, getFeatureTranslations } from "@/localization";

export function LostPersonHeader() {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);

  return (
    <header className="mb-8">
      <Card className="text-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>
      </Card>
    </header>
  );
}