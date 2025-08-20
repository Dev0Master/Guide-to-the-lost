export interface DebugTranslations {
  // Panel header
  title: string;
  hide: string;
  show: string;

  // Connection status
  connection: {
    sessionSSE: string;
    profileSSE: string;
    connected: string;
    disconnected: string;
    available: string;
    unavailable: string;
    calculated: string;
    pending: string;
  };

  // Status types
  status: {
    location: string;
    route: string;
    session: string;
    profile: string;
  };

  // Sections
  sections: {
    activeErrors: string;
    ids: string;
    sessionId: string;
    profileId: string;
    currentLocation: string;
    sessionData: string;
    profileData: string;
    navigationRoute: string;
    recentEvents: string;
    noEvents: string;
    latitude: string;
    longitude: string;
  };

  // Debug log messages
  logs: {
    sessionConnection: string;
    profileConnection: string;
    locationUpdated: string;
    connected: string;
    disconnected: string;
  };

  // Error prefixes
  errors: {
    session: string;
    profile: string;
    location: string;
  };
}

export const debugTranslations: Record<'ar' | 'en' | 'fa', DebugTranslations> = {
  ar: {
    // Panel header
    title: 'لوحة التشخيص',
    hide: 'إخفاء',
    show: 'إظهار',

    // Connection status
    connection: {
      sessionSSE: 'جلسة SSE',
      profileSSE: 'ملف شخصي SSE',
      connected: 'متصل',
      disconnected: 'غير متصل',
      available: 'متاح',
      unavailable: 'غير متاح',
      calculated: 'محسوب',
      pending: 'في الانتظار',
    },

    // Status types
    status: {
      location: 'الموقع',
      route: 'المسار',
      session: 'الجلسة',
      profile: 'الملف الشخصي',
    },

    // Sections
    sections: {
      activeErrors: 'الأخطاء النشطة:',
      ids: 'المعرفات:',
      sessionId: 'معرف الجلسة:',
      profileId: 'معرف الملف الشخصي:',
      currentLocation: 'الموقع الحالي:',
      sessionData: 'بيانات الجلسة:',
      profileData: 'بيانات الملف الشخصي:',
      navigationRoute: 'مسار التوجيه:',
      recentEvents: 'الأحداث الأخيرة:',
      noEvents: 'لا توجد أحداث بعد...',
      latitude: 'خط العرض:',
      longitude: 'خط الطول:',
    },

    // Debug log messages
    logs: {
      sessionConnection: 'اتصال الجلسة:',
      profileConnection: 'اتصال الملف الشخصي:',
      locationUpdated: 'تم تحديث الموقع:',
      connected: 'متصل',
      disconnected: 'غير متصل',
    },

    // Error prefixes
    errors: {
      session: 'الجلسة:',
      profile: 'الملف الشخصي:',
      location: 'الموقع:',
    },
  },

  en: {
    // Panel header
    title: 'Debug Panel',
    hide: 'Hide',
    show: 'Show',

    // Connection status
    connection: {
      sessionSSE: 'Session SSE',
      profileSSE: 'Profile SSE',
      connected: 'Connected',
      disconnected: 'Disconnected',
      available: 'Available',
      unavailable: 'Unavailable',
      calculated: 'Calculated',
      pending: 'Pending',
    },

    // Status types
    status: {
      location: 'Location',
      route: 'Route',
      session: 'Session',
      profile: 'Profile',
    },

    // Sections
    sections: {
      activeErrors: 'Active Errors:',
      ids: 'IDs:',
      sessionId: 'Session ID:',
      profileId: 'Profile ID:',
      currentLocation: 'Current Location:',
      sessionData: 'Session Data:',
      profileData: 'Profile Data:',
      navigationRoute: 'Navigation Route:',
      recentEvents: 'Recent Events:',
      noEvents: 'No events yet...',
      latitude: 'Lat:',
      longitude: 'Lng:',
    },

    // Debug log messages
    logs: {
      sessionConnection: 'Session connection:',
      profileConnection: 'Profile connection:',
      locationUpdated: 'Location updated:',
      connected: 'Connected',
      disconnected: 'Disconnected',
    },

    // Error prefixes
    errors: {
      session: 'Session:',
      profile: 'Profile:',
      location: 'Location:',
    },
  },

  fa: {
    // Panel header
    title: 'پنل اشکال‌یابی',
    hide: 'پنهان کردن',
    show: 'نمایش',

    // Connection status
    connection: {
      sessionSSE: 'SSE جلسه',
      profileSSE: 'SSE نمایه',
      connected: 'متصل',
      disconnected: 'قطع شده',
      available: 'در دسترس',
      unavailable: 'در دسترس نیست',
      calculated: 'محاسبه شده',
      pending: 'در انتظار',
    },

    // Status types
    status: {
      location: 'موقعیت',
      route: 'مسیر',
      session: 'جلسه',
      profile: 'نمایه',
    },

    // Sections
    sections: {
      activeErrors: 'خطاهای فعال:',
      ids: 'شناسه‌ها:',
      sessionId: 'شناسه جلسه:',
      profileId: 'شناسه نمایه:',
      currentLocation: 'موقعیت فعلی:',
      sessionData: 'داده‌های جلسه:',
      profileData: 'داده‌های نمایه:',
      navigationRoute: 'مسیر ناوبری:',
      recentEvents: 'رویدادهای اخیر:',
      noEvents: 'هنوز هیچ رویدادی نیست...',
      latitude: 'عرض جغرافیایی:',
      longitude: 'طول جغرافیایی:',
    },

    // Debug log messages
    logs: {
      sessionConnection: 'اتصال جلسه:',
      profileConnection: 'اتصال نمایه:',
      locationUpdated: 'موقعیت به‌روزرسانی شد:',
      connected: 'متصل',
      disconnected: 'قطع شده',
    },

    // Error prefixes
    errors: {
      session: 'جلسه:',
      profile: 'نمایه:',
      location: 'موقعیت:',
    },
  },
};