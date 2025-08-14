export interface LoginTranslations {
  // Header
  appTitle: string;
  loginTitle: string;

  // Form labels
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;

  // Buttons
  loginButton: string;
  loggingInButton: string;

  // Error messages
  invalidCredentials: string;
  connectionError: string;
}

export const loginTranslations: Record<'ar' | 'en' | 'fa', LoginTranslations> = {
  ar: {
    // Header
    appTitle: 'دليل الضائعين',
    loginTitle: 'تسجيل الدخول إلى النظام',

    // Form labels
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: '••••••••',

    // Buttons
    loginButton: 'تسجيل الدخول',
    loggingInButton: 'جاري تسجيل الدخول...',

    // Error messages
    invalidCredentials: 'بيانات الدخول غير صحيحة. استخدم إحدى الحسابات التجريبية.',
    connectionError: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.'
  },

  en: {
    // Header
    appTitle: 'Guidance For Lost',
    loginTitle: 'Login to System',

    // Form labels
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: '••••••••',

    // Buttons
    loginButton: 'Login',
    loggingInButton: 'Logging in...',

    // Error messages
    invalidCredentials: 'Invalid credentials. Use one of the demo accounts.',
    connectionError: 'Connection error occurred. Please try again later.'
  },

  fa: {
    // Header
    appTitle: 'راهنمای گمشدگان',
    loginTitle: 'ورود به سیستم',

    // Form labels
    emailLabel: 'ایمیل',
    passwordLabel: 'رمز عبور',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: '••••••••',

    // Buttons
    loginButton: 'ورود',
    loggingInButton: 'در حال ورود...',

    // Error messages
    invalidCredentials: 'اطلاعات ورود نادرست است. از یکی از حساب‌های آزمایشی استفاده کنید.',
    connectionError: 'خطا در اتصال رخ داده است. لطفاً بعداً دوباره تلاش کنید.'
  }
};