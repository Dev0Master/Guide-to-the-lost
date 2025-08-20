import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language/languageStore";
import { lostPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface FormData {
  displayName: string;
  age: number;
  clothingColor: string;
  distinctiveFeature: string;
  phone: string;
  consent: boolean;
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




  const clothingColors = [
    t.colors.white,
    t.colors.black,
    t.colors.blue,
    t.colors.red,
    t.colors.green,
    t.colors.yellow,
    t.colors.brown,
    t.colors.gray
  ];

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
          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
          placeholder={t.displayNamePlaceholder}
        />
      </div>

      <div>
        <Label htmlFor="age" className={`${dir.textAlign} block mb-2`}>
          {t.age}
        </Label>
        <Input
          id="age"
          type="number"
          min="0"
          max="120"
          required
          className={dir.textAlign}
          value={formData.age || ''}
          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
          placeholder={t.agePlaceholder}
        />
      </div>

      <div>
        <Label className={`${dir.textAlign} block mb-2`}>{t.clothingColor}</Label>
        <div className="grid grid-cols-4 gap-2">
          {clothingColors.map((color) => (
            <Button
              key={color}
              type="button"
              variant={formData.clothingColor === color ? "default" : "outline"}
              onClick={() => setFormData({...formData, clothingColor: color})}
              className="text-sm"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="distinctiveFeature" className={`${dir.textAlign} block mb-2`}>
          {t.distinctiveFeature}
        </Label>
        <Input
          id="distinctiveFeature"
          type="text"
          className={dir.textAlign}
          value={formData.distinctiveFeature}
          onChange={(e) => setFormData({...formData, distinctiveFeature: e.target.value})}
          placeholder={t.distinctiveFeaturePlaceholder}
        />
      </div>

      <div>
        <Label htmlFor="phone" className={`${dir.textAlign} block mb-2`}>
          {t.phoneNumber}
        </Label>
        <Input
          id="phone"
          type="tel"
          required
          className={dir.textAlign}
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder={t.phoneNumberPlaceholder}
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