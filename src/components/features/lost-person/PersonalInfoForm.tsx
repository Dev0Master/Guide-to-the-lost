import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/store/language/languageStore";
import { lostPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface FormData {
  displayName: string;
  description?: string;
  contact?: string;
}

interface PersonalInfoFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  children?: React.ReactNode; // For the map component
}

export function PersonalInfoForm({ formData, setFormData, children }: PersonalInfoFormProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);





  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="displayName" className={`${dir.textAlign} block`}>
          {t.displayName}
        </Label>
        <Input
          id="displayName"
          type="text"
          required
          className={dir.textAlign}
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          placeholder={t.displayNamePlaceholder}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="description" className={`${dir.textAlign} block`}>
          {t.shortDescription}
        </Label>
        <Input
          id="description"
          type="text"
          className={dir.textAlign}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t.shortDescriptionPlaceholder}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="contact" className={`${dir.textAlign} block`}>
          {t.contactInfo}
        </Label>
        <Input
          id="contact"
          type="text"
          className={dir.textAlign}
          value={formData.contact || ''}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          placeholder={t.contactInfoPlaceholder}
        />
      </div>
      {/* GPS Location Map */}
      {children && (
        <div className="space-y-3">
          <Label className={`${dir.textAlign} block`}>
            {t.currentLocation}
          </Label>
          {children}
        </div>
      )}
    </>
  );
}