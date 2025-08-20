"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  Users,
  UserCheck,
  Activity,
  MapPin,
  Filter,
  Layers,
  RefreshCw,
  Eye,
  EyeOff,
  Navigation,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Search,
  Info
} from "lucide-react";

interface LostPerson {
  id: string;
  displayName: string;
  status: 'active' | 'found' | 'resolved';
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
    lastUpdate: Date;
  };
  ageRange?: string;
  description?: string;
  contact?: string;
  sessionId?: string;
  searcherName?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeElapsed: number; // in minutes
  campaignId?: string;
}

interface SearchCenter {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive';
  currentOccupancy: number;
  capacity: number;
}

interface ActiveSession {
  id: string;
  lostPersonId: string;
  searcherLocation: {
    lat: number;
    lng: number;
    lastUpdate: Date;
  };
  status: 'active' | 'ended';
  duration: number; // in minutes
}

// Mapbox configuration
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const SAMARRA_CENTER: [number, number] = [43.88504, 34.19625]; // [lng, lat]

export function InteractiveMapDashboard() {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // State
  const [lostPersons, setLostPersons] = useState<LostPerson[]>([]);
  const [searchCenters, setSearchCenters] = useState<SearchCenter[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<LostPerson | null>(null);
  const [filters, setFilters] = useState({
    showActive: true,
    showFound: true,
    showResolved: false,
    showSessions: true,
    showCenters: true,
    priority: 'all' as 'all' | 'low' | 'medium' | 'high' | 'critical'
  });
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: SAMARRA_CENTER,
        zoom: 12,
        maxBounds: [
          [43.86334, 34.17822], // Southwest
          [43.90674, 34.21428], // Northeast
        ],
      });

      map.current.on('load', () => {
        // Add data sources and layers will be added here
        console.log('Map loaded');
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mock data
  useEffect(() => {
    const mockLostPersons: LostPerson[] = [
      {
        id: '1',
        displayName: 'Ahmed Ali',
        status: 'active',
        location: {
          lat: 34.19625,
          lng: 43.88504,
          accuracy: 15,
          lastUpdate: new Date(Date.now() - 5 * 60000) // 5 minutes ago
        },
        ageRange: 'adult',
        description: 'Wearing blue shirt and jeans',
        contact: '+964 771 234 5678',
        sessionId: 'session-1',
        searcherName: 'Omar Hassan',
        priority: 'high',
        timeElapsed: 45,
        campaignId: 'campaign-1'
      },
      {
        id: '2',
        displayName: 'Fatima Mohammed',
        status: 'found',
        location: {
          lat: 34.20155,
          lng: 43.88204,
          accuracy: 8,
          lastUpdate: new Date(Date.now() - 2 * 60000) // 2 minutes ago
        },
        ageRange: 'child',
        description: 'Red dress, brown hair',
        contact: '+964 771 234 5679',
        priority: 'critical',
        timeElapsed: 25,
        campaignId: 'campaign-1'
      },
      {
        id: '3',
        displayName: 'Hassan Ali',
        status: 'active',
        location: {
          lat: 34.19095,
          lng: 43.88804,
          accuracy: 12,
          lastUpdate: new Date(Date.now() - 10 * 60000) // 10 minutes ago
        },
        ageRange: 'elderly',
        description: 'White thobe, walking stick',
        priority: 'medium',
        timeElapsed: 120,
        campaignId: 'campaign-2'
      }
    ];

    const mockCenters: SearchCenter[] = [
      {
        id: '1',
        name: 'Main Search Center',
        location: { lat: 34.19625, lng: 43.88504 },
        status: 'active',
        currentOccupancy: 45,
        capacity: 100
      },
      {
        id: '2',
        name: 'North Station',
        location: { lat: 34.20155, lng: 43.88204 },
        status: 'active',
        currentOccupancy: 23,
        capacity: 75
      },
      {
        id: '3',
        name: 'South Gateway',
        location: { lat: 34.19095, lng: 43.88804 },
        status: 'inactive',
        currentOccupancy: 0,
        capacity: 60
      }
    ];

    const mockSessions: ActiveSession[] = [
      {
        id: 'session-1',
        lostPersonId: '1',
        searcherLocation: {
          lat: 34.19655,
          lng: 43.88534,
          lastUpdate: new Date(Date.now() - 1 * 60000) // 1 minute ago
        },
        status: 'active',
        duration: 45
      }
    ];

    setLostPersons(mockLostPersons);
    setSearchCenters(mockCenters);
    setActiveSessions(mockSessions);
  }, []);

  // Auto refresh data
  useEffect(() => {
    if (isAutoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        // In real implementation, this would fetch fresh data from API
        console.log('Refreshing map data...');
        // Update timestamps to simulate real-time updates
        setLostPersons(prev => prev.map(person => ({
          ...person,
          timeElapsed: person.timeElapsed + (refreshInterval / 60)
        })));
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, refreshInterval]);

  // Filter lost persons based on current filters
  const filteredPersons = lostPersons.filter(person => {
    const statusMatch = 
      (filters.showActive && person.status === 'active') ||
      (filters.showFound && person.status === 'found') ||
      (filters.showResolved && person.status === 'resolved');
    
    const priorityMatch = filters.priority === 'all' || person.priority === filters.priority;
    
    return statusMatch && priorityMatch;
  });

  const getStatusColor = (status: LostPerson['status']) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'found': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'resolved': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: LostPerson['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeElapsed = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return currentLanguage === 'ar' ? `${hours}ساعة ${mins}دقيقة` :
             currentLanguage === 'fa' ? `${hours} ساعت ${mins} دقیقه` :
             `${hours}h ${mins}m`;
    } else {
      return currentLanguage === 'ar' ? `${mins} دقيقة` :
             currentLanguage === 'fa' ? `${mins} دقیقه` :
             `${mins}m`;
    }
  };

  const formatLastUpdate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    return currentLanguage === 'ar' ? `منذ ${minutes} دقيقة` :
           currentLanguage === 'fa' ? `${minutes} دقیقه پیش` :
           `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'خريطة المراقبة المباشرة' :
             currentLanguage === 'fa' ? 'نقشه نظارت زنده' :
             'Live Monitoring Map'}
          </h1>
          <p className={`mt-2 text-gray-600 dark:text-gray-400 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'تتبع مواقع المفقودين والباحثين في الوقت الفعلي' :
             currentLanguage === 'fa' ? 'ردیابی مکان افراد گمشده و جستجوگران در زمان واقعی' :
             'Real-time tracking of lost persons and searchers locations'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            {currentLanguage === 'ar' ? 'تحديث تلقائي' :
             currentLanguage === 'fa' ? 'بروزرسانی خودکار' :
             'Auto Refresh'}
          </Button>
          
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="p-4">
            {/* Map Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentLanguage === 'ar' ? 'الخريطة التفاعلية' :
                   currentLanguage === 'fa' ? 'نقشه تعاملی' :
                   'Interactive Map'}
                </h3>
                <Badge variant="secondary" className="flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  {filteredPersons.length} 
                  {currentLanguage === 'ar' ? ' نشط' :
                   currentLanguage === 'fa' ? ' فعال' :
                   ' Active'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({...filters, showActive: !filters.showActive})}
                  className={filters.showActive ? 'bg-red-50 text-red-700' : ''}
                >
                  {filters.showActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span className="ml-1 text-xs">
                    {currentLanguage === 'ar' ? 'نشط' :
                     currentLanguage === 'fa' ? 'فعال' :
                     'Active'}
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({...filters, showFound: !filters.showFound})}
                  className={filters.showFound ? 'bg-green-50 text-green-700' : ''}
                >
                  {filters.showFound ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span className="ml-1 text-xs">
                    {currentLanguage === 'ar' ? 'تم العثور' :
                     currentLanguage === 'fa' ? 'پیدا شده' :
                     'Found'}
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({...filters, showCenters: !filters.showCenters})}
                  className={filters.showCenters ? 'bg-blue-50 text-blue-700' : ''}
                >
                  {filters.showCenters ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span className="ml-1 text-xs">
                    {currentLanguage === 'ar' ? 'مراكز' :
                     currentLanguage === 'fa' ? 'مراکز' :
                     'Centers'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="relative">
              <div 
                ref={mapContainer}
                className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {currentLanguage === 'ar' ? 'الخريطة التفاعلية ستظهر هنا' :
                         currentLanguage === 'fa' ? 'نقشه تعاملی در اینجا نمایش داده می شود' :
                         'Interactive map will be displayed here'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {currentLanguage === 'ar' ? 'يتطلب رمز Mapbox API للعمل' :
                         currentLanguage === 'fa' ? 'برای کارکرد به کلید API Mapbox نیاز دارد' :
                         'Requires Mapbox API token to function'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>{currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'fa' ? 'فعال' : 'Active'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>{currentLanguage === 'ar' ? 'تم العثور' : currentLanguage === 'fa' ? 'پیدا شده' : 'Found'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>{currentLanguage === 'ar' ? 'مراكز' : currentLanguage === 'fa' ? 'مراکز' : 'Centers'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>{currentLanguage === 'ar' ? 'باحثين' : currentLanguage === 'fa' ? 'جستجوگران' : 'Searchers'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Live Statistics */}
          <Card className="p-4">
            <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'الإحصائيات المباشرة' :
               currentLanguage === 'fa' ? 'آمار زنده' :
               'Live Statistics'}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'fa' ? 'فعال' : 'Active'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {lostPersons.filter(p => p.status === 'active').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ar' ? 'تم العثور' : currentLanguage === 'fa' ? 'پیدا شده' : 'Found'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {lostPersons.filter(p => p.status === 'found').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ar' ? 'جلسات نشطة' : currentLanguage === 'fa' ? 'جلسات فعال' : 'Active Sessions'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeSessions.filter(s => s.status === 'active').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ar' ? 'مراكز نشطة' : currentLanguage === 'fa' ? 'مراکز فعال' : 'Active Centers'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {searchCenters.filter(c => c.status === 'active').length}
                </span>
              </div>
            </div>
          </Card>

          {/* Priority Filter */}
          <Card className="p-4">
            <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'تصفية حسب الأولوية' :
               currentLanguage === 'fa' ? 'فیلتر بر اساس اولویت' :
               'Filter by Priority'}
            </h3>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">
                {currentLanguage === 'ar' ? 'جميع الأولويات' :
                 currentLanguage === 'fa' ? 'همه اولویت ها' :
                 'All Priorities'}
              </option>
              <option value="critical">
                {currentLanguage === 'ar' ? 'حرج' :
                 currentLanguage === 'fa' ? 'حیاتی' :
                 'Critical'}
              </option>
              <option value="high">
                {currentLanguage === 'ar' ? 'عالي' :
                 currentLanguage === 'fa' ? 'بالا' :
                 'High'}
              </option>
              <option value="medium">
                {currentLanguage === 'ar' ? 'متوسط' :
                 currentLanguage === 'fa' ? 'متوسط' :
                 'Medium'}
              </option>
              <option value="low">
                {currentLanguage === 'ar' ? 'منخفض' :
                 currentLanguage === 'fa' ? 'پایین' :
                 'Low'}
              </option>
            </select>
          </Card>

          {/* Active Persons List */}
          <Card className="p-4">
            <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-4 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'المفقودون النشطون' :
               currentLanguage === 'fa' ? 'افراد گمشده فعال' :
               'Active Lost Persons'}
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredPersons.slice(0, 10).map((person) => (
                <div 
                  key={person.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPerson?.id === person.id 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedPerson(person)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(person.priority)}`}></div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {person.displayName}
                        </h4>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <Badge className={`${getStatusColor(person.status)} text-xs mr-2`}>
                          {person.status === 'active' ? 
                            (currentLanguage === 'ar' ? 'نشط' : currentLanguage === 'fa' ? 'فعال' : 'Active') :
                           person.status === 'found' ?
                            (currentLanguage === 'ar' ? 'تم العثور' : currentLanguage === 'fa' ? 'پیدا شده' : 'Found') :
                            (currentLanguage === 'ar' ? 'محلول' : currentLanguage === 'fa' ? 'حل شده' : 'Resolved')
                          }
                        </Badge>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeElapsed(person.timeElapsed)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{formatLastUpdate(person.location.lastUpdate)}</span>
                      </div>
                      
                      {person.sessionId && person.searcherName && (
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                          <Search className="h-3 w-3 mr-1" />
                          <span>{person.searcherName}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="p-1">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredPersons.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">
                    {currentLanguage === 'ar' ? 'لا توجد نتائج مطابقة للمرشحات' :
                     currentLanguage === 'fa' ? 'نتیجه ای برای فیلترها یافت نشد' :
                     'No results match the current filters'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}