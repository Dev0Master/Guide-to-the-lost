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

  const handleButtonHover = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (ref.current) {
      buttonAnimations.hover(ref.current);
    }
  };

  const handleButtonLeave = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (ref.current) {
      buttonAnimations.leave(ref.current);
    }
  };

  const handleButtonPress = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (ref.current) {
      buttonAnimations.press(ref.current);
    }
  };

  // Button components for reusability
  const LostButton = (
    <Button 
      ref={lostButtonRef}
      size="xl" 
      className="w-full sm:w-auto min-w-[200px]"
      onClick={() => router.push('/lost-person')}
      onMouseEnter={() => handleButtonHover(lostButtonRef)}
      onMouseLeave={() => handleButtonLeave(lostButtonRef)}
      onMouseDown={() => handleButtonPress(lostButtonRef)}
    >
      {t.iAmLost}
    </Button>
  );

  const SearchButton = (
    <Button 
      ref={searchButtonRef}
      size="xl" 
      variant="outline" 
      className="w-full sm:w-auto min-w-[200px]"
      onClick={() => router.push('/find-person')}
      onMouseEnter={() => handleButtonHover(searchButtonRef)}
      onMouseLeave={() => handleButtonLeave(searchButtonRef)}
      onMouseDown={() => handleButtonPress(searchButtonRef)}
    >
      {t.searchForPerson}
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      {/* Mobile layout: I'm Lost button first (swapped as requested) */}
      <div className="flex flex-col gap-6 sm:hidden">
        {LostButton}
        {SearchButton}
      </div>
      
      {/* Desktop layout: Search button first (original order) */}
      <div className="hidden sm:flex sm:flex-row gap-6">
        {SearchButton}
        {LostButton}
      </div>
    </div>
  );
}