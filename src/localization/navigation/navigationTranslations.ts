export interface NavigationTranslations {
  // Distance and time units
  distance: {
    meter: string;
    meterShort: string;
    kilometer: string;
    kilometerShort: string;
  };
  
  time: {
    minute: string;
    minuteShort: string;
    second: string;
    secondShort: string;
    seconds: string;
    and: string;
  };

  // Connection and status
  status: {
    noConnection: string;
    connected: string;
    disconnected: string;
    active: string;
    calculating: string;
    found: string;
    notFound: string;
    loading: string;
    activeSession: string;
    alreadyActiveSession: string;
  };

  // Lost person interface
  lostPerson: {
    title: string;
    subtitle: string;
    searcherInfo: string;
    distance: string;
    estimatedArrival: string;
    instructions: string;
    stayInPlace: string;
    lookOutForSearcher: string;
    canSeeSearcher: string;
    call: string;
    viewMap: string;
    back: string;
    liveTracking: string;
    connectionStatus: string;
    mapError: string;
    errorDescription: string;
    searchVolunteer: string;
    searcherName: string;
    foundMessage: string;
    veryCloseMessage: string;
    approachingMessage: string;
    headingToYouMessage: string;
  };

  // Real-time navigation
  realTimeNav: {
    title: string;
    description: string;
    searcherDescription: string;
    lostPersonDescription: string;
    connectionStatus: string;
    endSession: string;
    reconnecting: string;
    reconnectingMessage: string;
    tryReconnecting: string;
    legend: string;
    searcher: string;
    lostPerson: string;
    liveUpdates: string;
    updateReceived: string;
    navigationInfo: string;
    foundMessage: string;
    foundDescription: string;
    distance: string;
    estimatedTime: string;
    directions: string;
    calculatingRoute: string;
    recalculate: string;
    waitingForLocation: string;
    waitingForBothLocations: string;
  };

  // Route selection
  routeSelection: {
    title: string;
    description: string;
    loadingAlternatives: string;
    routeTypes: {
      shortest: string;
      fastest: string;
      walking: string;
    };
    distance: string;
    time: string;
    selected: string;
    selecting: string;
    select: string;
    noAlternatives: string;
    noAlternativesMessage: string;
    reload: string;
    instructions: string;
    instructionSteps: string[];
  };

  // Searcher interface
  searcher: {
    title: string;
    searcherInfo: string;
    searcherInfoDescription: string;
    active: string;
    back: string;
    liveNavigation: string;
    liveNavigationDescription: string;
    openNavigation: string;
    directContact: string;
    contactDescription: string;
    call: string;
    sessionInfo: string;
    sessionId: string;
    profileId: string;
    searchInstructions: string;
    instructionsList: string[];
    navigationError: string;
    navigationErrorDescription: string;
  };

  // Live tracking
  liveTracking: {
    title: string;
    liveNavigation: string;
    stopTracking: string;
    connectionStatus: string;
    trackingEnabled: string;
    trackingDisabled: string;
    locationTracking: string;
    trackingActive: string;
    trackingInactive: string;
    gpsAccurate: string;
    gpsInaccurate: string;
    profileData: string;
    profileFields: {
      name: string;
      age: string;
      gender: string;
      lastSeen: string;
      clothing: string;
      medicalConditions: string;
      phone: string;
      emergencyContact: string;
    };
    profileId: string;
    updateFrequency: string;
    lastUpdate: string;
  };

  // Navigation map
  navigationMap: {
    title: string;
    close: string;
    locationStatus: string;
    trackingEnabled: string;
    trackingDisabled: string;
    coordinates: string;
    updateLocation: string;
    instructions: string;
    instructionsList: string[];
    profileId: string;
    sessionId: string;
    locationError: string;
    locationTrackingError: string;
    permissionDenied: string;
    locationUnavailable: string;
    timeout: string;
    unknownError: string;
  };

  // Common actions
  actions: {
    close: string;
    back: string;
    call: string;
    select: string;
    cancel: string;
    confirm: string;
    retry: string;
    refresh: string;
    update: string;
    enable: string;
    disable: string;
    start: string;
    stop: string;
    continue: string;
    pause: string;
  };

  // Error messages
  // Geolocation
  geolocation: {
    notSupported: string;
    detecting: string;
    success: string;
    permissionDenied: string;
    unavailable: string;
    timeout: string;
  };

  // Common actions
  common: {
    close: string;
    retry: string;
  };

  // Map actions
  map: {
    clickToSelectLocation: string;
  };

  errors: {
    locationPermission: string;
    locationUnavailable: string;
    mapLoadError: string;
    routeCalculationError: string;
    connectionError: string;
    sessionError: string;
    trackingError: string;
    navigationError: string;
    unknownError: string;
  };
}

