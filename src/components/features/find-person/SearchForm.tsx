import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface SearchData {
  name: string;
  description?: string;
  contact?: string;
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






  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="name" className={`${dir.textAlign} block`}>
          {t.nameSearch}
        </Label>
        <Input
          id="name"
          type="text"
          className={dir.textAlign}
          value={searchData.name}
          onChange={(e) => setSearchData({ ...searchData, name: e.target.value })}
          placeholder={t.nameSearchPlaceholder}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="description" className={`${dir.textAlign} block`}>
          {currentLanguage === 'ar' ? 'وصف قصير (اختياري)' : currentLanguage === 'en' ? 'Short Description (optional)' : 'توضیح کوتاه (اختیاری)'}
        </Label>
        <Input
          id="description"
          type="text"
          className={dir.textAlign}
          value={searchData.description || ''}
          onChange={(e) => setSearchData({ ...searchData, description: e.target.value })}
          placeholder={currentLanguage === 'ar' ? 'مثال: أرتدي نظارة' : currentLanguage === 'en' ? 'e.g. wearing glasses' : 'مثلاً عینک دارم'}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="contact" className={`${dir.textAlign} block`}>
          {currentLanguage === 'ar' ? 'رقم للتواصل (اختياري)' : currentLanguage === 'en' ? 'Contact (optional)' : 'شماره تماس (اختیاری)'}
        </Label>
        <Input
          id="contact"
          type="text"
          className={dir.textAlign}
          value={searchData.contact || ''}
          onChange={(e) => setSearchData({ ...searchData, contact: e.target.value })}
          placeholder={currentLanguage === 'ar' ? 'مثال: 0501234567' : currentLanguage === 'en' ? 'e.g. 0501234567' : 'مثلاً 09121234567'}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Mobile layout: Search button (top) + Back button (bottom) */}
        <div className="flex flex-col gap-4 sm:hidden">
          <Button type="submit" className="flex-1" size="lg">
            {t.search}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
            size="lg"
          >
            {t.back}
          </Button>
        </div>
        
        {/* Desktop layout: Back and Search buttons horizontally */}
        <div className="hidden sm:flex sm:flex-row gap-4 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
            size="lg"
          >
            {t.back}
          </Button>
          <Button type="submit" className="flex-1" size="lg">
            {t.search}
          </Button>
        </div>
      </div>
    </form>
  );
}