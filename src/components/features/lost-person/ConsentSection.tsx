import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/store/language/languageStore";
import { lostPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface ConsentSectionProps {
  consent: boolean;
  setConsent: (consent: boolean) => void;
  trackingEnabled: boolean;
  setTrackingEnabled: (trackingEnabled: boolean) => void;
}

export function ConsentSection({ consent, setConsent, trackingEnabled, setTrackingEnabled }: ConsentSectionProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);

  return (
    <div className="space-y-4">
      <div className="border p-4 rounded-lg bg-yellow-50">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <Label htmlFor="consent" className={`${dir.textAlign} text-sm text-gray-700`}>
            {t.consentText}
          </Label>
        </div>
      </div>
      
      <div className="border p-4 rounded-lg bg-blue-50">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="tracking"
            checked={trackingEnabled}
            onChange={(e) => setTrackingEnabled(e.target.checked)}
            className="mt-1"
          />
          <Label htmlFor="tracking" className={`${dir.textAlign} text-sm text-gray-700`}>
            {t.trackingConsentText}
          </Label>
        </div>
        {trackingEnabled && (
          <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-400">
            <p className={`text-xs text-gray-600 ${dir.textAlign}`}>
              {t.trackingEnabledInfo}
            </p>
          </div>
        )}
      </div>
    </div>
  );}