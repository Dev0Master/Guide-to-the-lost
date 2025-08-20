class NotificationService {
  private static instance: NotificationService;
  
  private constructor() {}
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<Notification | null> {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    // Filter out unsupported options for regular notifications
    const safeOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: true,
      ...options
    };

    // Filter out actions as they're not supported in regular notifications

    try {
      const notification = new Notification(title, safeOptions);
      
      // Add click handler to focus the window
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      // Auto-close notification after 10 seconds if requireInteraction is false
      if (!safeOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Specific notification methods for the GFL app
  async notifyTrackingStarted(searcherName: string, currentLanguage: string = 'ar'): Promise<Notification | null> {
    const title = currentLanguage === 'ar' 
      ? 'تم بدء تتبعك!'
      : 'Someone started tracking you!';
    
    const body = currentLanguage === 'ar'
      ? `الباحث "${searcherName}" يحاول الوصول إليك. يرجى البقاء في مكانك.`
      : `Searcher "${searcherName}" is trying to reach you. Please stay in place.`;

    return this.showNotification(title, {
      body,
      tag: 'tracking-started',
      icon: '/favicon.ico'
      // Note: Actions are only supported in Service Worker notifications
      // For regular notifications, we'll rely on click handling
    });
  }

  async notifySearcherNearby(distance: number, currentLanguage: string = 'ar'): Promise<Notification | null> {
    const title = currentLanguage === 'ar' 
      ? 'الباحث قريب منك!'
      : 'Searcher is nearby!';
    
    const body = currentLanguage === 'ar'
      ? `الباحث على بُعد ${Math.round(distance)} متر تقريباً.`
      : `Searcher is approximately ${Math.round(distance)} meters away.`;

    return this.showNotification(title, {
      body,
      tag: 'searcher-nearby',
      icon: '/favicon.ico'
    });
  }

  async notifyLocationUpdate(currentLanguage: string = 'ar'): Promise<Notification | null> {
    const title = currentLanguage === 'ar' 
      ? 'تم تحديث موقعك'
      : 'Location Updated';
    
    const body = currentLanguage === 'ar'
      ? 'تم إرسال موقعك المحدث للباحث.'
      : 'Your updated location has been sent to the searcher.';

    return this.showNotification(title, {
      body,
      tag: 'location-update',
      icon: '/favicon.ico',
      silent: true,
      requireInteraction: false
    });
  }

  async notifyTrackingEnded(currentLanguage: string = 'ar'): Promise<Notification | null> {
    const title = currentLanguage === 'ar' 
      ? 'انتهت جلسة التتبع'
      : 'Tracking Session Ended';
    
    const body = currentLanguage === 'ar'
      ? 'تم إنهاء جلسة التتبع. نأمل أن تكون بخير!'
      : 'Tracking session has ended. Hope you are safe!';

    return this.showNotification(title, {
      body,
      tag: 'tracking-ended',
      icon: '/favicon.ico'
    });
  }

  async notifyResolved(currentLanguage: string = 'ar'): Promise<Notification | null> {
    const title = currentLanguage === 'ar' 
      ? '🎉 تم العثور عليك!'
      : '🎉 You have been found!';
    
    const body = currentLanguage === 'ar'
      ? 'تم وضع علامة عليك كشخص تم العثور عليه. الحمد لله على سلامتك!'
      : 'You have been marked as found. Glad you are safe!';

    return this.showNotification(title, {
      body,
      tag: 'resolved',
      icon: '/favicon.ico',
      requireInteraction: true
    });
  }

  // Close all notifications with a specific tag
  closeNotificationsByTag(tag: string): void {
    // Note: This is limited by browser API - we can only close notifications we created
    // Most browsers don't provide a way to programmatically close all notifications
    console.log(`Attempting to close notifications with tag: ${tag}`);
  }

  // Helper method to calculate distance between two coordinates
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
}

export default NotificationService;