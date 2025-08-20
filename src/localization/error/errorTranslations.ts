export interface ErrorTranslations {
  // General errors
  general: {
    unexpectedError: string;
    systemError: string;
    tryAgain: string;
    returnHome: string;
    reloadPage: string;
    noData: string;
    error: string;
  };

  // Connection errors
  connection: {
    failed: string;
    checkInternet: string;
    reconnecting: string;
    connectionError: string;
    sessionEnded: string;
  };

  // Location errors
  location: {
    permissionDenied: string;
    permissionDeniedMessage: string;
    unavailable: string;
    unavailableMessage: string;
    timeout: string;
    timeoutMessage: string;
    trackingFailed: string;
    trackingError: string;
    failedUpdate: string;
    updateError: string;
    enableLocation: string;
    getCurrentLocation: string;
    detectionError: string;
  };

  // Map errors
  map: {
    loadError: string;
    displayError: string;
    displayErrorMessage: string;
    reloadMap: string;
  };

  // Session errors
  session: {
    createSessionFailed: string;
    startSessionFailed: string;
    endSessionError: string;
    sessionError: string;
    sessionEndedSuccessfully: string;
  };

  // Navigation errors
  navigation: {
    navigationError: string;
    interfaceError: string;
    interfaceErrorMessage: string;
    reloadInterface: string;
  };

  // Data errors
  data: {
    saveFailed: string;
    saveFailedMessage: string;
    searchError: string;
    searchErrorMessage: string;
  };

  // Error boundary
  boundary: {
    unexpectedError: string;
    systemErrorDescription: string;
    tryAgain: string;
    returnHome: string;
    reloadPage: string;
    helpfulInfo: string;
    persistErrorInfo: string;
    checkInternet: string;
    tryAnotherBrowser: string;
    clearCache: string;
    contactSupport: string;
    technicalDetails: string;
    errorMessage: string;
    errorPath: string;
    reactComponents: string;
  };
}

