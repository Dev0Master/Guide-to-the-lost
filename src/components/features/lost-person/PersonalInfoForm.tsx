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
      <div>
        <Label htmlFor="displayName" className={`${dir.textAlign} block mb-2`}>
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
      <div>
        <Label htmlFor="description" className={`${dir.textAlign} block mb-2`}>
          {currentLanguage === 'ar' ? 'وصف قصير (اختياري)' : currentLanguage === 'en' ? 'Short Description (optional)' : 'توضیح کوتاه (اختیاری)'}
        </Label>
        <Input
          id="description"
          type="text"
          className={dir.textAlign}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={currentLanguage === 'ar' ? 'مثال: أرتدي نظارة' : currentLanguage === 'en' ? 'e.g. wearing glasses' : 'مثلاً عینک دارم'}
        />
      </div>
      <div>
        <Label htmlFor="contact" className={`${dir.textAlign} block mb-2`}>
          {currentLanguage === 'ar' ? 'رقم للتواصل (اختياري)' : currentLanguage === 'en' ? 'Contact (optional)' : 'شماره تماس (اختیاری)'}
        </Label>
        <Input
          id="contact"
          type="text"
          className={dir.textAlign}
          value={formData.contact || ''}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          placeholder={currentLanguage === 'ar' ? 'مثال: 0501234567' : currentLanguage === 'en' ? 'e.g. 0501234567' : 'مثلاً 09121234567'}
        />
      </div>
      {/* GPS Location Map */}
      {children && (
        <div>
          <Label className={`${dir.textAlign} block mb-2`}>
            {currentLanguage === 'ar' ? 'موقعك الحالي' :
              currentLanguage === 'en' ? 'Your Current Location' :
                'موقعیت فعلی شما'}
          </Label>
          {children}
        </div>
      )}
    </>
  );
}