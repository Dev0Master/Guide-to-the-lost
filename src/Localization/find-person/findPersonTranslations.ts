export interface FindPersonTranslations {
  // Header
  title: string;
  description: string;

  // Search form
  searchInfoTitle: string;
  nameSearch: string;
  nameSearchPlaceholder: string;
  age: string;
  agePlaceholder: string;
  clothingColor: string;
  marker: string;
  markerPlaceholder: string;
  back: string;
  search: string;


  // Colors
  colors: {
    white: string;
    black: string;
    blue: string;
    red: string;
    green: string;
    yellow: string;
    brown: string;
    gray: string;
  };


  // Search results
  searchResultsTitle: string;
  noSearchMessage: string;
  noResultsMessage: string;
  newSearch: string;
  matchPercentage: string;
  showMoreResults: string;
  showOnMap: string;

  // Result details
  clothing: string;
  lastSeen: string;
  distinctiveMark: string;

  // Search validation and errors
  searchValidation: {
    enterSearchCriteria: string;
    offlineSearch: string;
    offlineSearchResults: string;
    noMatchingResults: string;
    connectionIssues: string;
    unexpectedError: string;
  };

  // Session management
  session: {
  missingPersonId: string;
  missingHelperId: string;
  sessionStarted: string;
  connectedToLostPerson: string;
  sessionCreateError: string;
  sessionStartError: string;
  alreadyActiveSession: string;
  };
}

