"use client";

import { Card } from "@/components/ui/card";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { Settings, User, Bell, Shield, Database, Globe } from "lucide-react";

export default function SettingsPage() {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'الإعدادات' :
             currentLanguage === 'fa' ? 'تنظیمات' :
             'Settings'}
          </h1>
          <p className={`mt-2 text-gray-600 dark:text-gray-400 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'إدارة إعدادات النظام والتكوين' :
             currentLanguage === 'fa' ? 'مدیریت تنظیمات سیستم و پیکربندی' :
             'Manage system settings and configuration'}
          </p>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLanguage === 'ar' ? 'الملف الشخصي' :
                 currentLanguage === 'fa' ? 'پروفایل' :
                 'Profile'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'إدارة معلومات الحساب الشخصي' :
               currentLanguage === 'fa' ? 'مدیریت اطلاعات حساب کاربری' :
               'Manage your account information'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLanguage === 'ar' ? 'الإشعارات' :
                 currentLanguage === 'fa' ? 'اعلان ها' :
                 'Notifications'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'تكوين تفضيلات الإشعارات' :
               currentLanguage === 'fa' ? 'تنظیم اولویت های اعلان' :
               'Configure notification preferences'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLanguage === 'ar' ? 'الأمان' :
                 currentLanguage === 'fa' ? 'امنیت' :
                 'Security'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'إعدادات الأمان وكلمات المرور' :
               currentLanguage === 'fa' ? 'تنظیمات امنیتی و رمز عبور' :
               'Security settings and passwords'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                <Database className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLanguage === 'ar' ? 'البيانات' :
                 currentLanguage === 'fa' ? 'داده ها' :
                 'Data'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'إدارة البيانات والنسخ الاحتياطية' :
               currentLanguage === 'fa' ? 'مدیریت داده ها و پشتیبان گیری' :
               'Data management and backups'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mr-3">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLanguage === 'ar' ? 'اللغة والمنطقة' :
                 currentLanguage === 'fa' ? 'زبان و منطقه' :
                 'Language & Region'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'تفضيلات اللغة والمنطقة الزمنية' :
               currentLanguage === 'fa' ? 'تنظیمات زبان و منطقه زمانی' :
               'Language and timezone preferences'}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLanguage === 'ar' ? 'النظام' :
                 currentLanguage === 'fa' ? 'سیستم' :
                 'System'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLanguage === 'ar' ? 'إعدادات النظام المتقدمة' :
               currentLanguage === 'fa' ? 'تنظیمات پیشرفته سیستم' :
               'Advanced system settings'}
            </p>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="p-6">
          <div className="text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {currentLanguage === 'ar' ? 'قريباً' :
               currentLanguage === 'fa' ? 'به زودی' :
               'Coming Soon'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLanguage === 'ar' ? 'واجهات إعدادات مفصلة ستكون متاحة قريباً' :
               currentLanguage === 'fa' ? 'رابط های تنظیمات تفصیلی به زودی در دسترس خواهد بود' :
               'Detailed settings interfaces will be available soon'}
            </p>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
}