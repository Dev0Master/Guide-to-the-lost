import { useLanguageStore } from "@/store/language/languageStore";
import { homeTranslations, getFeatureTranslations } from "@/localization";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
  disabled: boolean;
}

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(homeTranslations, currentLanguage);


  return (
    <>
      <h2 className="text-xl font-semibold">
        {t.userInfoTitle}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {t.name}
          </label>
          <p className="text-foreground">{user.displayName}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {t.email}
          </label>
          <p className="text-foreground">{user.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {t.role}
          </label>
          <p className="text-foreground">{user.role}</p>
        </div>
      </div>
    </>
  );
}