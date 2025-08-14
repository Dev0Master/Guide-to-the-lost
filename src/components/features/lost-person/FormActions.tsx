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
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="flex-1"
        disabled={isLoading}
      >
        {t.back}
      </Button>
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="flex-1"
      >
        {isLoading ? t.submitting : t.submit}
      </Button>
    </div>
  );
}