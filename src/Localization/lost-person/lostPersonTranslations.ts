export interface LostPersonTranslations {
  // Header
  title: string;
  description: string;

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

  // Form actions
  back: string;
  submit: string;
  submitting: string;
}

export const lostPersonTranslations: Record<'ar' | 'en' | 'fa', LostPersonTranslations> = {
  ar: {
    // Header
    title: 'تسجيل شخص ضائع',
    description: 'سجل معلوماتك لمساعدة الآخرين في العثور عليك',

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

    // Form actions
    back: 'العودة',
    submit: 'تسجيل موقعي',
    submitting: 'جاري التسجيل...'
  },

  en: {
    // Header
    title: 'Register Lost Person',
    description: 'Register your information to help others find you',

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

    // Form actions
    back: 'Back',
    submit: 'Register My Location',
    submitting: 'Registering...'
  },

  fa: {
    // Header
    title: 'ثبت فرد گمشده',
    description: 'اطلاعات خود را ثبت کنید تا دیگران شما را پیدا کنند',

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

    // Form actions
    back: 'بازگشت',
    submit: 'ثبت موقعیت من',
    submitting: 'در حال ثبت...'
  }
};