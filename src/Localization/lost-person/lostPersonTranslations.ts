export interface LostPersonTranslations {
  // Header
  title: string;
  description: string;
  registrationTitle: string;
  registrationDescription: string;

  // Personal Info Form
  displayName: string;
  displayNamePlaceholder: string;
  age: string;
  agePlaceholder: string;
  clothingColor: string;
  distinctiveFeature: string;
  distinctiveFeaturePlaceholder: string;
  phoneNumber: string;
  phoneNumberPlaceholder: string;
  lastSeenLocation: string;
  lastSeenLocationPlaceholder: string;
  shortDescription: string;
  shortDescriptionPlaceholder: string;
  contactInfo: string;
  contactInfoPlaceholder: string;
  currentLocation: string;

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

  // Consent
  consentText: string;
  trackingConsentText: string;
  trackingEnabledInfo: string;

  // Form actions
  back: string;
  submit: string;
  submitting: string;

  // Location status
  locationStatus: string;
  locationDetected: string;
  detectingLocation: string;
  locationError: string;
  enableLocation: string;
  enableLocationMessage: string;
  waitLocation: string;
  locationRequired: string;

  // Success messages
  successTitle: string;
  successMessage: string;
  profileIdLabel: string;

  // Session messages
  sessionEnded: string;
  sessionEndedMessage: string;
  returningToWaiting: string;
  cleanedEndedSession: string;
  cleanedEndedSessionMessage: string;

  // Registration status
  readyToBeFound: string;
  readyToBeFoundMessage: string;
  waitingForSearcher: string;
  interactiveMapWillAppear: string;

  // Live tracking
  liveLocationTracking: string;
  trackingActive: string;
  trackingError: string;
  trackingStarting: string;
  lastUpdate: string;
  updating: string;

  // Location tracking errors
  locationTrackingError: string;
  enableLocationServices: string;
  locationPermissionDenied: string;
  locationUnavailable: string;
  locationTimeout: string;
  failedToDetectLocation: string;

  // What happens after registration
  whatHappensTitle: string;
  whatHappensList: string[];

  // Waiting interface
  waitingTitle: string;
  waitingMessage: string;
  openNavigation: string;
  registerAnother: string;
  newRegistrationForSite: string;
  registerMyInfoAgain: string;
  confirmReRegister: string;
  reRegisterWarning: string;
  confirmButton: string;
  cancelButton: string;
  importantTips: string;
  tipsList: string[];

  // Map error messages  
  mapError: string;
  mapErrorMessage: string;
}

