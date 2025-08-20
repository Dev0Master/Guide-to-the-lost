export interface UITranslations {
  // Loading component
  loading: string;
  loadingEllipsis: string;
  loadingDefault: string;

  // Form labels and validation
  required: string;
  requiredFieldTooltip: string;

  // Alert dialog
  ok: string;
  cancel: string;

  // Icon aria labels
  icons: {
    emergency: string;
    location: string;
    person: string;
    search: string;
    phone: string;
    checkCircle: string;
    xCircle: string;
    info: string;
    arrowLeft: string;
    arrowRight: string;
    home: string;
    map: string;
    navigation: string;
    screenReader: string;
  };

  // Content view
  search: {
    placeholder: string;
  };
  categories: {
    all: string;
  };

  // Common UI text
  selectFruit: string;
  apple: string;
  banana: string;
  blueberry: string;
  grapes: string;
  pineapple: string;

  // Generic states
  connected: string;
  disconnected: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  hide: string;
  show: string;
  previous: string;
  next: string;
}

export const uiTranslations: Record<'ar' | 'en' | 'fa', UITranslations> = {
  ar: {
    // Loading component
    loading: 'جارٍ التحميل',
    loadingEllipsis: 'جارٍ التحميل...',
    loadingDefault: 'جارٍ التحميل',

    // Form labels and validation
    required: 'مطلوب',
    requiredFieldTooltip: 'هذا الحقل مطلوب',

    // Alert dialog
    ok: 'موافق',
    cancel: 'إلغاء',

    // Icon aria labels
    icons: {
      emergency: 'طوارئ',
      location: 'موقع',
      person: 'شخص',
      search: 'بحث',
      phone: 'هاتف',
      checkCircle: 'تم بنجاح',
      xCircle: 'خطأ',
      info: 'معلومات',
      arrowLeft: 'السابق',
      arrowRight: 'التالي',
      home: 'الرئيسية',
      map: 'خريطة',
      navigation: 'ملاحة',
      screenReader: 'أيقونة',
    },

    // Content view
    search: {
      placeholder: 'ابحث هنا',
    },
    categories: {
      all: 'كل التصنيفات',
    },

    // Common UI text
    selectFruit: 'اختر فاكهة',
    apple: 'تفاح',
    banana: 'موز',
    blueberry: 'توت أزرق',
    grapes: 'عنب',
    pineapple: 'أناناس',

    // Generic states
    connected: 'متصل',
    disconnected: 'غير متصل',
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    hide: 'إخفاء',
    show: 'إظهار',
    previous: 'السابق',
    next: 'التالي',
  },

  en: {
    // Loading component
    loading: 'Loading',
    loadingEllipsis: 'Loading...',
    loadingDefault: 'Loading',

    // Form labels and validation
    required: 'Required',
    requiredFieldTooltip: 'This field is required',

    // Alert dialog
    ok: 'OK',
    cancel: 'Cancel',

    // Icon aria labels
    icons: {
      emergency: 'Emergency',
      location: 'Location',
      person: 'Person',
      search: 'Search',
      phone: 'Phone',
      checkCircle: 'Success',
      xCircle: 'Error',
      info: 'Information',
      arrowLeft: 'Previous',
      arrowRight: 'Next',
      home: 'Home',
      map: 'Map',
      navigation: 'Navigation',
      screenReader: 'Icon',
    },

    // Content view
    search: {
      placeholder: 'Search here',
    },
    categories: {
      all: 'All Categories',
    },

    // Common UI text
    selectFruit: 'Select a fruit',
    apple: 'Apple',
    banana: 'Banana',
    blueberry: 'Blueberry',
    grapes: 'Grapes',
    pineapple: 'Pineapple',

    // Generic states
    connected: 'Connected',
    disconnected: 'Disconnected',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    hide: 'Hide',
    show: 'Show',
    previous: 'Previous',
    next: 'Next',
  },

  fa: {
    // Loading component
    loading: 'در حال بارگذاری',
    loadingEllipsis: 'در حال بارگذاری...',
    loadingDefault: 'در حال بارگذاری',

    // Form labels and validation
    required: 'الزامی',
    requiredFieldTooltip: 'این فیلد الزامی است',

    // Alert dialog
    ok: 'تأیید',
    cancel: 'لغو',

    // Icon aria labels
    icons: {
      emergency: 'اضطراری',
      location: 'موقعیت',
      person: 'شخص',
      search: 'جستجو',
      phone: 'تلفن',
      checkCircle: 'موفق',
      xCircle: 'خطا',
      info: 'اطلاعات',
      arrowLeft: 'قبلی',
      arrowRight: 'بعدی',
      home: 'خانه',
      map: 'نقشه',
      navigation: 'ناوبری',
      screenReader: 'آیکون',
    },

    // Content view
    search: {
      placeholder: 'اینجا جستجو کنید',
    },
    categories: {
      all: 'همه دسته‌ها',
    },

    // Common UI text
    selectFruit: 'میوه‌ای انتخاب کنید',
    apple: 'سیب',
    banana: 'موز',
    blueberry: 'بلوبری',
    grapes: 'انگور',
    pineapple: 'آناناس',

    // Generic states
    connected: 'متصل',
    disconnected: 'قطع شده',
    success: 'موفق',
    error: 'خطا',
    warning: 'هشدار',
    info: 'اطلاعات',
    hide: 'مخفی',
    show: 'نمایش',
    previous: 'قبلی',
    next: 'بعدی',
  },
};