export const errorTranslations: Record<'ar' | 'en' | 'fa', ErrorTranslations> = {
  ar: {
    // General errors
    general: {
      unexpectedError: 'حدث خطأ غير متوقع',
      systemError: 'نعتذر، حدث خطأ في النظام. لا تقلق، يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.',
      tryAgain: 'المحاولة مرة أخرى',
      returnHome: 'العودة للرئيسية',
      reloadPage: 'إعادة تحميل الصفحة',
      noData: 'لا توجد بيانات',
      error: 'خطأ',
    },

    // Connection errors
    connection: {
      failed: 'فشل في الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.',
      checkInternet: 'التأكد من اتصال الإنترنت',
      reconnecting: 'جاري إعادة الاتصال',
      connectionError: 'خطأ في الاتصال',
      sessionEnded: 'تم إنهاء الجلسة محلياً',
    },

    // Location errors
    location: {
      permissionDenied: 'تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع.',
      permissionDeniedMessage: 'يرجى السماح بالوصول إلى الموقع',
      unavailable: 'معلومات الموقع غير متاحة',
      unavailableMessage: 'خدمة الموقع غير متاحة',
      timeout: 'انتهت مهلة طلب تحديد الموقع',
      timeoutMessage: 'انتهت مهلة الطلب',
      trackingFailed: 'فشل في تتبع الموقع. يرجى التأكد من تفعيل خدمة الموقع.',
      trackingError: 'خطأ في تتبع الموقع',
      failedUpdate: 'فشل في تحديد الموقع. يرجى تفعيل خدمة الموقع.',
      updateError: 'خطأ في تحديث الموقع',
      enableLocation: 'يرجى تفعيل خدمة الموقع',
      getCurrentLocation: 'لا يمكن الحصول على الموقع الحالي',
      detectionError: 'حدث خطأ أثناء تحديد الموقع',
    },

    // Map errors
    map: {
      loadError: 'فشل في تحميل الخريطة',
      displayError: 'خطأ في الخريطة',
      displayErrorMessage: 'حدث خطأ في عرض الخريطة. يرجى إعادة تحميل الصفحة.',
      reloadMap: 'إعادة تحميل الخريطة',
    },

    // Session errors
    session: {
      createSessionFailed: 'فشل في إنشاء معرف الجلسة',
      startSessionFailed: 'فشل في بدء الجلسة. يرجى المحاولة.',
      endSessionError: 'خطأ في إنهاء الجلسة',
      sessionError: 'خطأ في الجلسة',
      sessionEndedSuccessfully: 'تم إنهاء الجلسة بنجاح',
    },

    // Navigation errors
    navigation: {
      navigationError: 'خطأ في التنقل',
      interfaceError: 'خطأ في واجهة التنقل',
      interfaceErrorMessage: 'حدث خطأ في واجهة التنقل. يرجى إعادة تحميل الصفحة.',
      reloadInterface: 'إعادة تحميل الواجهة',
    },

    // Data errors
    data: {
      saveFailed: 'فشل في حفظ البيانات',
      saveFailedMessage: 'فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.',
      searchError: 'خطأ في البحث',
      searchErrorMessage: 'حدث خطأ غير متوقع أثناء البحث.',
    },

    // Error boundary
    boundary: {
      unexpectedError: 'حدث خطأ غير متوقع',
      systemErrorDescription: 'نعتذر، حدث خطأ في النظام. لا تقلق، يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.',
      tryAgain: 'المحاولة مرة أخرى',
      returnHome: 'العودة للرئيسية',
      reloadPage: 'إعادة تحميل الصفحة',
      helpfulInfo: 'معلومات مفيدة',
      persistErrorInfo: 'إذا استمر الخطأ، يمكنك:',
      checkInternet: 'التأكد من اتصال الإنترنت',
      tryAnotherBrowser: 'تجربة متصفح آخر',
      clearCache: 'مسح بيانات المتصفح (Cache)',
      contactSupport: 'التواصل مع الدعم الفني إذا كان الأمر عاجل',
      technicalDetails: 'تفاصيل الخطأ التقنية',
      errorMessage: 'رسالة الخطأ:',
      errorPath: 'مسار الخطأ:',
      reactComponents: 'مكونات React:',
    },
  },

  en: {
    // General errors
    general: {
      unexpectedError: 'An unexpected error occurred',
      systemError: 'Sorry, a system error occurred. Don\'t worry, you can try again or return to the main page.',
      tryAgain: 'Try Again',
      returnHome: 'Return to Home',
      reloadPage: 'Reload Page',
      noData: 'No data available',
      error: 'Error',
    },

    // Connection errors
    connection: {
      failed: 'Failed to connect to server. Please check your internet connection.',
      checkInternet: 'Check internet connection',
      reconnecting: 'Reconnecting',
      connectionError: 'Connection Error',
      sessionEnded: 'Session ended locally',
    },

    // Location errors
    location: {
      permissionDenied: 'Location permission denied. Please allow location access.',
      permissionDeniedMessage: 'Please allow location access',
      unavailable: 'Location information unavailable',
      unavailableMessage: 'Location service unavailable',
      timeout: 'Location request timeout',
      timeoutMessage: 'Request timeout',
      trackingFailed: 'Failed to track location. Please ensure location service is enabled.',
      trackingError: 'Location tracking error',
      failedUpdate: 'Failed to determine location. Please enable location service.',
      updateError: 'Failed to update location',
      enableLocation: 'Please enable location service',
      getCurrentLocation: 'Unable to get current location',
      detectionError: 'An error occurred while detecting location',
    },

    // Map errors
    map: {
      loadError: 'Failed to load map',
      displayError: 'Map Error',
      displayErrorMessage: 'An error occurred displaying the map. Please reload the page.',
      reloadMap: 'Reload Map',
    },

    // Session errors
    session: {
      createSessionFailed: 'Failed to create session ID',
      startSessionFailed: 'Failed to start session. Please try again.',
      endSessionError: 'Error ending session',
      sessionError: 'Session error',
      sessionEndedSuccessfully: 'Session ended successfully',
    },

    // Navigation errors
    navigation: {
      navigationError: 'Navigation Error',
      interfaceError: 'Navigation interface error',
      interfaceErrorMessage: 'An error occurred in the navigation interface. Please reload the page.',
      reloadInterface: 'Reload Interface',
    },

    // Data errors
    data: {
      saveFailed: 'Failed to save data',
      saveFailedMessage: 'Failed to save data. Please try again.',
      searchError: 'Search error',
      searchErrorMessage: 'An unexpected error occurred during search.',
    },

    // Error boundary
    boundary: {
      unexpectedError: 'An unexpected error occurred',
      systemErrorDescription: 'Sorry, a system error occurred. Don\'t worry, you can try again or return to the main page.',
      tryAgain: 'Try Again',
      returnHome: 'Return to Home',
      reloadPage: 'Reload Page',
      helpfulInfo: 'Helpful Information',
      persistErrorInfo: 'If the error persists, you can:',
      checkInternet: 'Check internet connection',
      tryAnotherBrowser: 'Try another browser',
      clearCache: 'Clear browser cache',
      contactSupport: 'Contact technical support if urgent',
      technicalDetails: 'Technical Error Details',
      errorMessage: 'Error message:',
      errorPath: 'Error path:',
      reactComponents: 'React components:',
    },
  },

  fa: {
    // General errors
    general: {
      unexpectedError: 'خطای غیرمنتظره‌ای رخ داد',
      systemError: 'متأسفیم، خطای سیستمی رخ داد. نگران نباشید، می‌توانید دوباره امتحان کنید یا به صفحه اصلی برگردید.',
      tryAgain: 'تلاش مجدد',
      returnHome: 'بازگشت به خانه',
      reloadPage: 'بارگذاری مجدد صفحه',
      noData: 'هیچ داده‌ای در دسترس نیست',
      error: 'خطا',
    },

    // Connection errors
    connection: {
      failed: 'اتصال به سرور ناموفق. لطفاً اتصال اینترنت خود را بررسی کنید.',
      checkInternet: 'بررسی اتصال اینترنت',
      reconnecting: 'در حال اتصال مجدد',
      connectionError: 'خطای اتصال',
      sessionEnded: 'جلسه به صورت محلی خاتمه یافت',
    },

    // Location errors
    location: {
      permissionDenied: 'مجوز موقعیت رد شد. لطفاً دسترسی به موقعیت را مجاز کنید.',
      permissionDeniedMessage: 'لطفاً دسترسی به موقعیت را مجاز کنید',
      unavailable: 'اطلاعات موقعیت در دسترس نیست',
      unavailableMessage: 'سرویس موقعیت در دسترس نیست',
      timeout: 'زمان درخواست موقعیت تمام شد',
      timeoutMessage: 'زمان درخواست تمام شد',
      trackingFailed: 'ردیابی موقعیت ناموفق. لطفاً اطمینان حاصل کنید که سرویس موقعیت فعال است.',
      trackingError: 'خطای ردیابی موقعیت',
      failedUpdate: 'تعیین موقعیت ناموفق. لطفاً سرویس موقعیت را فعال کنید.',
      updateError: 'خطای به‌روزرسانی موقعیت',
      enableLocation: 'لطفاً سرویس موقعیت را فعال کنید',
      getCurrentLocation: 'قادر به دریافت موقعیت فعلی نیست',
      detectionError: 'خطایی در طول تشخیص موقعیت رخ داد',
    },

    // Map errors
    map: {
      loadError: 'بارگذاری نقشه ناموفق',
      displayError: 'خطای نقشه',
      displayErrorMessage: 'خطایی در نمایش نقشه رخ داد. لطفاً صفحه را مجدداً بارگذاری کنید.',
      reloadMap: 'بارگذاری مجدد نقشه',
    },

    // Session errors
    session: {
      createSessionFailed: 'ایجاد شناسه جلسه ناموفق',
      startSessionFailed: 'شروع جلسه ناموفق. لطفاً دوباره امتحان کنید.',
      endSessionError: 'خطا در پایان جلسه',
      sessionError: 'خطای جلسه',
      sessionEndedSuccessfully: 'جلسه با موفقیت پایان یافت',
    },

    // Navigation errors
    navigation: {
      navigationError: 'خطای ناوبری',
      interfaceError: 'خطای رابط ناوبری',
      interfaceErrorMessage: 'خطایی در رابط ناوبری رخ داد. لطفاً صفحه را مجدداً بارگذاری کنید.',
      reloadInterface: 'بارگذاری مجدد رابط',
    },

    // Data errors
    data: {
      saveFailed: 'ذخیره داده ناموفق',
      saveFailedMessage: 'ذخیره داده ناموفق. لطفاً دوباره امتحان کنید.',
      searchError: 'خطای جستجو',
      searchErrorMessage: 'خطای غیرمنتظره‌ای در طول جستجو رخ داد.',
    },

    // Error boundary
    boundary: {
      unexpectedError: 'خطای غیرمنتظره‌ای رخ داد',
      systemErrorDescription: 'متأسفیم، خطای سیستمی رخ داد. نگران نباشید، می‌توانید دوباره امتحان کنید یا به صفحه اصلی برگردید.',
      tryAgain: 'تلاش مجدد',
      returnHome: 'بازگشت به خانه',
      reloadPage: 'بارگذاری مجدد صفحه',
      helpfulInfo: 'اطلاعات مفید',
      persistErrorInfo: 'اگر خطا ادامه دارد، می‌توانید:',
      checkInternet: 'اتصال اینترنت را بررسی کنید',
      tryAnotherBrowser: 'مرورگر دیگری امتحان کنید',
      clearCache: 'حافظه نهان مرورگر را پاک کنید',
      contactSupport: 'در صورت اضطرار با پشتیبانی فنی تماس بگیرید',
      technicalDetails: 'جزئیات فنی خطا',
      errorMessage: 'پیام خطا:',
      errorPath: 'مسیر خطا:',
      reactComponents: 'مؤلفه‌های React:',
    },
  },
};