export const lostPersonTranslations: Record<'ar' | 'en' | 'fa', LostPersonTranslations> = {
  ar: {
    // Header
    title: 'تسجيل شخص ضائع',
    description: 'سجل معلوماتك لمساعدة الآخرين في العثور عليك',
    registrationTitle: 'تسجيل شخص مفقود',
    registrationDescription: 'املأ المعلومات أدناه لبدء عملية البحث عنك',

    // Personal Info Form
    displayName: 'الاسم أو الكنية *',
    displayNamePlaceholder: 'الاسم الذي تريد عرضه',
    age: 'العمر *',
    agePlaceholder: 'أدخل العمر بالسنوات',
    clothingColor: 'لون الملابس العلوية *',
    distinctiveFeature: 'علامة مميزة (اختياري)',
    distinctiveFeaturePlaceholder: 'مثل: نظارة، عكاز، حقيبة حمراء...',
    phoneNumber: 'رقم الهاتف *',
    phoneNumberPlaceholder: '+964 770 123 4567',
    lastSeenLocation: 'آخر مكان كنت فيه',
    lastSeenLocationPlaceholder: 'مثل: بوابة الحرم، المدخل الشرقي...',
    shortDescription: 'وصف قصير (اختياري)',
    shortDescriptionPlaceholder: 'مثال: أرتدي نظارة',
    contactInfo: 'رقم للتواصل (اختياري)',
    contactInfoPlaceholder: 'مثال: 0501234567',
    currentLocation: 'موقعك الحالي',

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

    // Consent
    consentText: 'أوافق على عرض معلوماتي المحدودة على الخريطة المشتركة لمساعدة الباحثين في العثور علي. لن يتم مشاركة رقم هاتفي إلا مع الأشخاص المخولين.',
    trackingConsentText: 'أوافق على تفعيل خدمة التتبع للسماح للباحثين بالعثور علي والتواصل معي',
    trackingEnabledInfo: 'عند تفعيل التتبع، سيتم حفظ معرف ملفك الشخصي ويمكن للباحثين إنشاء جلسة تتبع معك لمساعدتك في العثور على طريق العودة.',

    // Form actions
    back: 'العودة',
    submit: 'تسجيل موقعي',
    submitting: 'جاري التسجيل...',

    // Location status
    locationStatus: 'حالة الموقع:',
    locationDetected: 'تم تحديد الموقع',
    detectingLocation: 'جاري تحديد الموقع...',
    locationError: 'خطأ في تحديد الموقع',
    enableLocation: 'يرجى تفعيل خدمة الموقع',
    enableLocationMessage: 'يرجى السماح للتطبيق بالوصول إلى موقعك لضمان العثور عليك بسرعة',
    waitLocation: 'يرجى انتظار تحديد الموقع أو السماح بالوصول للموقع',
    locationRequired: 'الموقع مطلوب',

    // Success messages
    successTitle: 'تم حفظ البيانات بنجاح!',
    successMessage: 'تم حفظ البيانات بنجاح!',
    profileIdLabel: 'معرف الملف الشخصي:',

    // Session messages
    sessionEnded: 'انتهت الجلسة - العودة إلى وضع الانتظار',
    sessionEndedMessage: 'انتهت الجلسة - العودة إلى وضع الانتظار',
    returningToWaiting: 'العودة إلى وضع الانتظار',
    cleanedEndedSession: 'تم تنظيف جلسة منتهية - العودة إلى وضع الانتظار',
    cleanedEndedSessionMessage: 'تم تنظيف جلسة منتهية - العودة إلى وضع الانتظار',

    // Registration status
    readyToBeFound: 'جاهز للبحث عنك!',
    readyToBeFoundMessage: 'تم تسجيلك بنجاح. انتظر حتى يبدأ شخص بالبحث عنك',
    waitingForSearcher: 'في انتظار الباحثين...',
    interactiveMapWillAppear: 'ستظهر الخريطة التفاعلية تلقائياً عند بدء جلسة البحث',

    // Live tracking
    liveLocationTracking: 'تتبع الموقع المباشر:',
    trackingActive: 'نشط - آخر تحديث:',
    trackingError: 'خطأ في تتبع الموقع',
    trackingStarting: 'بدء تتبع الموقع...',
    lastUpdate: 'آخر تحديث:',
    updating: 'جاري التحديث...',

    // Location tracking errors
    locationTrackingError: 'خطأ في تتبع الموقع',
    enableLocationServices: 'يرجى تفعيل خدمة الموقع للحصول على تحديثات مباشرة',
    locationPermissionDenied: 'تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع.',
    locationUnavailable: 'معلومات الموقع غير متاحة',
    locationTimeout: 'انتهت مهلة طلب تحديد الموقع',
    failedToDetectLocation: 'فشل في تحديد الموقع. يرجى تفعيل خدمة الموقع.',

    // What happens after registration
    whatHappensTitle: 'ماذا سيحدث بعد التسجيل؟',
    whatHappensList: [
      'ستظهر الخريطة التفاعلية مع إمكانية التتبع المباشر',
      'سيتمكن الباحثون من العثور عليك والتواصل معك',
      'ستحصل على تحديثات مباشرة عند بدء عملية البحث'
    ],

    // Waiting interface
    waitingTitle: 'في انتظار الباحثين...',
    waitingMessage: 'تم تسجيل ملفك الشخصي بنجاح. الآن يمكن للباحثين العثور عليك والتواصل معك. سيتم إشعارك عندما يبدأ أحد الباحثين جلسة تتبع معك.',
    openNavigation: 'فتح التوجيه والملاحة',
    registerAnother: 'تسجيل شخص آخر',
    newRegistrationForSite: 'تسجيل جديد لموقعي',
    registerMyInfoAgain: 'تسجيل معلوماتي مرة أخرى',
    confirmReRegister: 'تأكيد إعادة التسجيل',
    reRegisterWarning: 'سيتم حذف معلوماتك الحالية وإعادة توجيهك لتسجيل معلومات جديدة. هل تريد المتابعة؟',
    confirmButton: 'تأكيد',
    cancelButton: 'إلغاء',
    importantTips: 'نصائح مهمة:',
    tipsList: [
      'حافظ على هاتفك مشحوناً ومتصلاً بالإنترنت',
      'ابق في مكان آمن ومرئي',
      'اتصل بالطوارئ إذا كنت في خطر'
    ],

    // Map error messages
    mapError: 'خطأ في الخريطة',
    mapErrorMessage: 'حدث خطأ في عرض الخريطة. يرجى إعادة تحميل الصفحة.'
  },

  en: {
    // Header
    title: 'Register Lost Person',
    description: 'Register your information to help others find you',
    registrationTitle: 'Lost Person Registration',
    registrationDescription: 'Fill in the information below to start the search process',

    // Personal Info Form
    displayName: 'Display Name or Alias *',
    displayNamePlaceholder: 'Name you want to display',
    age: 'Age *',
    agePlaceholder: 'Enter age in years',
    clothingColor: 'Upper Clothing Color *',
    distinctiveFeature: 'Distinctive Feature (Optional)',
    distinctiveFeaturePlaceholder: 'e.g: glasses, cane, red bag...',
    phoneNumber: 'Phone Number *',
    phoneNumberPlaceholder: '+964 770 123 4567',
    lastSeenLocation: 'Last Seen Location',
    lastSeenLocationPlaceholder: 'e.g: Shrine gate, Eastern entrance...',
    shortDescription: 'Short Description (optional)',
    shortDescriptionPlaceholder: 'e.g. wearing glasses',
    contactInfo: 'Contact (optional)',
    contactInfoPlaceholder: 'e.g. 0501234567',
    currentLocation: 'Your Current Location',

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

    // Consent
    consentText: 'I consent to displaying my limited information on the shared map to help searchers find me. My phone number will only be shared with authorized personnel.',
    trackingConsentText: 'I agree to enable tracking service to allow searchers to find me and communicate with me',
    trackingEnabledInfo: 'When tracking is enabled, your profile ID will be saved and searchers can create a tracking session with you to help you find your way back.',

    // Form actions
    back: 'Back',
    submit: 'Register My Location',
    submitting: 'Registering...',

    // Location status
    locationStatus: 'Location Status:',
    locationDetected: 'Location detected',
    detectingLocation: 'Detecting location...',
    locationError: 'Location error',
    enableLocation: 'Please enable location service',
    enableLocationMessage: 'Please allow location access to ensure you can be found quickly',
    waitLocation: 'Please wait for location detection or allow location access',
    locationRequired: 'Location required',

    // Success messages
    successTitle: 'Data saved successfully!',
    successMessage: 'Data saved successfully!',
    profileIdLabel: 'Profile ID:',

    // Session messages
    sessionEnded: 'Session ended - returning to waiting mode',
    sessionEndedMessage: 'Session ended - returning to waiting mode',
    returningToWaiting: 'Returning to waiting mode',
    cleanedEndedSession: 'Cleaned up ended session - returning to waiting mode',
    cleanedEndedSessionMessage: 'Cleaned up ended session - returning to waiting mode',

    // Registration status
    readyToBeFound: 'Ready to be Found!',
    readyToBeFoundMessage: 'Successfully registered. Waiting for someone to start searching for you',
    waitingForSearcher: 'Waiting for searchers...',
    interactiveMapWillAppear: 'Interactive map will appear automatically when a search session starts',

    // Live tracking
    liveLocationTracking: 'Live Location Tracking:',
    trackingActive: 'Active - Last update:',
    trackingError: 'Location tracking error',
    trackingStarting: 'Starting location tracking...',
    lastUpdate: 'Last update:',
    updating: 'Updating...',

    // Location tracking errors
    locationTrackingError: 'Location Tracking Error',
    enableLocationServices: 'Please enable location services for live updates',
    locationPermissionDenied: 'Location permission denied. Please allow location access.',
    locationUnavailable: 'Location information unavailable',
    locationTimeout: 'Location request timeout',
    failedToDetectLocation: 'Failed to detect location. Please enable location services.',

    // What happens after registration
    whatHappensTitle: 'What happens after registration?',
    whatHappensList: [
      'Interactive map with live tracking will appear',
      'Searchers will be able to find and communicate with you',
      'You will receive live updates when search begins'
    ],

    // Waiting interface
    waitingTitle: 'Waiting for searchers...',
    waitingMessage: 'Your profile has been registered successfully. Now searchers can find you and communicate with you. You will be notified when a searcher starts a tracking session with you.',
    openNavigation: 'Open Navigation & Guidance',
    registerAnother: 'Register Another Person',
    newRegistrationForSite: 'New Registration for My Site',
    registerMyInfoAgain: 'Register My Information Again',
    confirmReRegister: 'Confirm Re-registration',
    reRegisterWarning: 'Your current information will be deleted and you will be redirected to register new information. Do you want to continue?',
    confirmButton: 'Confirm',
    cancelButton: 'Cancel',
    importantTips: 'Important Tips:',
    tipsList: [
      'Keep your phone charged and connected to the internet',
      'Stay in a safe and visible location',
      'Call emergency services if you are in danger'
    ],

    // Map error messages
    mapError: 'Map Error',
    mapErrorMessage: 'An error occurred displaying the map. Please reload the page.'
  },

  fa: {
    // Header
    title: 'ثبت فرد گمشده',
    description: 'اطلاعات خود را ثبت کنید تا دیگران شما را پیدا کنند',
    registrationTitle: 'ثبت فرد گمشده',
    registrationDescription: 'اطلاعات زیر را برای شروع فرآیند جستجو پر کنید',

    // Personal Info Form
    displayName: 'نام نمایشی یا لقب *',
    displayNamePlaceholder: 'نامی که می‌خواهید نمایش داده شود',
    age: 'سن *',
    agePlaceholder: 'سن را به سال وارد کنید',
    clothingColor: 'رنگ لباس بالایی *',
    distinctiveFeature: 'ویژگی متمایز (اختیاری)',
    distinctiveFeaturePlaceholder: 'مثل: عینک، عصا، کیف قرمز...',
    phoneNumber: 'شماره تلفن *',
    phoneNumberPlaceholder: '+964 770 123 4567',
    lastSeenLocation: 'آخرین مکان دیده شده',
    lastSeenLocationPlaceholder: 'مثل: دروازه حرم، ورودی شرقی...',
    shortDescription: 'توضیح کوتاه (اختیاری)',
    shortDescriptionPlaceholder: 'مثلاً عینک دارم',
    contactInfo: 'شماره تماس (اختیاری)',
    contactInfoPlaceholder: 'مثلاً 09121234567',
    currentLocation: 'موقعیت فعلی شما',

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

    // Consent
    consentText: 'موافقم که اطلاعات محدود من در نقشه مشترک نمایش داده شود تا جستجوگران مرا پیدا کنند. شماره تلفن من فقط با افراد مجاز به اشتراک گذاشته می‌شود.',
    trackingConsentText: 'موافقم که سرویس ردیابی فعال شود تا جستجوگران بتوانند مرا پیدا کرده و با من ارتباط برقرار کنند',
    trackingEnabledInfo: 'وقتی ردیابی فعال می‌شود، شناسه پروفایل شما ذخیره شده و جستجوگران می‌توانند جلسه ردیابی با شما ایجاد کنند تا به شما کمک کنند راه بازگشت را پیدا کنید.',

    // Form actions
    back: 'بازگشت',
    submit: 'ثبت موقعیت من',
    submitting: 'در حال ثبت...',

    // Location status
    locationStatus: 'وضعیت موقعیت:',
    locationDetected: 'موقعیت تشخیص داده شد',
    detectingLocation: 'در حال تشخیص موقعیت...',
    locationError: 'خطای موقعیت',
    enableLocation: 'لطفاً سرویس موقعیت را فعال کنید',
    enableLocationMessage: 'لطفاً دسترسی به موقعیت را مجاز کنید تا سریع پیدا شوید',
    waitLocation: 'لطفاً منتظر تشخیص موقعیت باشید یا دسترسی به موقعیت را مجاز کنید',
    locationRequired: 'موقعیت الزامی است',

    // Success messages
    successTitle: 'داده‌ها با موفقیت ذخیره شد!',
    successMessage: 'داده‌ها با موفقیت ذخیره شد!',
    profileIdLabel: 'شناسه پروفایل:',

    // Session messages
    sessionEnded: 'جلسه پایان یافت - بازگشت به حالت انتظار',
    sessionEndedMessage: 'جلسه پایان یافت - بازگشت به حالت انتظار',
    returningToWaiting: 'بازگشت به حالت انتظار',
    cleanedEndedSession: 'جلسه پایان یافته پاک شد - بازگشت به حالت انتظار',
    cleanedEndedSessionMessage: 'جلسه پایان یافته پاک شد - بازگشت به حالت انتظار',

    // Registration status
    readyToBeFound: 'آماده پیدا شدن!',
    readyToBeFoundMessage: 'با موفقیت ثبت شدید. منتظر شروع جستجو توسط کسی باشید',
    waitingForSearcher: 'در انتظار جستجوگران...',
    interactiveMapWillAppear: 'نقشه تعاملی به طور خودکار هنگام شروع جلسه جستجو ظاهر می‌شود',

    // Live tracking
    liveLocationTracking: 'ردیابی زنده موقعیت:',
    trackingActive: 'فعال - آخرین به‌روزرسانی:',
    trackingError: 'خطای ردیابی موقعیت',
    trackingStarting: 'شروع ردیابی موقعیت...',
    lastUpdate: 'آخرین به‌روزرسانی:',
    updating: 'در حال به‌روزرسانی...',

    // Location tracking errors
    locationTrackingError: 'خطای ردیابی موقعیت',
    enableLocationServices: 'لطفاً سرویس‌های موقعیت را برای به‌روزرسانی‌های زنده فعال کنید',
    locationPermissionDenied: 'مجوز موقعیت رد شد. لطفاً دسترسی به موقعیت را مجاز کنید.',
    locationUnavailable: 'اطلاعات موقعیت در دسترس نیست',
    locationTimeout: 'زمان درخواست موقعیت تمام شد',
    failedToDetectLocation: 'تشخیص موقعیت ناموفق. لطفاً سرویس‌های موقعیت را فعال کنید.',

    // What happens after registration
    whatHappensTitle: 'بعد از ثبت چه اتفاقی می‌افتد؟',
    whatHappensList: [
      'نقشه تعاملی با ردیابی زنده ظاهر می‌شود',
      'جستجوگران قادر خواهند بود شما را پیدا کرده و با شما ارتباط برقرار کنند',
      'هنگام شروع جستجو به‌روزرسانی‌های زنده دریافت خواهید کرد'
    ],

    // Waiting interface
    waitingTitle: 'در انتظار جستجوگران...',
    waitingMessage: 'پروفایل شما با موفقیت ثبت شده است. اکنون جستجوگران می‌توانند شما را پیدا کرده و با شما ارتباط برقرار کنند. وقتی یک جستجوگر جلسه ردیابی را شروع کند، اطلاع‌رسانی خواهید شد.',
    openNavigation: 'باز کردن ناوبری و راهنمایی',
    registerAnother: 'ثبت فرد دیگری',
    newRegistrationForSite: 'ثبت جدید برای سایت من',
    registerMyInfoAgain: 'دوباره اطلاعات من را ثبت کنید',
    confirmReRegister: 'تأیید ثبت مجدد',
    reRegisterWarning: 'اطلاعات فعلی شما حذف شده و به صفحه ثبت اطلاعات جدید هدایت خواهید شد. آیا می‌خواهید ادامه دهید؟',
    confirmButton: 'تأیید',
    cancelButton: 'لغو',
    importantTips: 'نکات مهم:',
    tipsList: [
      'تلفن خود را شارژ و متصل به اینترنت نگه دارید',
      'در مکانی امن و قابل رؤیت باشید',
      'در صورت خطر با خدمات اضطراری تماس بگیرید'
    ],

    // Map error messages
    mapError: 'خطای نقشه',
    mapErrorMessage: 'خطایی در نمایش نقشه رخ داد. لطفاً صفحه را مجدداً بارگذاری کنید.'
  }
};