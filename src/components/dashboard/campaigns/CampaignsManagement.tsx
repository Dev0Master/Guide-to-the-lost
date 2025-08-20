"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import {
  Target,
  Plus,
  Search,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  Users,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'hajj' | 'umrah' | 'event' | 'emergency';
  status: 'planned' | 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate: Date;
  location: {
    centerLat: number;
    centerLng: number;
    radiusM: number;
    description: string;
  };
  stats: {
    totalLost: number;
    totalFound: number;
    activeSessions: number;
    totalSearchers: number;
    successRate: number;
  };
  resources: {
    assignedCenters: string[];
    totalCapacity: number;
    currentUtilization: number;
  };
  createdBy: string;
  createdAt: Date;
  lastUpdated: Date;
}

interface CampaignFormData {
  name: string;
  description: string;
  type: 'hajj' | 'umrah' | 'event' | 'emergency';
  startDate: string;
  endDate: string;
  location: string;
  radiusM: number;
}

export function CampaignsManagement() {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);

  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'planned' | 'active' | 'completed' | 'paused'>('all');
  const [filterType, setFilterType] = useState<'all' | 'hajj' | 'umrah' | 'event' | 'emergency'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    type: 'event',
    startDate: '',
    endDate: '',
    location: '',
    radiusM: 5000
  });

  // Mock data
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Hajj 2024 - Main Operation',
        description: 'Comprehensive lost person management for Hajj season 2024',
        type: 'hajj',
        status: 'active',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-07-25'),
        location: {
          centerLat: 34.19625,
          centerLng: 43.88504,
          radiusM: 15000,
          description: 'Samarra and surrounding holy sites'
        },
        stats: {
          totalLost: 156,
          totalFound: 142,
          activeSessions: 14,
          totalSearchers: 89,
          successRate: 91.0
        },
        resources: {
          assignedCenters: ['1', '2', '3'],
          totalCapacity: 235,
          currentUtilization: 67
        },
        createdBy: 'Ahmed Al-Samarrai',
        createdAt: new Date('2024-05-01'),
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Emergency Response - Winter Storm',
        description: 'Emergency lost person response during severe weather conditions',
        type: 'emergency',
        status: 'completed',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-20'),
        location: {
          centerLat: 34.19625,
          centerLng: 43.88504,
          radiusM: 25000,
          description: 'Greater Samarra metropolitan area'
        },
        stats: {
          totalLost: 43,
          totalFound: 39,
          activeSessions: 0,
          totalSearchers: 25,
          successRate: 90.7
        },
        resources: {
          assignedCenters: ['1', '2'],
          totalCapacity: 175,
          currentUtilization: 0
        },
        createdBy: 'Fatima Al-Kazimi',
        createdAt: new Date('2024-01-14'),
        lastUpdated: new Date('2024-01-20')
      },
      {
        id: '3',
        name: 'Eid Festival 2024',
        description: 'Lost person management during Eid celebrations and gatherings',
        type: 'event',
        status: 'planned',
        startDate: new Date('2024-04-10'),
        endDate: new Date('2024-04-12'),
        location: {
          centerLat: 34.19625,
          centerLng: 43.88504,
          radiusM: 8000,
          description: 'Central Samarra festival grounds'
        },
        stats: {
          totalLost: 0,
          totalFound: 0,
          activeSessions: 0,
          totalSearchers: 0,
          successRate: 0
        },
        resources: {
          assignedCenters: ['1', '3'],
          totalCapacity: 160,
          currentUtilization: 0
        },
        createdBy: 'Omar Hassan',
        createdAt: new Date('2024-03-01'),
        lastUpdated: new Date('2024-03-15')
      }
    ];
    
    setCampaigns(mockCampaigns);
  }, []);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesType = filterType === 'all' || campaign.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'planned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Campaign['type']) => {
    switch (type) {
      case 'hajj': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'umrah': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'event': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'planned': return <Calendar className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(
      currentLanguage === 'ar' ? 'ar-EG' : 
      currentLanguage === 'fa' ? 'fa-IR' : 'en-US'
    );
  };

  const formatDateRange = (start: Date, end: Date): string => {
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    return currentLanguage === 'ar' ? `${startStr} - ${endStr}` :
           currentLanguage === 'fa' ? `${startStr} تا ${endStr}` :
           `${startStr} - ${endStr}`;
  };

  const handleAddCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      status: 'planned',
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      location: {
        centerLat: 34.19625,
        centerLng: 43.88504,
        radiusM: formData.radiusM,
        description: formData.location
      },
      stats: {
        totalLost: 0,
        totalFound: 0,
        activeSessions: 0,
        totalSearchers: 0,
        successRate: 0
      },
      resources: {
        assignedCenters: [],
        totalCapacity: 0,
        currentUtilization: 0
      },
      createdBy: 'Current User',
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setCampaigns([...campaigns, newCampaign]);
    setShowAddModal(false);
    setFormData({
      name: '',
      description: '',
      type: 'event',
      startDate: '',
      endDate: '',
      location: '',
      radiusM: 5000
    });
  };

  const handleStatusChange = (campaignId: string, newStatus: Campaign['status']) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: newStatus, lastUpdated: new Date() }
        : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'إدارة الحملات' :
             currentLanguage === 'fa' ? 'مدیریت کمپین ها' :
             'Campaigns Management'}
          </h1>
          <p className={`mt-2 text-gray-600 dark:text-gray-400 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'تنظيم وإدارة حملات البحث والعمليات الخاصة' :
             currentLanguage === 'fa' ? 'سازماندهی و مدیریت کمپین های جستجو و عملیات ویژه' :
             'Organize and manage search campaigns and special operations'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          {currentLanguage === 'ar' ? 'إنشاء حملة' :
           currentLanguage === 'fa' ? 'ایجاد کمپین' :
           'Create Campaign'}
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={
                  currentLanguage === 'ar' ? 'البحث في الحملات...' :
                  currentLanguage === 'fa' ? 'جستجو در کمپین ها...' :
                  'Search campaigns...'
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
              <option value="planned">
                {currentLanguage === 'ar' ? 'مخطط' :
                 currentLanguage === 'fa' ? 'برنامه ریزی شده' :
                 'Planned'}
              </option>
              <option value="active">
                {currentLanguage === 'ar' ? 'نشط' :
                 currentLanguage === 'fa' ? 'فعال' :
                 'Active'}
              </option>
              <option value="completed">
                {currentLanguage === 'ar' ? 'مكتمل' :
                 currentLanguage === 'fa' ? 'تکمیل شده' :
                 'Completed'}
              </option>
              <option value="paused">
                {currentLanguage === 'ar' ? 'متوقف مؤقتاً' :
                 currentLanguage === 'fa' ? 'موقتا متوقف' :
                 'Paused'}
              </option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">
                {currentLanguage === 'ar' ? 'جميع الأنواع' :
                 currentLanguage === 'fa' ? 'همه انواع' :
                 'All Types'}
              </option>
              <option value="hajj">
                {currentLanguage === 'ar' ? 'الحج' :
                 currentLanguage === 'fa' ? 'حج' :
                 'Hajj'}
              </option>
              <option value="umrah">
                {currentLanguage === 'ar' ? 'العمرة' :
                 currentLanguage === 'fa' ? 'عمره' :
                 'Umrah'}
              </option>
              <option value="event">
                {currentLanguage === 'ar' ? 'فعالية' :
                 currentLanguage === 'fa' ? 'رویداد' :
                 'Event'}
              </option>
              <option value="emergency">
                {currentLanguage === 'ar' ? 'طوارئ' :
                 currentLanguage === 'fa' ? 'اضطراری' :
                 'Emergency'}
              </option>
            </select>
          </div>
        </div>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mr-3">
                    {campaign.name}
                  </h3>
                  <Badge className={getStatusColor(campaign.status)}>
                    {getStatusIcon(campaign.status)}
                    <span className="ml-1">
                      {campaign.status === 'active' ? 
                        (currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'fa' ? 'فعال' : 'Active') :
                       campaign.status === 'planned' ?
                        (currentLanguage === 'ar' ? 'مخطط' : currentLanguage === 'fa' ? 'برنامه ریزی شده' : 'Planned') :
                       campaign.status === 'completed' ?
                        (currentLanguage === 'ar' ? 'مكتمل' : currentLanguage === 'fa' ? 'تکمیل شده' : 'Completed') :
                        (currentLanguage === 'ar' ? 'متوقف' : currentLanguage === 'fa' ? 'متوقف' : 'Paused')
                      }
                    </span>
                  </Badge>
                  <Badge className={`${getTypeColor(campaign.type)} ml-2`}>
                    {campaign.type === 'hajj' ? 
                      (currentLanguage === 'ar' ? 'الحج' : currentLanguage === 'fa' ? 'حج' : 'Hajj') :
                     campaign.type === 'umrah' ?
                      (currentLanguage === 'ar' ? 'العمرة' : currentLanguage === 'fa' ? 'عمره' : 'Umrah') :
                     campaign.type === 'event' ?
                      (currentLanguage === 'ar' ? 'فعالية' : currentLanguage === 'fa' ? 'رویداد' : 'Event') :
                      (currentLanguage === 'ar' ? 'طوارئ' : currentLanguage === 'fa' ? 'اضطراری' : 'Emergency')
                    }
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{campaign.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Duration */}
                  <div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {currentLanguage === 'ar' ? 'المدة' :
                         currentLanguage === 'fa' ? 'مدت زمان' :
                         'Duration'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDateRange(campaign.startDate, campaign.endDate)}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {currentLanguage === 'ar' ? 'الموقع' :
                         currentLanguage === 'fa' ? 'موقعیت' :
                         'Location'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">{campaign.location.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentLanguage === 'ar' ? `نطاق ${campaign.location.radiusM / 1000} كم` :
                       currentLanguage === 'fa' ? `شعاع ${campaign.location.radiusM / 1000} کیلومتر` :
                       `${campaign.location.radiusM / 1000}km radius`}
                    </p>
                  </div>

                  {/* Performance */}
                  <div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {currentLanguage === 'ar' ? 'الأداء' :
                         currentLanguage === 'fa' ? 'عملکرد' :
                         'Performance'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {currentLanguage === 'ar' ? `${campaign.stats.totalFound}/${campaign.stats.totalLost} تم العثور عليهم` :
                       currentLanguage === 'fa' ? `${campaign.stats.totalFound}/${campaign.stats.totalLost} پیدا شده` :
                       `${campaign.stats.totalFound}/${campaign.stats.totalLost} Found`}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {campaign.stats.successRate.toFixed(1)}% 
                      {currentLanguage === 'ar' ? ' نجاح' :
                       currentLanguage === 'fa' ? ' موفقیت' :
                       ' Success'}
                    </p>
                  </div>

                  {/* Resources */}
                  <div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {currentLanguage === 'ar' ? 'الموارد' :
                         currentLanguage === 'fa' ? 'منابع' :
                         'Resources'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {currentLanguage === 'ar' ? `${campaign.resources.assignedCenters.length} مراكز` :
                       currentLanguage === 'fa' ? `${campaign.resources.assignedCenters.length} مرکز` :
                       `${campaign.resources.assignedCenters.length} Centers`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentLanguage === 'ar' ? `${campaign.stats.activeSessions} جلسة نشطة` :
                       currentLanguage === 'fa' ? `${campaign.stats.activeSessions} جلسه فعال` :
                       `${campaign.stats.activeSessions} Active Sessions`}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLanguage === 'ar' ? `أنشأها: ${campaign.createdBy} • آخر تحديث: ${formatDate(campaign.lastUpdated)}` :
                   currentLanguage === 'fa' ? `ایجاد شده توسط: ${campaign.createdBy} • آخرین بروزرسانی: ${formatDate(campaign.lastUpdated)}` :
                   `Created by: ${campaign.createdBy} • Last updated: ${formatDate(campaign.lastUpdated)}`}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                {campaign.status === 'planned' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(campaign.id, 'active')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {currentLanguage === 'ar' ? 'تشغيل' :
                     currentLanguage === 'fa' ? 'شروع' :
                     'Start'}
                  </Button>
                )}
                
                {campaign.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(campaign.id, 'paused')}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      {currentLanguage === 'ar' ? 'إيقاف مؤقت' :
                       currentLanguage === 'fa' ? 'مکث' :
                       'Pause'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(campaign.id, 'completed')}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      {currentLanguage === 'ar' ? 'إنهاء' :
                       currentLanguage === 'fa' ? 'پایان' :
                       'End'}
                    </Button>
                  </>
                )}
                
                {campaign.status === 'paused' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(campaign.id, 'active')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {currentLanguage === 'ar' ? 'استكمال' :
                     currentLanguage === 'fa' ? 'ادامه' :
                     'Resume'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowDetailsModal(true);
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {currentLanguage === 'ar' ? 'تفاصيل' :
                   currentLanguage === 'fa' ? 'جزئیات' :
                   'Details'}
                </Button>
                
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {currentLanguage === 'ar' ? 'تعديل' :
                   currentLanguage === 'fa' ? 'ویرایش' :
                   'Edit'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Campaign Modal (simplified representation) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className={`text-xl font-semibold mb-4 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'إنشاء حملة جديدة' :
               currentLanguage === 'fa' ? 'ایجاد کمپین جدید' :
               'Create New Campaign'}
            </h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder={currentLanguage === 'ar' ? 'اسم الحملة' : 'Campaign Name'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              
              <textarea
                placeholder={currentLanguage === 'ar' ? 'وصف الحملة' : 'Campaign Description'}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="event">{currentLanguage === 'ar' ? 'فعالية' : 'Event'}</option>
                  <option value="hajj">{currentLanguage === 'ar' ? 'الحج' : 'Hajj'}</option>
                  <option value="umrah">{currentLanguage === 'ar' ? 'العمرة' : 'Umrah'}</option>
                  <option value="emergency">{currentLanguage === 'ar' ? 'طوارئ' : 'Emergency'}</option>
                </select>
                
                <Input
                  type="number"
                  placeholder={currentLanguage === 'ar' ? 'نطاق التغطية (متر)' : 'Coverage Radius (m)'}
                  value={formData.radiusM}
                  onChange={(e) => setFormData({...formData, radiusM: parseInt(e.target.value) || 5000})}
                />
                
                <Input
                  type="date"
                  placeholder={currentLanguage === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
                
                <Input
                  type="date"
                  placeholder={currentLanguage === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              
              <Input
                placeholder={currentLanguage === 'ar' ? 'وصف الموقع' : 'Location Description'}
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                {currentLanguage === 'ar' ? 'إلغاء' :
                 currentLanguage === 'fa' ? 'لغو' :
                 'Cancel'}
              </Button>
              <Button onClick={handleAddCampaign}>
                {currentLanguage === 'ar' ? 'إنشاء الحملة' :
                 currentLanguage === 'fa' ? 'ایجاد کمپین' :
                 'Create Campaign'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}