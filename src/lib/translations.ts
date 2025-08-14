import type { Language } from '@/store/language/languageStore';

export interface Translations {
  // Common
  back: string;
  cancel: string;
  save: string;
  search: string;
  loading: string;
  error: string;
  success: string;
  
  // Home page
  appTitle: string;
  appDescription: string;
  employeeLogin: string;
  iAmLost: string;
  searchForPerson: string;
  registerLocation: string;
  registerLocationDesc: string;
  map: string;
  mapDesc: string;
  
  // Lost person page
  lostPersonTitle: string;
  lostPersonDesc: string;
  displayName: string;
  displayNamePlaceholder: string;
  ageRange: string;
  clothingColor: string;
  distinctiveFeature: string;
  distinctiveFeaturePlaceholder: string;
  phoneNumber: string;
  lastSeenLocation: string;
  lastSeenLocationPlaceholder: string;
  consentText: string;
  registerMyLocation: string;
  
  // Find person page
  findPersonTitle: string;
  findPersonDesc: string;
  searchInfo: string;
  searchResults: string;
  nameSearch: string;
  nameSearchPlaceholder: string;
  referencePoint: string;
  showOnMap: string;
  noResults: string;
  noResultsDesc: string;
  newSearch: string;
  showMoreResults: string;
  matchPercentage: string;
  age: string;
  clothing: string;
  lastSeen: string;
  distinctiveMark: string;
  
  // Age ranges
  under18: string;
  age18to30: string;
  age31to50: string;
  age51to70: string;
  over70: string;
  
  // Colors
  white: string;
  black: string;
  blue: string;
  red: string;
  green: string;
  yellow: string;
  brown: string;
  gray: string;
  
  // Reference points
  easternGate: string;
  westernGate: string;
  mainEntrance: string;
  prayerArea: string;
  medicalFacilities: string;
  servicesArea: string;
  
  // User info
  welcome: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  logout: string;
  
  // Roles
  lostPersonRole: string;
  searcherRole: string;
  staffRole: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    // Common
    back: 'العودة',
    cancel: 'إلغاء',
    save: 'حفظ',
    search: 'بحث',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    
    // Home page
    appTitle: 'دليل الضائعين',
    appDescription: 'منصة لمساعدة الأشخاص المفقودين والباحثين عنهم',
    employeeLogin: 'دخول الموظفين',
    iAmLost: 'أنا ضائع',
    searchForPerson: 'البحث عن شخص مفقود',
    registerLocation: 'تسجيل موقعي',
    registerLocationDesc: 'سجل موقعك الحالي ليتمكن الآخرون من العثور عليك',
    map: 'الخريطة',
    mapDesc: 'عرض الخريطة التفاعلية للمنطقة',
    
    // Lost person page
    lostPersonTitle: 'تسجيل شخص ضائع',
    lostPersonDesc: 'سجل معلوماتك لمساعدة الآخرين في العثور عليك',
    displayName: 'الاسم أو الكنية *',
    displayNamePlaceholder: 'الاسم الذي تريد عرضه',
    ageRange: 'الفئة العمرية *',
    clothingColor: 'لون الملابس العلوية *',
    distinctiveFeature: 'علامة مميزة (اختياري)',
    distinctiveFeaturePlaceholder: 'مثل: نظارة، عكاز، حقيبة حمراء...',
    phoneNumber: 'رقم الهاتف *',
    lastSeenLocation: 'آخر مكان كنت فيه',
    lastSeenLocationPlaceholder: 'مثل: بوابة الحرم، المدخل الشرقي...',
    consentText: 'أوافق على عرض معلوماتي المحدودة على الخريطة المشتركة لمساعدة الباحثين في العثور علي. لن يتم مشاركة رقم هاتفي إلا مع الأشخاص المخولين.',
    registerMyLocation: 'تسجيل موقعي',
    
    // Find person page
    findPersonTitle: 'البحث عن شخص مفقود',
    findPersonDesc: 'ابحث عن الأشخاص المفقودين باستخدام المعلومات المتاحة',
    searchInfo: 'معلومات البحث',
    searchResults: 'نتائج البحث',
    nameSearch: 'الاسم (يمكن كتابته جزئياً)',
    nameSearchPlaceholder: 'مثل: أحمد، محمد، فاطمة...',
    referencePoint: 'النقطة المرجعية',
    showOnMap: 'عرض على الخريطة',
    noResults: 'لم يتم العثور على نتائج مطابقة',
    noResultsDesc: 'قم بإدخال معلومات البحث للعثور على الأشخاص المفقودين',
    newSearch: 'بحث جديد',
    showMoreResults: 'عرض المزيد من النتائج',
    matchPercentage: 'مطابقة',
    age: 'العمر',
    clothing: 'لون الملابس',
    lastSeen: 'آخر مكان',
    distinctiveMark: 'علامة مميزة',
    
