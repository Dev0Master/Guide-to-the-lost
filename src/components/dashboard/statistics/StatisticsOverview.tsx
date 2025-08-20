"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  UserCheck,
  MapPin,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatCard {
  title: { en: string; ar: string; fa: string };
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'lost_registered' | 'session_started' | 'person_found' | 'center_added';
  message: { en: string; ar: string; fa: string };
  timestamp: Date;
  status: 'success' | 'warning' | 'info';
}

export function StatisticsOverview() {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);

  // Mock data for statistics cards
  const statCards: StatCard[] = [
    {
      title: {
        en: "Total Lost Persons",
        ar: "إجمالي المفقودين",
        fa: "کل افراد گمشده"
      },
      value: "1,247",
      change: 12,
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: {
        en: "Found Today",
        ar: "تم العثور عليهم اليوم", 
        fa: "امروز پیدا شده"
      },
      value: "23",
      change: 8,
      changeType: 'increase',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: {
        en: "Active Sessions",
        ar: "الجلسات النشطة",
        fa: "جلسات فعال"
      },
      value: "45",
      change: -3,
      changeType: 'decrease',
      icon: Activity,
      color: 'bg-orange-500'
    },
    {
      title: {
        en: "Search Centers",
        ar: "مراكز البحث",
        fa: "مراکز جستجو"  
      },
      value: "18",
      change: 2,
      changeType: 'increase',
      icon: MapPin,
      color: 'bg-purple-500'
    },
    {
      title: {
        en: "Active Campaigns",
        ar: "الحملات النشطة",
        fa: "کمپین های فعال"
      },
      value: "7",
      change: 0,
      changeType: 'neutral', 
      icon: Target,
      color: 'bg-indigo-500'
    }
  ];

  // Mock data for recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'lost_registered',
      message: {
        en: 'New lost person registered: Ahmed Ali',
        ar: 'تم تسجيل مفقود جديد: أحمد علي',
        fa: 'فرد گمشده جدید ثبت شد: احمد علی'
      },
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      status: 'info'
    },
    {
      id: '2', 
      type: 'person_found',
      message: {
        en: 'Person found: Sara Mohammed',
        ar: 'تم العثور على: سارة محمد',
        fa: 'فرد پیدا شد: سارا محمد'
      },
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      status: 'success'
    },
    {
      id: '3',
      type: 'session_started',
      message: {
        en: 'New search session started',
        ar: 'بدأت جلسة بحث جديدة',
        fa: 'جلسه جستجوی جدید شروع شد'
      },
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      status: 'info'
    },
    {
      id: '4',
      type: 'center_added',
      message: {
        en: 'New search center added: Samarra North',
        ar: 'تم إضافة مركز بحث جديد: سامراء الشمالي',
        fa: 'مرکز جستجوی جدید اضافه شد: سامرا شمال'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      status: 'success'
    }
  ];

  // Chart data
  const lostPersonsOverTime = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: currentLanguage === 'ar' ? 'المفقودين' : 
               currentLanguage === 'fa' ? 'گمشده ها' : 'Lost Persons',
        data: [120, 150, 180, 220, 190, 247],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
      {
        label: currentLanguage === 'ar' ? 'تم العثور عليهم' : 
               currentLanguage === 'fa' ? 'پیدا شده ها' : 'Found',
        data: [110, 140, 165, 200, 175, 220],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
      }
    ],
  };

  const sessionsByStatus = {
    labels: [
      currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'fa' ? 'فعال' : 'Active',
      currentLanguage === 'ar' ? 'مكتمل' : currentLanguage === 'fa' ? 'کامل' : 'Completed', 
      currentLanguage === 'ar' ? 'منتهي' : currentLanguage === 'fa' ? 'پایان یافته' : 'Ended'
    ],
    datasets: [
      {
        data: [45, 120, 85],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)', 
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const geographicDistribution = {
    labels: [
      currentLanguage === 'ar' ? 'سامراء المركز' : 'Samarra Center',
      currentLanguage === 'ar' ? 'سامراء الشمال' : 'Samarra North',
      currentLanguage === 'ar' ? 'سامراء الجنوب' : 'Samarra South',
      currentLanguage === 'ar' ? 'سامراء الشرق' : 'Samarra East',
      currentLanguage === 'ar' ? 'سامراء الغرب' : 'Samarra West'
    ],
    datasets: [
      {
        label: currentLanguage === 'ar' ? 'عدد المفقودين' : 
               currentLanguage === 'fa' ? 'تعداد گمشده ها' : 'Number of Lost Persons',
        data: [65, 45, 35, 42, 30],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: currentLanguage === 'ar' || currentLanguage === 'fa',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) {
      return currentLanguage === 'ar' ? `منذ ${minutes} دقيقة` :
             currentLanguage === 'fa' ? `${minutes} دقیقه پیش` :
             `${minutes} minutes ago`;
    } else {
      return currentLanguage === 'ar' ? `منذ ${hours} ساعة` :
             currentLanguage === 'fa' ? `${hours} ساعت پیش` :
             `${hours} hours ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${dir.textAlign}`}>
          {currentLanguage === 'ar' ? 'نظرة عامة على الإحصائيات' :
           currentLanguage === 'fa' ? 'بررسی آمار کلی' :
           'Statistics Overview'}
        </h1>
        <p className={`mt-2 text-gray-600 dark:text-gray-400 ${dir.textAlign}`}>
          {currentLanguage === 'ar' ? 'تتبع الأداء والمقاييس الرئيسية لنظام توجيه المفقودين' :
           currentLanguage === 'fa' ? 'پیگیری عملکرد و معیارهای کلیدی سیستم راهنمای گمشدگان' :
           'Track performance and key metrics for the Guide to the Lost system'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${card.color} rounded-lg p-3`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex-1 ${currentLanguage === 'ar' || currentLanguage === 'fa' ? 'mr-4' : 'ml-4'}`}>
                <div className={`text-sm font-medium text-gray-500 dark:text-gray-400 truncate ${dir.textAlign}`}>
                  {card.title[currentLanguage as keyof typeof card.title]}
                </div>
                <div className={`text-2xl font-bold text-gray-900 dark:text-white ${dir.textAlign}`}>
                  {card.value}
                </div>
              </div>
              <div className={`flex items-center text-sm ${
                card.changeType === 'increase' ? 'text-green-600' :
                card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {card.changeType === 'increase' && <TrendingUp className="h-4 w-4 mr-1" />}
                {card.changeType === 'decrease' && <TrendingDown className="h-4 w-4 mr-1" />}
                {Math.abs(card.change)}%
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lost Persons Over Time */}
        <Card className="p-6">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'المفقودون عبر الزمن' :
             currentLanguage === 'fa' ? 'گمشدگان در طول زمان' :
             'Lost Persons Over Time'}
          </h3>
          <div className="h-80">
            <Line data={lostPersonsOverTime} options={chartOptions} />
          </div>
        </Card>

        {/* Sessions by Status */}
        <Card className="p-6">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'الجلسات حسب الحالة' :
             currentLanguage === 'fa' ? 'جلسات بر اساس وضعیت' :
             'Sessions by Status'}
          </h3>
          <div className="h-80">
            <Doughnut data={sessionsByStatus} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-6">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'التوزيع الجغرافي' :
             currentLanguage === 'fa' ? 'توزیع جغرافیایی' :
             'Geographic Distribution'}
          </h3>
          <div className="h-80">
            <Bar data={geographicDistribution} options={chartOptions} />
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'الأنشطة الأخيرة' :
             currentLanguage === 'fa' ? 'فعالیت های اخیر' :
             'Recent Activities'}
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-0.5 ${
                  activity.status === 'success' ? 'text-green-500' :
                  activity.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`}>
                  {activity.status === 'success' ? <UserCheck className="h-5 w-5" /> :
                   activity.status === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                   <Activity className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-gray-900 dark:text-white ${dir.textAlign}`}>
                    {activity.message[currentLanguage as keyof typeof activity.message]}
                  </p>
                  <p className={`text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1 ${dir.textAlign}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className={`pt-4 border-t border-gray-200 dark:border-gray-700 ${dir.textAlign}`}>
              <a 
                href="/dashboard/activities" 
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
              >
                {currentLanguage === 'ar' ? 'عرض جميع الأنشطة' :
                 currentLanguage === 'fa' ? 'مشاهده همه فعالیت ها' :
                 'View all activities'} →
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}