export const navigationTranslations: Record<'ar' | 'en' | 'fa', NavigationTranslations> = {
  ar: {
    // Distance and time units
    distance: {
      meter: 'متر',
      meterShort: 'م',
      kilometer: 'كيلومتر',
      kilometerShort: 'كم',
    },
    
    time: {
      minute: 'دقيقة',
      minuteShort: 'د',
      second: 'ثانية',
      secondShort: 'ث',
      seconds: 'ثانية',
      and: 'و',
    },

    // Connection and status
    status: {
      noConnection: 'لا يوجد اتصال',
      connected: 'متصل',
      disconnected: 'غير متصل',
      active: 'نشط',
      calculating: 'جاري الحساب',
      found: 'تم العثور عليه',
      notFound: 'لم يتم العثور عليه',
      loading: 'جاري التحميل',
      activeSession: 'جلسة بحث نشطة',
      alreadyActiveSession: 'هناك جلسة نشطة بالفعل لهذا المفقود. تم ربطك بالجلسة الحالية.'
    },

    // Lost person interface
    lostPerson: {
      title: 'الباحث في الطريق إليك',
      subtitle: 'ابق في مكانك وانتظر وصول الباحث',
      searcherInfo: 'معلومات الباحث',
      distance: 'المسافة',
      estimatedArrival: 'الوقت المتوقع للوصول',
      instructions: 'تعليمات',
      stayInPlace: 'ابق في مكانك الحالي',
      lookOutForSearcher: 'انتبه للباحث الذي يقترب منك',
      canSeeSearcher: 'يمكنني رؤية الباحث!',
      call: 'اتصال',
      viewMap: 'عرض الخريطة',
      back: 'عودة',
      liveTracking: 'التتبع المباشر',
      connectionStatus: 'حالة الاتصال',
      mapError: 'خطأ في الخريطة',
      errorDescription: 'حدث خطأ في تحميل الخريطة',
      searchVolunteer: 'متطوع للبحث',
      searcherName: 'اسم الباحث:',
      foundMessage: 'تم العثور عليك!',
      veryCloseMessage: 'الباحث قريب جداً!',
      approachingMessage: 'الباحث يقترب',
      headingToYouMessage: 'باحث في الطريق إليك',
    },

    // Real-time navigation
    realTimeNav: {
      title: 'التوجيه المباشر',
      description: 'توجيه مباشر للباحث للوصول إلى الشخص المفقود',
      searcherDescription: 'يمكنك رؤية موقع الشخص المفقود والتوجه إليه',
      lostPersonDescription: 'يمكنك رؤية موقع الباحث ومعرفة المسافة',
      connectionStatus: 'حالة الاتصال',
      endSession: 'إنهاء الجلسة',
      reconnecting: 'جاري إعادة الاتصال',
      reconnectingMessage: 'جاري إعادة الاتصال بالخادم...',
      tryReconnecting: 'محاولة إعادة الاتصال',
      legend: 'وسيلة الإيضاح',
      searcher: 'الباحث',
      lostPerson: 'الشخص المفقود',
      liveUpdates: 'التحديثات المباشرة',
      updateReceived: 'تم استلام تحديث الموقع',
      navigationInfo: 'معلومات التوجيه',
      foundMessage: 'تم العثور على الشخص المفقود!',
      foundDescription: 'تم العثور على الشخص المفقود بنجاح',
      distance: 'المسافة:',
      estimatedTime: 'الوقت المتوقع:',
      directions: 'التوجيهات:',
      calculatingRoute: 'جاري حساب المسار...',
      recalculate: 'إعادة حساب',
      waitingForLocation: 'في انتظار الموقع...',
      waitingForBothLocations: 'في انتظار مواقع كلا الطرفين...',
    },

    // Route selection
    routeSelection: {
      title: 'اختيار المسار',
      description: 'اختر أفضل مسار للوصول إلى الشخص المفقود',
      loadingAlternatives: 'جاري تحميل خيارات المسار...',
      routeTypes: {
        shortest: 'أقصر',
        fastest: 'أسرع',
        walking: 'للمشي',
      },
      distance: 'المسافة:',
      time: 'الوقت:',
      selected: 'مُحدد',
      selecting: 'جاري التحديد...',
      select: 'تحديد',
      noAlternatives: 'لا توجد بدائل متاحة',
      noAlternativesMessage: 'لم يتم العثور على مسارات بديلة',
      reload: 'إعادة تحميل',
      instructions: 'تعليمات:',
      instructionSteps: [
        'اختر نوع المسار المفضل',
        'انقر على "تحديد" لاختيار المسار',
        'سيتم عرض التوجيهات التفصيلية',
        'اتبع التوجيهات للوصول إلى الهدف',
      ],
    },

    // Searcher interface
    searcher: {
      title: 'جلسة البحث النشطة',
      searcherInfo: 'معلومات الباحث',
      searcherInfoDescription: 'أنت مُسجل كباحث في هذه الجلسة',
      active: 'نشط',
      back: 'رجوع',
      liveNavigation: 'التوجيه المباشر',
      liveNavigationDescription: 'خريطة مباشرة تُظهر موقعك وموقع الشخص المفقود',
      openNavigation: 'فتح التوجيه',
      directContact: 'اتصال مباشر',
      contactDescription: 'تواصل مباشرة مع الشخص المفقود',
      call: 'اتصال',
      sessionInfo: 'معلومات الجلسة',
      sessionId: 'معرف الجلسة:',
      profileId: 'معرف الملف الشخصي:',
      searchInstructions: 'تعليمات البحث',
      instructionsList: [
        'تأكد من تفعيل GPS في هاتفك',
        'استخدم الخريطة المباشرة للتوجه نحو الشخص المفقود',
        'راقب المسافة والوقت المتوقع للوصول',
        'تواصل مع الشخص المفقود عند الاقتراب',
        'اتبع إرشادات السلامة أثناء البحث',
        'أبلغ عن أي مشاكل أو عوائق فوراً',
      ],
      navigationError: 'خطأ في التوجيه',
      navigationErrorDescription: 'لا يمكن الوصول إلى خدمة التوجيه',
    },

    // Live tracking
    liveTracking: {
      title: 'التتبع المباشر',
      liveNavigation: 'التوجيه المباشر',
      stopTracking: 'إيقاف التتبع',
      connectionStatus: 'حالة الاتصال المباشر',
      trackingEnabled: 'التتبع مُفعل',
      trackingDisabled: 'التتبع مُعطل',
      locationTracking: 'تتبع الموقع',
      trackingActive: 'التتبع نشط',
      trackingInactive: 'التتبع غير نشط',
      gpsAccurate: 'GPS دقيق',
      gpsInaccurate: 'GPS غير دقيق',
      profileData: 'بيانات الملف الشخصي المباشرة',
      profileFields: {
        name: 'الاسم:',
        age: 'العمر:',
        gender: 'الجنس:',
        lastSeen: 'آخر مرة شوهد:',
        clothing: 'الملابس:',
        medicalConditions: 'الحالات الطبية:',
        phone: 'الهاتف:',
        emergencyContact: 'جهة الاتصال الطارئة:',
      },
      profileId: 'معرف الملف الشخصي:',
      updateFrequency: 'تحديث كل 5 ثواني',
      lastUpdate: 'آخر تحديث:',
    },

    // Navigation map
    navigationMap: {
      title: 'التوجيه والملاحة',
      close: 'إغلاق',
      locationStatus: 'حالة الموقع:',
      trackingEnabled: 'التتبع مُفعل',
      trackingDisabled: 'التتبع مُعطل',
      coordinates: 'الإحداثيات:',
      updateLocation: 'تحديث الموقع',
      instructions: 'تعليمات التوجيه:',
      instructionsList: [
        'تأكد من تفعيل خدمات الموقع',
        'ابق في منطقة مكشوفة للحصول على إشارة GPS أفضل',
        'لا تتحرك من مكانك إلا إذا طُلب منك ذلك',
        'حافظ على شحن البطارية',
        'تواصل مع الباحث عند الاقتراب',
        'انتبه للبيئة المحيطة بك',
        'اتبع تعليمات الأمان',
      ],
      profileId: 'معرف الملف الشخصي:',
      sessionId: 'معرف الجلسة:',
      locationError: 'خطأ في تحديد الموقع',
      locationTrackingError: 'فشل في تتبع الموقع',
      permissionDenied: 'تم رفض إذن الموقع',
      locationUnavailable: 'الموقع غير متاح',
      timeout: 'انتهت مهلة الطلب',
      unknownError: 'خطأ غير معروف',
    },

    // Common actions
    actions: {
      close: 'إغلاق',
      back: 'رجوع',
      call: 'اتصال',
      select: 'تحديد',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      retry: 'إعادة المحاولة',
      refresh: 'تحديث',
      update: 'تحديث',
      enable: 'تفعيل',
      disable: 'إلغاء',
      start: 'بدء',
      stop: 'توقف',
      continue: 'متابعة',
      pause: 'إيقاف مؤقت',
    },

    // Geolocation
    geolocation: {
      notSupported: 'متصفحك لا يدعم تحديد الموقع',
      detecting: 'جاري تحديد موقعك...',
      success: 'تم تحديد موقعك بنجاح',
      permissionDenied: 'تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع.',
      unavailable: 'معلومات الموقع غير متاحة',
      timeout: 'انتهت مهلة طلب تحديد الموقع',
    },

    // Common actions
    common: {
      close: 'إغلاق',
      retry: 'إعادة المحاولة',
    },

    // Map actions
    map: {
      clickToSelectLocation: 'اضغط لتحديد الموقع بدقة',
    },

    // Error messages
    errors: {
      locationPermission: 'يرجى السماح بالوصول إلى الموقع',
      locationUnavailable: 'خدمة الموقع غير متاحة',
      mapLoadError: 'فشل في تحميل الخريطة',
      routeCalculationError: 'فشل في حساب المسار',
      connectionError: 'خطأ في الاتصال',
      sessionError: 'خطأ في الجلسة',
      trackingError: 'خطأ في التتبع',
      navigationError: 'خطأ في التوجيه',
      unknownError: 'حدث خطأ غير متوقع',
    },
  },

  en: {
    // Distance and time units
    distance: {
      meter: 'meter',
      meterShort: 'm',
      kilometer: 'kilometer',
      kilometerShort: 'km',
    },
    
    time: {
      minute: 'minute',
      minuteShort: 'min',
      second: 'second',
      secondShort: 'sec',
      seconds: 'seconds',
      and: 'and',
    },

    // Connection and status
    status: {
      noConnection: 'No Connection',
      connected: 'Connected',
      disconnected: 'Disconnected',
      active: 'Active',
      calculating: 'Calculating',
      found: 'Found',
      notFound: 'Not Found',
      loading: 'Loading',
      activeSession: 'Active Search Session',
      alreadyActiveSession: 'A session for this lost person is already active. You have been connected to the existing session.'
    },

    // Lost person interface
    lostPerson: {
      title: 'Searcher Coming to You',
      subtitle: 'Stay in your location and wait for the searcher',
      searcherInfo: 'Searcher Information',
      distance: 'Distance',
      estimatedArrival: 'Estimated Arrival',
      instructions: 'Instructions',
      stayInPlace: 'Stay in your current location',
      lookOutForSearcher: 'Look out for the approaching searcher',
      canSeeSearcher: 'I can see the searcher!',
      call: 'Call',
      viewMap: 'View Map',
      back: 'Back',
      liveTracking: 'Live Tracking',
      connectionStatus: 'Connection Status',
      mapError: 'Map Error',
      errorDescription: 'An error occurred while loading the map',
      searchVolunteer: 'Search Volunteer',
      searcherName: 'Searcher name:',
      foundMessage: 'You have been found!',
      veryCloseMessage: 'Searcher is very close!',
      approachingMessage: 'Searcher approaching',
      headingToYouMessage: 'Searcher heading to you',
    },

    // Real-time navigation
    realTimeNav: {
      title: 'Real-Time Navigation',
      description: 'Live navigation for searcher to reach lost person',
      searcherDescription: 'You can see the lost person\'s location and navigate to them',
      lostPersonDescription: 'You can see the searcher\'s location and distance',
      connectionStatus: 'Connection Status',
      endSession: 'End Session',
      reconnecting: 'Reconnecting',
      reconnectingMessage: 'Reconnecting to server...',
      tryReconnecting: 'Try Reconnecting',
      legend: 'Legend',
      searcher: 'Searcher',
      lostPerson: 'Lost Person',
      liveUpdates: 'Live Updates',
      updateReceived: 'Location update received',
      navigationInfo: 'Navigation Info',
      foundMessage: 'Lost Person Found!',
      foundDescription: 'The lost person has been found successfully',
      distance: 'Distance:',
      estimatedTime: 'Estimated Time:',
      directions: 'Directions:',
      calculatingRoute: 'Calculating route...',
      recalculate: 'Recalculate',
      waitingForLocation: 'Waiting for location...',
      waitingForBothLocations: 'Waiting for both locations...',
    },

    // Route selection
    routeSelection: {
      title: 'Route Selection',
      description: 'Choose the best route to reach the lost person',
      loadingAlternatives: 'Loading route alternatives...',
      routeTypes: {
        shortest: 'Shortest',
        fastest: 'Fastest',
        walking: 'Walking',
      },
      distance: 'Distance:',
      time: 'Time:',
      selected: 'Selected',
      selecting: 'Selecting...',
      select: 'Select',
      noAlternatives: 'No alternatives available',
      noAlternativesMessage: 'No alternative routes found',
      reload: 'Reload',
      instructions: 'Instructions:',
      instructionSteps: [
        'Choose your preferred route type',
        'Click "Select" to choose the route',
        'Detailed directions will be displayed',
        'Follow the directions to reach the destination',
      ],
    },

    // Searcher interface
    searcher: {
      title: 'Active Search Session',
      searcherInfo: 'Searcher Information',
      searcherInfoDescription: 'You are registered as a searcher in this session',
      active: 'Active',
      back: 'Back',
      liveNavigation: 'Live Navigation',
      liveNavigationDescription: 'Live map showing your location and the lost person\'s location',
      openNavigation: 'Open Navigation',
      directContact: 'Direct Contact',
      contactDescription: 'Communicate directly with the lost person',
      call: 'Call',
      sessionInfo: 'Session Information',
      sessionId: 'Session ID:',
      profileId: 'Profile ID:',
      searchInstructions: 'Search Instructions',
      instructionsList: [
        'Ensure GPS is enabled on your device',
        'Use the live map to navigate towards the lost person',
        'Monitor distance and estimated arrival time',
        'Contact the lost person when approaching',
        'Follow safety guidelines during search',
        'Report any issues or obstacles immediately',
      ],
      navigationError: 'Navigation Error',
      navigationErrorDescription: 'Cannot access navigation service',
    },

    // Live tracking
    liveTracking: {
      title: 'Live Tracking',
      liveNavigation: 'Live Navigation',
      stopTracking: 'Stop Tracking',
      connectionStatus: 'Live Connection Status',
      trackingEnabled: 'Tracking Enabled',
      trackingDisabled: 'Tracking Disabled',
      locationTracking: 'Location Tracking',
      trackingActive: 'Tracking Active',
      trackingInactive: 'Tracking Inactive',
      gpsAccurate: 'GPS Accurate',
      gpsInaccurate: 'GPS Inaccurate',
      profileData: 'Live Profile Data',
      profileFields: {
        name: 'Name:',
        age: 'Age:',
        gender: 'Gender:',
        lastSeen: 'Last Seen:',
        clothing: 'Clothing:',
        medicalConditions: 'Medical Conditions:',
        phone: 'Phone:',
        emergencyContact: 'Emergency Contact:',
      },
      profileId: 'Profile ID:',
      updateFrequency: 'Updates every 5 seconds',
      lastUpdate: 'Last Update:',
    },

    // Navigation map
    navigationMap: {
      title: 'Navigation & Guidance',
      close: 'Close',
      locationStatus: 'Location Status:',
      trackingEnabled: 'Tracking Enabled',
      trackingDisabled: 'Tracking Disabled',
      coordinates: 'Coordinates:',
      updateLocation: 'Update Location',
      instructions: 'Navigation Instructions:',
      instructionsList: [
        'Ensure location services are enabled',
        'Stay in an open area for better GPS signal',
        'Do not move from your location unless instructed',
        'Keep your battery charged',
        'Contact searcher when they approach',
        'Be aware of your surroundings',
        'Follow safety instructions',
      ],
      profileId: 'Profile ID:',
      sessionId: 'Session ID:',
      locationError: 'Location Error',
      locationTrackingError: 'Location tracking failed',
      permissionDenied: 'Location permission denied',
      locationUnavailable: 'Location unavailable',
      timeout: 'Request timeout',
      unknownError: 'Unknown error',
    },

    // Common actions
    actions: {
      close: 'Close',
      back: 'Back',
      call: 'Call',
      select: 'Select',
      cancel: 'Cancel',
      confirm: 'Confirm',
      retry: 'Retry',
      refresh: 'Refresh',
      update: 'Update',
      enable: 'Enable',
      disable: 'Disable',
      start: 'Start',
      stop: 'Stop',
      continue: 'Continue',
      pause: 'Pause',
    },

    // Geolocation
    geolocation: {
      notSupported: 'Your browser doesn\'t support geolocation',
      detecting: 'Detecting your location...',
      success: 'Location detected successfully',
      permissionDenied: 'Location permission denied. Please allow location access.',
      unavailable: 'Location information unavailable',
      timeout: 'Location request timeout',
    },

    // Common actions
    common: {
      close: 'Close',
      retry: 'Retry',
    },

    // Map actions
    map: {
      clickToSelectLocation: 'Click to select location precisely',
    },

    // Error messages
    errors: {
      locationPermission: 'Please allow location access',
      locationUnavailable: 'Location service unavailable',
      mapLoadError: 'Failed to load map',
      routeCalculationError: 'Failed to calculate route',
      connectionError: 'Connection error',
      sessionError: 'Session error',
      trackingError: 'Tracking error',
      navigationError: 'Navigation error',
      unknownError: 'An unexpected error occurred',
    },
  },

  fa: {
    // Distance and time units
    distance: {
      meter: 'متر',
      meterShort: 'م',
      kilometer: 'کیلومتر',
      kilometerShort: 'کم',
    },
    
    time: {
      minute: 'دقیقه',
      minuteShort: 'د',
      second: 'ثانیه',
      secondShort: 'ث',
      seconds: 'ثانیه',
      and: 'و',
    },

    // Connection and status
    status: {
  noConnection: 'عدم اتصال',
  connected: 'متصل',
  disconnected: 'قطع شده',
  active: 'فعال',
  calculating: 'در حال محاسبه',
  found: 'پیدا شد',
  notFound: 'پیدا نشد',
  loading: 'در حال بارگذاری',
  activeSession: 'جلسه جستجوی فعال',
  alreadyActiveSession: 'یک جلسه برای این فرد گمشده در حال حاضر فعال است. شما به جلسه موجود متصل شده‌اید.',
    },

    // Lost person interface
    lostPerson: {
      title: 'جستجوگر در راه شماست',
      subtitle: 'در مکان خود بمانید و منتظر رسیدن جستجوگر باشید',
      searcherInfo: 'اطلاعات جستجوگر',
      distance: 'فاصله',
      estimatedArrival: 'زمان تخمینی رسیدن',
      instructions: 'دستورالعمل‌ها',
      stayInPlace: 'در مکان فعلی خود بمانید',
      lookOutForSearcher: 'مراقب جستجوگری باشید که به شما نزدیک می‌شود',
      canSeeSearcher: 'می‌توانم جستجوگر را ببینم!',
      call: 'تماس',
      viewMap: 'مشاهده نقشه',
      back: 'بازگشت',
      liveTracking: 'ردیابی زنده',
      connectionStatus: 'وضعیت اتصال',
      mapError: 'خطای نقشه',
      errorDescription: 'خطایی در بارگذاری نقشه رخ داد',
      searchVolunteer: 'داوطلب جستجو',
      searcherName: 'نام جستجوگر:',
      foundMessage: 'شما پیدا شدید!',
      veryCloseMessage: 'جستجوگر خیلی نزدیک است!',
      approachingMessage: 'جستجوگر نزدیک می‌شود',
      headingToYouMessage: 'جستجوگر به سمت شما می‌آید',
    },

    // Real-time navigation
    realTimeNav: {
      title: 'ناوبری زنده',
      description: 'ناوبری زنده برای جستجوگر تا به فرد گمشده برسد',
      searcherDescription: 'می‌توانید موقعیت فرد گمشده را ببینید و به سمت او بروید',
      lostPersonDescription: 'می‌توانید موقعیت جستجوگر و فاصله را ببینید',
      connectionStatus: 'وضعیت اتصال',
      endSession: 'پایان جلسه',
      reconnecting: 'در حال اتصال مجدد',
      reconnectingMessage: 'در حال اتصال مجدد به سرور...',
      tryReconnecting: 'تلاش برای اتصال مجدد',
      legend: 'راهنما',
      searcher: 'جستجوگر',
      lostPerson: 'فرد گمشده',
      liveUpdates: 'به‌روزرسانی زنده',
      updateReceived: 'به‌روزرسانی موقعیت دریافت شد',
      navigationInfo: 'اطلاعات ناوبری',
      foundMessage: 'فرد گمشده پیدا شد!',
      foundDescription: 'فرد گمشده با موفقیت پیدا شد',
      distance: 'فاصله:',
      estimatedTime: 'زمان تخمینی:',
      directions: 'جهت‌ها:',
      calculatingRoute: 'در حال محاسبه مسیر...',
      recalculate: 'محاسبه مجدد',
      waitingForLocation: 'در انتظار موقعیت...',
      waitingForBothLocations: 'در انتظار موقعیت هر دو طرف...',
    },

    // Route selection
    routeSelection: {
      title: 'انتخاب مسیر',
      description: 'بهترین مسیر برای رسیدن به فرد گمشده را انتخاب کنید',
      loadingAlternatives: 'در حال بارگذاری گزینه‌های مسیر...',
      routeTypes: {
        shortest: 'کوتاه‌ترین',
        fastest: 'سریع‌ترین',
        walking: 'پیاده‌روی',
      },
      distance: 'فاصله:',
      time: 'زمان:',
      selected: 'انتخاب شده',
      selecting: 'در حال انتخاب...',
      select: 'انتخاب',
      noAlternatives: 'هیچ جایگزینی موجود نیست',
      noAlternativesMessage: 'هیچ مسیر جایگزینی یافت نشد',
      reload: 'بارگذاری مجدد',
      instructions: 'دستورالعمل‌ها:',
      instructionSteps: [
        'نوع مسیر مورد نظر خود را انتخاب کنید',
        'روی "انتخاب" کلیک کنید تا مسیر را انتخاب کنید',
        'جهت‌های تفصیلی نمایش داده خواهد شد',
        'جهت‌ها را دنبال کنید تا به مقصد برسید',
      ],
    },

    // Searcher interface
    searcher: {
      title: 'جلسه جستجوی فعال',
      searcherInfo: 'اطلاعات جستجوگر',
      searcherInfoDescription: 'شما به عنوان جستجوگر در این جلسه ثبت شده‌اید',
      active: 'فعال',
      back: 'بازگشت',
      liveNavigation: 'ناوبری زنده',
      liveNavigationDescription: 'نقشه زنده که موقعیت شما و فرد گمشده را نشان می‌دهد',
      openNavigation: 'باز کردن ناوبری',
      directContact: 'تماس مستقیم',
      contactDescription: 'مستقیماً با فرد گمشده ارتباط برقرار کنید',
      call: 'تماس',
      sessionInfo: 'اطلاعات جلسه',
      sessionId: 'شناسه جلسه:',
      profileId: 'شناسه نمایه:',
      searchInstructions: 'دستورالعمل‌های جستجو',
      instructionsList: [
        'اطمینان حاصل کنید که GPS در دستگاه شما فعال است',
        'از نقشه زنده برای حرکت به سمت فرد گمشده استفاده کنید',
        'فاصله و زمان تخمینی رسیدن را کنترل کنید',
        'هنگام نزدیک شدن با فرد گمشده تماس بگیرید',
        'دستورالعمل‌های ایمنی را در طول جستجو دنبال کنید',
        'هر مشکل یا مانعی را فوراً گزارش دهید',
      ],
      navigationError: 'خطای ناوبری',
      navigationErrorDescription: 'دسترسی به سرویس ناوبری امکان‌پذیر نیست',
    },

    // Live tracking
    liveTracking: {
      title: 'ردیابی زنده',
      liveNavigation: 'ناوبری زنده',
      stopTracking: 'توقف ردیابی',
      connectionStatus: 'وضعیت اتصال زنده',
      trackingEnabled: 'ردیابی فعال',
      trackingDisabled: 'ردیابی غیرفعال',
      locationTracking: 'ردیابی موقعیت',
      trackingActive: 'ردیابی فعال',
      trackingInactive: 'ردیابی غیرفعال',
      gpsAccurate: 'GPS دقیق',
      gpsInaccurate: 'GPS غیردقیق',
      profileData: 'داده‌های نمایه زنده',
      profileFields: {
        name: 'نام:',
        age: 'سن:',
        gender: 'جنسیت:',
        lastSeen: 'آخرین بار دیده شده:',
        clothing: 'لباس:',
        medicalConditions: 'شرایط پزشکی:',
        phone: 'تلفن:',
        emergencyContact: 'تماس اضطراری:',
      },
      profileId: 'شناسه نمایه:',
      updateFrequency: 'به‌روزرسانی هر 5 ثانیه',
      lastUpdate: 'آخرین به‌روزرسانی:',
    },

    // Navigation map
    navigationMap: {
      title: 'ناوبری و راهنمایی',
      close: 'بستن',
      locationStatus: 'وضعیت موقعیت:',
      trackingEnabled: 'ردیابی فعال',
      trackingDisabled: 'ردیابی غیرفعال',
      coordinates: 'مختصات:',
      updateLocation: 'به‌روزرسانی موقعیت',
      instructions: 'دستورالعمل‌های ناوبری:',
      instructionsList: [
        'اطمینان حاصل کنید که سرویس‌های موقعیت فعال هستند',
        'در منطقه باز بمانید تا سیگنال GPS بهتری داشته باشید',
        'از مکان خود حرکت نکنید مگر اینکه دستور داده شود',
        'باتری خود را شارژ نگه دارید',
        'هنگام نزدیک شدن جستجوگر با او تماس بگیرید',
        'از محیط اطراف خود آگاه باشید',
        'دستورالعمل‌های ایمنی را دنبال کنید',
      ],
      profileId: 'شناسه نمایه:',
      sessionId: 'شناسه جلسه:',
      locationError: 'خطای موقعیت',
      locationTrackingError: 'ردیابی موقعیت ناموفق',
      permissionDenied: 'اجازه موقعیت رد شد',
      locationUnavailable: 'موقعیت در دسترس نیست',
      timeout: 'زمان درخواست تمام شد',
      unknownError: 'خطای ناشناخته',
    },

    // Common actions
    actions: {
      close: 'بستن',
      back: 'بازگشت',
      call: 'تماس',
      select: 'انتخاب',
      cancel: 'لغو',
      confirm: 'تأیید',
      retry: 'تلاش مجدد',
      refresh: 'تازه‌سازی',
      update: 'به‌روزرسانی',
      enable: 'فعال‌سازی',
      disable: 'غیرفعال‌سازی',
      start: 'شروع',
      stop: 'توقف',
      continue: 'ادامه',
      pause: 'مکث',
    },

    // Geolocation
    geolocation: {
      notSupported: 'مرورگر شما موقعیت‌یابی را پشتیبانی نمی‌کند',
      detecting: 'در حال تشخیص موقعیت شما...',
      success: 'موقعیت با موفقیت تشخیص داده شد',
      permissionDenied: 'دسترسی موقعیت رد شد. لطفاً دسترسی موقعیت را مجاز کنید.',
      unavailable: 'اطلاعات موقعیت در دسترس نیست',
      timeout: 'زمان درخواست موقعیت تمام شد',
    },

    // Common actions
    common: {
      close: 'بستن',
      retry: 'تلاش مجدد',
    },

    // Map actions
    map: {
      clickToSelectLocation: 'برای انتخاب دقیق موقعیت کلیک کنید',
    },

    // Error messages
    errors: {
      locationPermission: 'لطفاً دسترسی به موقعیت را مجاز کنید',
      locationUnavailable: 'سرویس موقعیت در دسترس نیست',
      mapLoadError: 'بارگذاری نقشه ناموفق',
      routeCalculationError: 'محاسبه مسیر ناموفق',
      connectionError: 'خطای اتصال',
      sessionError: 'خطای جلسه',
      trackingError: 'خطای ردیابی',
      navigationError: 'خطای ناوبری',
      unknownError: 'خطای غیرمنتظره‌ای رخ داد',
    },
  },
};