export const findPersonTranslations: Record<'ar' | 'en' | 'fa', FindPersonTranslations> = {
  ar: {
    // Header
    title: 'البحث عن شخص مفقود',
    description: 'ابحث عن الأشخاص المفقودين باستخدام المعلومات المتاحة',

    // Search form
    searchInfoTitle: 'معلومات البحث',
    nameSearch: 'الاسم (يمكن كتابته جزئياً)',
    nameSearchPlaceholder: 'مثل: أحمد، محمد، فاطمة...',
    age: 'العمر',
    agePlaceholder: 'أدخل العمر بالسنوات',
    clothingColor: 'لون الملابس',
    marker: 'علامة مميزة',
    markerPlaceholder: 'أدخل علامة مميزة للشخص (مثل: وشم، ندبة، إكسسوار...)',
    back: 'العودة',
    search: 'بحث',


    // Colors
    colors: {
      white: 'أبيض',
      black: 'أسود',
      blue: 'أزرق',
      red: 'أحمر',
      green: 'أخضر',
      yellow: 'أصفر',
      brown: 'بني',
      gray: 'رمادي'
    },


    // Search results
    searchResultsTitle: 'نتائج البحث',
    noSearchMessage: 'قم بإدخال معلومات البحث للعثور على الأشخاص المفقودين',
    noResultsMessage: 'لم يتم العثور على نتائج مطابقة',
    newSearch: 'بحث جديد',
    matchPercentage: 'مطابقة',
    showMoreResults: 'عرض المزيد من النتائج',
    showOnMap: 'عرض على الخريطة',

    // Result details
    clothing: 'لون الملابس',
    lastSeen: 'آخر مكان',
    distinctiveMark: 'علامة مميزة',

    // Search validation and errors
    searchValidation: {
      enterSearchCriteria: 'يرجى إدخال الاسم أو وصف أو رقم للتواصل للبحث',
      offlineSearch: 'تم استخدام البحث المحلي. قد لا تكون النتائج محدثة.',
      offlineSearchResults: 'تم استخدام البحث المحلي بسبب مشكلة في الاتصال.',
      noMatchingResults: 'لا توجد نتائج مطابقة لمعايير البحث.',
      connectionIssues: 'فشل في الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.',
      unexpectedError: 'حدث خطأ غير متوقع أثناء البحث.',
    },

    // Session management
    session: {
  missingPersonId: 'معرف الشخص المفقود غير متوفر.',
  missingHelperId: 'معرف المساعد غير متوفر.',
  sessionStarted: 'نجح بدء الجلسة!',
  connectedToLostPerson: 'تم الاتصال بالشخص المفقود',
  sessionCreateError: 'فشل في إنشاء معرف الجلسة',
  sessionStartError: 'فشل في بدء الجلسة. يرجى المحاولة.',
  alreadyActiveSession: 'هناك جلسة نشطة بالفعل لهذا المفقود. تم ربطك بالجلسة الحالية.'
    },
  },

  en: {
    // Header
    title: 'Search for Missing Person',
    description: 'Search for missing persons using available information',

    // Search form
    searchInfoTitle: 'Search Information',
    nameSearch: 'Name (can be partial)',
    nameSearchPlaceholder: 'e.g: Ahmed, Mohammad, Fatima...',
    age: 'Age',
    agePlaceholder: 'Enter age in years',
    clothingColor: 'Clothing Color',
    marker: 'Distinctive Marker',
    markerPlaceholder: 'Enter a distinctive marker (e.g: tattoo, scar, accessory...)',
    back: 'Back',
    search: 'Search',


    // Colors
    colors: {
      white: 'White',
      black: 'Black',
      blue: 'Blue',
      red: 'Red',
      green: 'Green',
      yellow: 'Yellow',
      brown: 'Brown',
      gray: 'Gray'
    },


    // Search results
    searchResultsTitle: 'Search Results',
    noSearchMessage: 'Enter search information to find missing persons',
    noResultsMessage: 'No matching results found',
    newSearch: 'New Search',
    matchPercentage: 'Match',
    showMoreResults: 'Show More Results',
    showOnMap: 'Show on Map',

    // Result details
    clothing: 'Clothing Color',
    lastSeen: 'Last Seen',
    distinctiveMark: 'Distinctive Mark',

    // Search validation and errors
    searchValidation: {
      enterSearchCriteria: 'Please enter a name, description, or contact to search.',
      offlineSearch: 'Using offline search. Results may not be up to date.',
      offlineSearchResults: 'Using offline search due to connection issues.',
      noMatchingResults: 'No results match your search criteria.',
      connectionIssues: 'Failed to connect to server. Please check your internet connection.',
      unexpectedError: 'An unexpected error occurred during search.',
    },

    // Session management
    session: {
  missingPersonId: 'Lost person ID is missing.',
  missingHelperId: 'Helper ID is missing.',
  sessionStarted: 'Session started successfully!',
  connectedToLostPerson: 'Connected to lost person',
  sessionCreateError: 'Failed to create session ID',
  sessionStartError: 'Failed to start session. Please try again.',
  alreadyActiveSession: 'A session for this lost person is already active. You have been connected to the existing session.'
    },
  },

  fa: {
    // Header
    title: 'جستجوی فرد گمشده',
    description: 'با استفاده از اطلاعات موجود افراد گمشده را جستجو کنید',

    // Search form
    searchInfoTitle: 'اطلاعات جستجو',
    nameSearch: 'نام (می‌تواند جزئی باشد)',
    nameSearchPlaceholder: 'مثل: احمد، محمد، فاطمه...',
    age: 'سن',
    agePlaceholder: 'سن را به سال وارد کنید',
    clothingColor: 'رنگ لباس',
    marker: 'نشانه مشخص',
    markerPlaceholder: 'یک نشانه مشخص وارد کنید (مثل: خالکوبی، جای زخم، زیورآلات...)',
    back: 'بازگشت',
    search: 'جستجو',


    // Colors
    colors: {
      white: 'سفید',
      black: 'سیاه',
      blue: 'آبی',
      red: 'قرمز',
      green: 'سبز',
      yellow: 'زرد',
      brown: 'قهوه‌ای',
      gray: 'خاکستری'
    },


    // Search results
    searchResultsTitle: 'نتایج جستجو',
    noSearchMessage: 'اطلاعات جستجو را وارد کنید تا افراد گمشده را پیدا کنید',
    noResultsMessage: 'هیچ نتیجه مطابقی یافت نشد',
    newSearch: 'جستجوی جدید',
    matchPercentage: 'تطبیق',
    showMoreResults: 'نمایش نتایج بیشتر',
    showOnMap: 'نمایش در نقشه',

    // Result details
    clothing: 'رنگ لباس',
    lastSeen: 'آخرین بار دیده شده',
    distinctiveMark: 'علامت متمایز',

    // Search validation and errors
    searchValidation: {
      enterSearchCriteria: 'لطفاً نام، توضیحات یا شماره تماس را برای جستجو وارد کنید.',
      offlineSearch: 'استفاده از جستجوی آفلاین. نتایج ممکن است به‌روز نباشند.',
      offlineSearchResults: 'استفاده از جستجوی آفلاین به دلیل مشکلات اتصال.',
      noMatchingResults: 'هیچ نتیجه‌ای با معیارهای جستجوی شما مطابقت ندارد.',
      connectionIssues: 'اتصال به سرور ناموفق. لطفاً اتصال اینترنت خود را بررسی کنید.',
      unexpectedError: 'خطای غیرمنتظره‌ای در طول جستجو رخ داد.',
    },

    // Session management
    session: {
  missingPersonId: 'شناسه فرد گمشده موجود نیست.',
  missingHelperId: 'شناسه کمک‌کننده موجود نیست.',
  sessionStarted: 'جلسه با موفقیت شروع شد!',
  connectedToLostPerson: 'به فرد گمشده متصل شد',
  sessionCreateError: 'ایجاد شناسه جلسه ناموفق',
  sessionStartError: 'شروع جلسه ناموفق. لطفاً دوباره امتحان کنید.',
  alreadyActiveSession: 'یک جلسه برای این فرد گمشده در حال حاضر فعال است. شما به جلسه موجود متصل شده‌اید.'
    },
  }
};