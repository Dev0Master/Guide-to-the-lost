export interface HomeTranslations {
  // Header
  appTitle: string;
  appDescription: string;
  welcomeUser: string;
  logout: string;

  // Action buttons
  iAmLost: string;
  searchForPerson: string;

  // Welcome message
  welcomeMessage: string;

  // User info section
  userInfoTitle: string;
  name: string;
  email: string;
  role: string;
  phone: string;

  // Roles
  lostPersonRole: string;
  searcherRole: string;
  staffRole: string;

  // Service cards
  searchCard: {
    title: string;
    description: string;
    action: string;
  };
  dashboardCard: {
    title: string;
    description: string;
    action: string;
  };
}

export const homeTranslations: Record<'ar' | 'en' | 'fa', HomeTranslations> = {
  ar: {
    // Header
    appTitle: 'دليل الضائعين',
    appDescription: 'منصة لمساعدة الأشخاص المفقودين والباحثين عنهم',
    welcomeUser: 'مرحباً',
    logout: 'تسجيل خروج',

    // Action buttons
    iAmLost: 'أنا ضائع',
    searchForPerson: 'البحث عن شخص مفقود',

    // Welcome message
    welcomeMessage: 'مرحباً بك في دليل الضائعين - منصة لمساعدة الأشخاص المفقودين والباحثين عنهم',

    // User info section
    userInfoTitle: 'معلومات المستخدم',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    role: 'الدور',
    phone: 'رقم الهاتف',

    // Roles
    lostPersonRole: 'أنا ضائع',
    searcherRole: 'أنا أبحث عن ضائع',
    staffRole: 'موظف المركز الرئيسي',

    // Service cards
    searchCard: {
      title: 'البحث عن شخص',
      description: 'ابحث عن الأشخاص المفقودين في المنطقة',
      action: 'بدء البحث'
    },
    dashboardCard: {
      title: 'لوحة التحكم',
      description: 'إدارة النظام والمستخدمين',
      action: 'لوحة التحكم'
    }
  },

  en: {
    // Header
    appTitle: 'Guidance For Lost',
    appDescription: 'Platform to help missing persons and their searchers',
    welcomeUser: 'Welcome',
    logout: 'Logout',

    // Action buttons
    iAmLost: 'I Am Lost',
    searchForPerson: 'Search for Missing Person',

    // Welcome message
    welcomeMessage: 'Welcome to Guidance For Lost - a platform to help missing persons and their searchers',

    // User info section
    userInfoTitle: 'User Information',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    phone: 'Phone Number',

    // Roles
    lostPersonRole: 'I am lost',
    searcherRole: 'I am looking for someone lost',
    staffRole: 'Main Center Staff',

    // Service cards
    searchCard: {
      title: 'Search for Person',
      description: 'Search for missing persons in the area',
      action: 'Start Search'
    },
    dashboardCard: {
      title: 'Control Panel',
      description: 'Manage system and users',
      action: 'Dashboard'
    }
  },

  fa: {
    // Header
    appTitle: 'راهنمای گمشدگان',
    appDescription: 'پلتفرم کمک به افراد گمشده و جستجوگران آنها',
    welcomeUser: 'خوش آمدید',
    logout: 'خروج',

    // Action buttons
    iAmLost: 'من گم شده‌ام',
    searchForPerson: 'جستجوی فرد گمشده',

    // Welcome message
    welcomeMessage: 'به راهنمای گمشدگان خوش آمدید - پلتفرمی برای کمک به افراد گمشده و جستجوگران آنها',

    // User info section
    userInfoTitle: 'اطلاعات کاربر',
    name: 'نام',
    email: 'ایمیل',
    role: 'نقش',
    phone: 'شماره تلفن',

    // Roles
    lostPersonRole: 'من گم شده‌ام',
    searcherRole: 'من به دنبال فرد گمشده می‌گردم',
    staffRole: 'کارکنان مرکز اصلی',

    // Service cards
    searchCard: {
      title: 'جستجوی فرد',
      description: 'جستجوی افراد گمشده در منطقه',
      action: 'شروع جستجو'
    },
    dashboardCard: {
      title: 'پنل کنترل',
      description: 'مدیریت سیستم و کاربران',
      action: 'داشبورد'
    }
  }
};