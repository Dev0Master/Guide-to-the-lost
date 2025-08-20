"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Download,
  Upload,
  Map,
  Phone,
  Mail,
  Clock,
  Users,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Center {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  status: 'active' | 'inactive';
  manager: string;
  capacity: number;
  currentOccupancy: number;
  createdAt: Date;
  lastActivity: Date;
  stats: {
    totalSessions: number;
    successfulFinds: number;
    averageResponseTime: string;
  };
}

interface CenterFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  capacity: number;
}

export function CentersManagement() {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);

  // State
  const [centers, setCenters] = useState<Center[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [formData, setFormData] = useState<CenterFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    capacity: 50
  });

  // Mock data
  useEffect(() => {
    const mockCenters: Center[] = [
      {
        id: '1',
        name: 'Samarra Main Center',
        location: {
          lat: 34.19625,
          lng: 43.88504,
          address: 'Al-Askari Shrine Area, Samarra, Iraq'
        },
        contact: {
          phone: '+964 771 234 5678',
          email: 'main@samarra-center.org'
        },
        status: 'active',
        manager: 'Ahmed Al-Samarrai',
        capacity: 100,
        currentOccupancy: 45,
        createdAt: new Date('2024-01-15'),
        lastActivity: new Date(),
        stats: {
          totalSessions: 234,
          successfulFinds: 198,
          averageResponseTime: '12 min'
        }
      },
      {
        id: '2', 
        name: 'North Samarra Station',
        location: {
          lat: 34.20155,
          lng: 43.88204,
          address: 'Northern District, Samarra, Iraq'
        },
        contact: {
          phone: '+964 771 234 5679',
          email: 'north@samarra-center.org'
        },
        status: 'active',
        manager: 'Fatima Al-Kazimi',
        capacity: 75,
        currentOccupancy: 23,
        createdAt: new Date('2024-02-01'),
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        stats: {
          totalSessions: 156,
          successfulFinds: 142,
          averageResponseTime: '15 min'
        }
      },
      {
        id: '3',
        name: 'South Gateway Center', 
        location: {
          lat: 34.19095,
          lng: 43.88804,
          address: 'Southern Entrance, Samarra, Iraq'
        },
        contact: {
          phone: '+964 771 234 5680',
          email: 'south@samarra-center.org'
        },
        status: 'inactive',
        manager: 'Omar Hassan',
        capacity: 60,
        currentOccupancy: 0,
        createdAt: new Date('2024-01-20'),
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        stats: {
          totalSessions: 89,
          successfulFinds: 76,
          averageResponseTime: '18 min'
        }
      }
    ];
    
    setCenters(mockCenters);
  }, []);

  // Filter centers
  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || center.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddCenter = () => {
    // Mock add center logic
    const newCenter: Center = {
      id: Date.now().toString(),
      name: formData.name,
      location: {
        lat: 34.19625 + (Math.random() - 0.5) * 0.01, // Random nearby location
        lng: 43.88504 + (Math.random() - 0.5) * 0.01,
        address: formData.address
      },
      contact: {
        phone: formData.phone,
        email: formData.email
      },
      status: 'active',
      manager: formData.manager,
      capacity: formData.capacity,
      currentOccupancy: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
      stats: {
        totalSessions: 0,
        successfulFinds: 0,
        averageResponseTime: '0 min'
      }
    };

    setCenters([...centers, newCenter]);
    setShowAddModal(false);
    setFormData({ name: '', address: '', phone: '', email: '', manager: '', capacity: 50 });
  };

  const handleDeleteCenter = (centerId: string) => {
    setCenters(centers.filter(c => c.id !== centerId));
  };

  const handleToggleStatus = (centerId: string) => {
    setCenters(centers.map(c => 
      c.id === centerId 
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
        : c
    ));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-EG' : 
      currentLanguage === 'fa' ? 'fa-IR' : 'en-US'
    );
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return currentLanguage === 'ar' ? `منذ ${days} يوم` :
             currentLanguage === 'fa' ? `${days} روز پیش` :
             `${days} days ago`;
    } else if (hours > 0) {
      return currentLanguage === 'ar' ? `منذ ${hours} ساعة` :
             currentLanguage === 'fa' ? `${hours} ساعت پیش` :
             `${hours} hours ago`;
    } else {
      return currentLanguage === 'ar' ? `منذ ${minutes} دقيقة` :
             currentLanguage === 'fa' ? `${minutes} دقیقه پیش` :
             `${minutes} minutes ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'إدارة المراكز' :
             currentLanguage === 'fa' ? 'مدیریت مراکز' :
             'Centers Management'}
          </h1>
          <p className={`mt-2 text-gray-600 dark:text-gray-400 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'إدارة مراكز البحث ومراقبة الأداء' :
             currentLanguage === 'fa' ? 'مدیریت مراکز جستجو و نظارت بر عملکرد' :
             'Manage search centers and monitor performance'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowMapView(!showMapView)}
            className="flex items-center"
          >
            <Map className="h-4 w-4 mr-2" />
            {showMapView ? 
              (currentLanguage === 'ar' ? 'عرض الجدول' :
               currentLanguage === 'fa' ? 'نمایش جدول' : 'Table View') :
              (currentLanguage === 'ar' ? 'عرض الخريطة' :
               currentLanguage === 'fa' ? 'نمایش نقشه' : 'Map View')
            }
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            {currentLanguage === 'ar' ? 'إضافة مركز' :
             currentLanguage === 'fa' ? 'افزودن مرکز' :
             'Add Center'}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={
                  currentLanguage === 'ar' ? 'البحث في المراكز...' :
                  currentLanguage === 'fa' ? 'جستجو در مراکز...' :
                  'Search centers...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">
                {currentLanguage === 'ar' ? 'جميع الحالات' :
                 currentLanguage === 'fa' ? 'همه وضعیت ها' :
                 'All Status'}
              </option>
              <option value="active">
                {currentLanguage === 'ar' ? 'نشط' :
                 currentLanguage === 'fa' ? 'فعال' :
                 'Active'}
              </option>
              <option value="inactive">
                {currentLanguage === 'ar' ? 'غير نشط' :
                 currentLanguage === 'fa' ? 'غیر فعال' :
                 'Inactive'}
              </option>
            </select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {currentLanguage === 'ar' ? 'تصدير' :
               currentLanguage === 'fa' ? 'خروجی' :
               'Export'}
            </Button>
          </div>
        </div>
      </Card>

      {showMapView ? (
        // Map View
        <Card className="p-6">
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {currentLanguage === 'ar' ? 'سيتم تحميل الخريطة التفاعلية هنا' :
                 currentLanguage === 'fa' ? 'نقشه تعاملی در اینجا بارگذاری خواهد شد' :
                 'Interactive map will be loaded here'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {currentLanguage === 'ar' ? 'عرض جميع المراكز على خريطة تفاعلية مع معلومات مفصلة' :
                 currentLanguage === 'fa' ? 'نمایش همه مراکز روی نقشه تعاملی با اطلاعات تفصیلی' :
                 'Display all centers on an interactive map with detailed information'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        // Table View
        <div className="grid gap-6">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 rounded-full mr-3 ${center.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {center.name}
                    </h3>
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                      center.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {center.status === 'active' ? 
                        (currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'fa' ? 'فعال' : 'Active') :
                        (currentLanguage === 'ar' ? 'غير نشط' : currentLanguage === 'fa' ? 'غیر فعال' : 'Inactive')
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Location Info */}
                    <div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          {currentLanguage === 'ar' ? 'الموقع' :
                           currentLanguage === 'fa' ? 'موقعیت' :
                           'Location'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{center.location.address}</p>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          {currentLanguage === 'ar' ? 'الاتصال' :
                           currentLanguage === 'fa' ? 'تماس' :
                           'Contact'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{center.contact.phone}</p>
                      <p className="text-sm text-gray-900 dark:text-white">{center.contact.email}</p>
                    </div>

                    {/* Manager & Capacity */}
                    <div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          {currentLanguage === 'ar' ? 'المدير' :
                           currentLanguage === 'fa' ? 'مدیر' :
                           'Manager'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{center.manager}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentLanguage === 'ar' ? `${center.currentOccupancy}/${center.capacity} السعة` :
                         currentLanguage === 'fa' ? `${center.currentOccupancy}/${center.capacity} ظرفیت` :
                         `${center.currentOccupancy}/${center.capacity} Capacity`}
                      </p>
                    </div>

                    {/* Stats */}
                    <div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          {currentLanguage === 'ar' ? 'الإحصائيات' :
                           currentLanguage === 'fa' ? 'آمار' :
                           'Statistics'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {currentLanguage === 'ar' ? `${center.stats.totalSessions} جلسة` :
                         currentLanguage === 'fa' ? `${center.stats.totalSessions} جلسه` :
                         `${center.stats.totalSessions} Sessions`}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {currentLanguage === 'ar' ? `${center.stats.successfulFinds} تم العثور عليهم` :
                         currentLanguage === 'fa' ? `${center.stats.successfulFinds} پیدا شده` :
                         `${center.stats.successfulFinds} Found`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentLanguage === 'ar' ? `متوسط الاستجابة: ${center.stats.averageResponseTime}` :
                         currentLanguage === 'fa' ? `میانگین پاسخ: ${center.stats.averageResponseTime}` :
                         `Avg Response: ${center.stats.averageResponseTime}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {currentLanguage === 'ar' ? `أنشئ في: ${formatDate(center.createdAt)}` :
                       currentLanguage === 'fa' ? `ایجاد شده در: ${formatDate(center.createdAt)}` :
                       `Created: ${formatDate(center.createdAt)}`}
                    </span>
                    <span>
                      {currentLanguage === 'ar' ? `آخر نشاط: ${formatTimeAgo(center.lastActivity)}` :
                       currentLanguage === 'fa' ? `آخرین فعالیت: ${formatTimeAgo(center.lastActivity)}` :
                       `Last Activity: ${formatTimeAgo(center.lastActivity)}`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(center.id)}
                  >
                    {center.status === 'active' ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        {currentLanguage === 'ar' ? 'إلغاء التنشيط' :
                         currentLanguage === 'fa' ? 'غیر فعال کردن' :
                         'Deactivate'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {currentLanguage === 'ar' ? 'تنشيط' :
                         currentLanguage === 'fa' ? 'فعال کردن' :
                         'Activate'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCenter(center);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {currentLanguage === 'ar' ? 'تعديل' :
                     currentLanguage === 'fa' ? 'ویرایش' :
                     'Edit'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm(
                        currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المركز؟' :
                        currentLanguage === 'fa' ? 'آیا از حذف این مرکز اطمینان دارید؟' :
                        'Are you sure you want to delete this center?'
                      )) {
                        handleDeleteCenter(center.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {currentLanguage === 'ar' ? 'حذف' :
                     currentLanguage === 'fa' ? 'حذف' :
                     'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Center Modal (simplified representation) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-6">
            <h2 className={`text-xl font-semibold mb-4 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'إضافة مركز جديد' :
               currentLanguage === 'fa' ? 'افزودن مرکز جدید' :
               'Add New Center'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder={currentLanguage === 'ar' ? 'اسم المركز' : 'Center Name'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input
                placeholder={currentLanguage === 'ar' ? 'العنوان' : 'Address'}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <Input
                placeholder={currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <Input
                placeholder={currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Input
                placeholder={currentLanguage === 'ar' ? 'اسم المدير' : 'Manager Name'}
                value={formData.manager}
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
              />
              <Input
                type="number"
                placeholder={currentLanguage === 'ar' ? 'السعة' : 'Capacity'}
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 50})}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                {currentLanguage === 'ar' ? 'إلغاء' :
                 currentLanguage === 'fa' ? 'لغو' :
                 'Cancel'}
              </Button>
              <Button onClick={handleAddCenter}>
                {currentLanguage === 'ar' ? 'إضافة المركز' :
                 currentLanguage === 'fa' ? 'افزودن مرکز' :
                 'Add Center'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}