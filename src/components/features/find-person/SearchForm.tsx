import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface SearchData {
  name: string;
  age: number;
  clothingColor: string;
  gender: string;
  lastSeenArea: string;
  marker: string;
}

interface SearchFormProps {
  searchData: SearchData;
  setSearchData: (data: SearchData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchForm({ searchData, setSearchData, onSubmit }: SearchFormProps) {
  const router = useRouter();
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(findPersonTranslations, currentLanguage);
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className={`${dir.textAlign} block mb-2`}>
          {t.nameSearch}
        </Label>
        <Input
          id="name"
          type="text"
          className={dir.textAlign}
          value={searchData.name}
          onChange={(e) => setSearchData({...searchData, name: e.target.value})}
          placeholder={t.nameSearchPlaceholder}
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
          className={dir.textAlign}
          value={searchData.age || ''}
          onChange={(e) => setSearchData({...searchData, age: parseInt(e.target.value) || 0})}
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
              variant={searchData.clothingColor === color ? "default" : "outline"}
              onClick={() => setSearchData({...searchData, clothingColor: color})}
              className="text-sm"
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="marker" className={`${dir.textAlign} block mb-2`}>
          {t.marker || (currentLanguage === 'ar' ? 'علامة مميزة' : 'Marker')}
        </Label>
        <Input
          id="marker"
          type="text"
          className={dir.textAlign}
          value={searchData.marker}
          onChange={(e) => setSearchData({...searchData, marker: e.target.value})}
          placeholder={t.markerPlaceholder || (currentLanguage === 'ar' ? 'أدخل علامة مميزة للشخص' : 'Enter a distinctive marker for the person')}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          {t.back}
        </Button>
        <Button type="submit" className="flex-1">
          {t.search}
        </Button>
      </div>
    </form>
  );
}