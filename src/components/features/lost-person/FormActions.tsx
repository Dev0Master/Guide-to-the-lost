import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language/languageStore";
import { lostPersonTranslations, getFeatureTranslations } from "@/localization";

interface FormActionsProps {
  isValid: boolean;
  isLoading?: boolean;
}

export function FormActions({ isValid, isLoading = false }: FormActionsProps) {
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Mobile layout: Register button (top) + Back button (bottom) */}
      <div className="flex flex-col gap-4 sm:hidden">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 min-w-0 px-2"
          size="lg"
        >
          <span className="text-xs sm:text-sm leading-tight">
            {isLoading ? t.submitting : t.submit}
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
          size="lg"
          disabled={isLoading}
        >
          {t.back}
        </Button>
      </div>
      
      {/* Desktop layout: Back and Register buttons horizontally */}
      <div className="hidden sm:flex sm:flex-row gap-4 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
          size="lg"
          disabled={isLoading}
        >
          {t.back}
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 min-w-0 px-2"
          size="lg"
        >
          <span className="text-xs sm:text-sm leading-tight">
            {isLoading ? t.submitting : t.submit}
          </span>
        </Button>
      </div>
    </div>
  );
}