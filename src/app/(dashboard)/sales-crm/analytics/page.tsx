"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Users,
  Phone,
  Calendar as CalendarComponent,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Clock,
  Award,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { cn } from "@/lib/utils";
import useAnalyticsStore from "@/stores/salesCrmStore/useAnalyticsStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Pie,
} from "recharts";

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
  "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
];

const AnalyticsPage = () => {
  const {
    analytics,
    isLoading,
    error,
    currentFilter,
    dateRange,
    fetchAnalytics,
    setFilter,
    setDateRange,
  } = useAnalyticsStore();

  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFilterChange = (
    filter: "daily" | "weekly" | "monthly" | "custom"
  ) => {
    setFilter(filter);
  };

  // Prepare timeline data for charts
  const timelineData = analytics?.timeline.leads.map((item, index) => {
    const conversionData = analytics.timeline.conversionRate[index];
    return {
      date: item.formattedDate,
      leads: item.count,
      converted: item.converted,
      contacted: item.contacted,
      qualified: item.qualified,
      conversionRate: conversionData?.conversionRate || 0,
      contactRate: conversionData?.contactRate || 0,
    };
  }) || [];

  // Prepare activities data
  const activitiesData = analytics?.activities.calls.map((callItem, index) => {
    const meetingItem = analytics.activities.meetings[index];
    const taskItem = analytics.activities.tasks[index];
    
    return {
      date: format(new Date(callItem._id.date), "MMM dd"),
      calls: callItem.count,
      callsCompleted: callItem.completed,
      meetings: meetingItem?.count || 0,
      meetingsCompleted: meetingItem?.completed || 0,
      tasks: taskItem?.count || 0,
      tasksCompleted: taskItem?.completed || 0,
    };
  }) || [];

  // Prepare status distribution data
  const statusData = analytics?.distribution.byStatus.map((item) => ({
    name: item.status,
    value: item.count,
  })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Activity className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Error loading analytics
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchAnalytics()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black ">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Track your sales performance and key metrics
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex space-x-2">
              {(["daily", "weekly", "monthly"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={currentFilter === filter ? "default" : "outline"}
                  onClick={() => handleFilterChange(filter)}
                  className={cn(
                    "capitalize transition-all duration-200",
                    currentFilter === filter 
                      ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg" 
                      : "hover:bg-blue-50"
                  )}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {filter}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Leads</p>
                      <p className="text-3xl font-bold">{analytics.summary.totalLeads}</p>
                      <p className="text-blue-100 text-xs mt-1">
                        Contact Rate: {analytics.summary.overallContactRate}%
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Converted</p>
                      <p className="text-3xl font-bold">{analytics.summary.totalConverted}</p>
                      <p className="text-green-100 text-xs mt-1">
                        Rate: {analytics.summary.overallConversionRate}%
                      </p>
                    </div>
                    <Target className="h-12 w-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Contacted</p>
                      <p className="text-3xl font-bold">{analytics.summary.totalContacted}</p>
                      <p className="text-purple-100 text-xs mt-1">
                        {analytics.activities.calls.reduce((sum, call) => sum + call.count, 0)} calls made
                      </p>
                    </div>
                    <Phone className="h-12 w-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Qualified</p>
                      <p className="text-3xl font-bold">{analytics.summary.totalQualified}</p>
                      <p className="text-orange-100 text-xs mt-1">
                        {analytics.activities.meetings.reduce((sum, meeting) => sum + meeting.count, 0)} meetings held
                      </p>
                    </div>
                    <Award className="h-12 w-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Leads Timeline */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Leads Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="leads"
                          stackId="1"
                          stroke="#3B82F6"
                          fill="url(#colorLeads)"
                        />
                        <Area
                          type="monotone"
                          dataKey="converted"
                          stackId="2"
                          stroke="#10B981"
                          fill="url(#colorConverted)"
                        />
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Lead Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Activities Timeline */}
              <Card className="lg:col-span-2 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Activity className="h-5 w-5 text-green-600" />
                    Activities Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activitiesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Bar dataKey="calls" fill="#3B82F6" name="Calls" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="meetings" fill="#10B981" name="Meetings" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="tasks" fill="#F59E0B" name="Tasks" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Team Performance */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.distribution.byOwner.map((owner, index) => (
                      <div key={owner._id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800">{owner.ownerName}</h4>
                            <p className="text-sm text-slate-600">{owner.ownerEmail}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-800">{owner.totalLeads}</p>
                            <p className="text-xs text-slate-600">Total Leads</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-green-600">{owner.convertedLeads}</p>
                            <p className="text-xs text-slate-600">Converted</p>
                            <p className="text-xs text-green-600">{owner.conversionRate}%</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-blue-600">{owner.contactedLeads}</p>
                            <p className="text-xs text-slate-600">Contacted</p>
                            <p className="text-xs text-blue-600">{owner.contactRate}%</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-purple-600">{owner.qualifiedLeads}</p>
                            <p className="text-xs text-slate-600">Qualified</p>
                            <p className="text-xs text-purple-600">{owner.qualificationRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lead Source Performance */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Target className="h-5 w-5 text-emerald-600" />
                    Lead Source Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performance.leadSourcePerformance.map((source, index) => (
                      <div key={source._id} className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-slate-800">{source.source}</h4>
                          <span className="text-lg font-bold text-slate-800">{source.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="text-green-600 font-semibold">{source.converted}</span>
                              <span className="text-slate-600 ml-1">converted</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-blue-600 font-semibold">{source.conversionRate}%</span>
                              <span className="text-slate-600 ml-1">rate</span>
                            </div>
                          </div>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${source.conversionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Rate Timeline */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <TrendingUp className="h-5 w-5 text-rose-600" />
                  Conversion & Contact Rate Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="conversionRate" 
                        stroke="#EF4444" 
                        strokeWidth={3}
                        name="Conversion Rate (%)"
                        dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="contactRate" 
                        stroke="#06B6D4" 
                        strokeWidth={3}
                        name="Contact Rate (%)"
                        dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;