    // Age ranges
    under18: 'أقل من 18 سنة',
    age18to30: '18-30 سنة',
    age31to50: '31-50 سنة',
    age51to70: '51-70 سنة',
    over70: 'أكبر من 70 سنة',
    
    // Colors
    white: 'أبيض',
    black: 'أسود',
    blue: 'أزرق',
    red: 'أحمر',
    green: 'أخضر',
    yellow: 'أصفر',
    brown: 'بني',
    gray: 'رمادي',
    
    // Reference points
    easternGate: 'بوابة الحرم الشرقية',
    westernGate: 'بوابة الحرم الغربية',
    mainEntrance: 'المدخل الرئيسي',
    prayerArea: 'ساحة الصلاة',
    medicalFacilities: 'المرافق الطبية',
    servicesArea: 'منطقة الخدمات',
    
    // User info
    welcome: 'مرحباً',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    role: 'الدور',
    phone: 'رقم الهاتف',
    logout: 'تسجيل خروج',
    
    // Roles
    lostPersonRole: 'أنا ضائع',
    searcherRole: 'أنا أبحث عن ضائع',
    staffRole: 'موظف المركز الرئيسي',
  },
  
  en: {
    // Common
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Home page
    appTitle: 'Guidance For Lost',
    appDescription: 'Platform to help missing persons and their searchers',
    employeeLogin: 'Staff Login',
    iAmLost: 'I Am Lost',
    searchForPerson: 'Search for Missing Person',
    registerLocation: 'Register My Location',
    registerLocationDesc: 'Register your current location so others can find you',
    map: 'Map',
    mapDesc: 'View interactive map of the area',
    
    // Lost person page
    lostPersonTitle: 'Register Lost Person',
    lostPersonDesc: 'Register your information to help others find you',
    displayName: 'Display Name or Alias *',
    displayNamePlaceholder: 'Name you want to display',
    ageRange: 'Age Range *',
    clothingColor: 'Upper Clothing Color *',
    distinctiveFeature: 'Distinctive Feature (Optional)',
    distinctiveFeaturePlaceholder: 'e.g: glasses, cane, red bag...',
    phoneNumber: 'Phone Number *',
    lastSeenLocation: 'Last Seen Location',
    lastSeenLocationPlaceholder: 'e.g: Shrine gate, Eastern entrance...',
    consentText: 'I consent to displaying my limited information on the shared map to help searchers find me. My phone number will only be shared with authorized personnel.',
    registerMyLocation: 'Register My Location',
    
    // Find person page
    findPersonTitle: 'Search for Missing Person',
    findPersonDesc: 'Search for missing persons using available information',
    searchInfo: 'Search Information',
    searchResults: 'Search Results',
    nameSearch: 'Name (can be partial)',
    nameSearchPlaceholder: 'e.g: Ahmed, Mohammad, Fatima...',
    referencePoint: 'Reference Point',
    showOnMap: 'Show on Map',
    noResults: 'No matching results found',
    noResultsDesc: 'Enter search information to find missing persons',
    newSearch: 'New Search',
    showMoreResults: 'Show More Results',
    matchPercentage: 'Match',
    age: 'Age',
    clothing: 'Clothing Color',
    lastSeen: 'Last Seen',
    distinctiveMark: 'Distinctive Mark',
    
    // Age ranges
    under18: 'Under 18 years',
    age18to30: '18-30 years',
    age31to50: '31-50 years',
    age51to70: '51-70 years',
    over70: 'Over 70 years',
    
    // Colors
    white: 'White',
    black: 'Black',
    blue: 'Blue',
    red: 'Red',
    green: 'Green',
    yellow: 'Yellow',
    brown: 'Brown',
    gray: 'Gray',
    
    // Reference points
    easternGate: 'Eastern Shrine Gate',
    westernGate: 'Western Shrine Gate',
    mainEntrance: 'Main Entrance',
    prayerArea: 'Prayer Area',
    medicalFacilities: 'Medical Facilities',
    servicesArea: 'Services Area',
    
    // User info
    welcome: 'Welcome',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    phone: 'Phone Number',
    logout: 'Logout',
    
    // Roles
    lostPersonRole: 'I am lost',
    searcherRole: 'I am looking for someone lost',
    staffRole: 'Main Center Staff',
  },
  
  fa: {
    // Common
    back: 'بازگشت',
    cancel: 'لغو',
    save: 'ذخیره',
    search: 'جستجو',
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    success: 'موفقیت',
    
    // Home page
    appTitle: 'راهنمای گمشدگان',
    appDescription: 'پلتفرم کمک به افراد گمشده و جستجوگران آنها',
    employeeLogin: 'ورود کارکنان',
    iAmLost: 'من گم شده‌ام',
    searchForPerson: 'جستجوی فرد گمشده',
    registerLocation: 'ثبت موقعیت من',
    registerLocationDesc: 'موقعیت فعلی خود را ثبت کنید تا دیگران شما را پیدا کنند',
    map: 'نقشه',
    mapDesc: 'مشاهده نقشه تعاملی منطقه',
    
    // Lost person page
    lostPersonTitle: 'ثبت فرد گمشده',
    lostPersonDesc: 'اطلاعات خود را ثبت کنید تا دیگران شما را پیدا کنند',
    displayName: 'نام نمایشی یا لقب *',
    displayNamePlaceholder: 'نامی که می‌خواهید نمایش داده شود',
    ageRange: 'بازه سنی *',
    clothingColor: 'رنگ لباس بالایی *',
    distinctiveFeature: 'ویژگی متمایز (اختیاری)',
    distinctiveFeaturePlaceholder: 'مثل: عینک، عصا، کیف قرمز...',
    phoneNumber: 'شماره تلفن *',
    lastSeenLocation: 'آخرین مکان دیده شده',
    lastSeenLocationPlaceholder: 'مثل: دروازه حرم، ورودی شرقی...',
    consentText: 'موافقم که اطلاعات محدود من در نقشه مشترک نمایش داده شود تا جستجوگران مرا پیدا کنند. شماره تلفن من فقط با افراد مجاز به اشتراک گذاشته می‌شود.',
    registerMyLocation: 'ثبت موقعیت من',
    
    // Find person page
    findPersonTitle: 'جستجوی فرد گمشده',
    findPersonDesc: 'با استفاده از اطلاعات موجود افراد گمشده را جستجو کنید',
    searchInfo: 'اطلاعات جستجو',
    searchResults: 'نتایج جستجو',
    nameSearch: 'نام (می‌تواند جزئی باشد)',
    nameSearchPlaceholder: 'مثل: احمد، محمد، فاطمه...',
    referencePoint: 'نقطه مرجع',
    showOnMap: 'نمایش در نقشه',
    noResults: 'هیچ نتیجه مطابقی یافت نشد',
    noResultsDesc: 'اطلاعات جستجو را وارد کنید تا افراد گمشده را پیدا کنید',
    newSearch: 'جستجوی جدید',
    showMoreResults: 'نمایش نتایج بیشتر',
    matchPercentage: 'تطبیق',
    age: 'سن',
    clothing: 'رنگ لباس',
    lastSeen: 'آخرین بار دیده شده',
    distinctiveMark: 'علامت متمایز',
    
    // Age ranges
    under18: 'زیر ۱۸ سال',
    age18to30: '۱۸-۳۰ سال',
    age31to50: '۳۱-۵۰ سال',
    age51to70: '۵۱-۷۰ سال',
    over70: 'بالای ۷۰ سال',
    
    // Colors
    white: 'سفید',
    black: 'سیاه',
    blue: 'آبی',
    red: 'قرمز',
    green: 'سبز',
    yellow: 'زرد',
    brown: 'قهوه‌ای',
    gray: 'خاکستری',
    
    // Reference points
    easternGate: 'دروازه شرقی حرم',
    westernGate: 'دروازه غربی حرم',
    mainEntrance: 'ورودی اصلی',
    prayerArea: 'محوطه نماز',
    medicalFacilities: 'تسهیلات پزشکی',
    servicesArea: 'منطقه خدمات',
    
    // User info
    welcome: 'خوش آمدید',
    name: 'نام',
    email: 'ایمیل',
    role: 'نقش',
    phone: 'شماره تلفن',
    logout: 'خروج',
    
    // Roles
    lostPersonRole: 'من گم شده‌ام',
    searcherRole: 'من به دنبال فرد گمشده می‌گردم',
    staffRole: 'کارکنان مرکز اصلی',
  },
};

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language]?.[key] || translations['ar'][key] || key;
}

export function useTranslations(language: Language): Translations {
  return translations[language] || translations['ar'];
}

export default translations;