import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language/languageStore";
import { homeTranslations, getFeatureTranslations } from "@/localization";
import { useRef } from "react";
import { buttonAnimations } from "@/lib/animations";

export function ActionButtons() {
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(homeTranslations, currentLanguage);
  const lostButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const handleButtonHover = (ref: React.RefObject<HTMLButtonElement>) => {
    if (ref.current) {
      buttonAnimations.hover(ref.current);
    }
  };

  const handleButtonLeave = (ref: React.RefObject<HTMLButtonElement>) => {
    if (ref.current) {
      buttonAnimations.leave(ref.current);
    }
  };

  const handleButtonPress = (ref: React.RefObject<HTMLButtonElement>) => {
    if (ref.current) {
      buttonAnimations.press(ref.current);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <Button 
        ref={lostButtonRef}
        size="lg" 
        className="px-8 py-3 text-lg"
        onClick={() => router.push('/lost-person')}
        onMouseEnter={() => handleButtonHover(lostButtonRef)}
        onMouseLeave={() => handleButtonLeave(lostButtonRef)}
        onMouseDown={() => handleButtonPress(lostButtonRef)}
      >
        {t.iAmLost}
      </Button>
      <Button 
        ref={searchButtonRef}
        size="lg" 
        variant="outline" 
        className="px-8 py-3 text-lg"
        onClick={() => router.push('/find-person')}
        onMouseEnter={() => handleButtonHover(searchButtonRef)}
        onMouseLeave={() => handleButtonLeave(searchButtonRef)}
        onMouseDown={() => handleButtonPress(searchButtonRef)}
      >
        {t.searchForPerson}
      </Button>
    </div>
  );
}