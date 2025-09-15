"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Phone,
  Calendar,
  CheckSquare,
  Target,
  TrendingUp,
  RefreshCw,
  Download,
  ArrowRight,
  Clock,
  Star,
  Building,
  Mail,
  User,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAuthStore } from "@/stores/salesCrmStore/useAuthStore";
import { useDashboardStore } from '@/stores/salesCrmStore/useDashboardStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CRMDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuthStore();

  // Dashboard store
  const { dashboardData, loading, error, fetchDashboard, exportDashboard } = useDashboardStore();

  useEffect(() => {
    if (user?.companyId) {
      const today = new Date().toISOString().split('T')[0];
      fetchDashboard(user.companyId, today, today);
    }
  }, [user?.companyId, fetchDashboard]);

  const refreshData = async () => {
    if (!user?.companyId) return;
    setIsRefreshing(true);
    const today = new Date().toISOString().split('T')[0];
    await fetchDashboard(user.companyId, today, today);
    setIsRefreshing(false);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    if (!user?.companyId) return;
    
    const today = new Date();
    let startDate: string, endDate: string;
    
    switch (timeframe) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(today.setDate(today.getDate() - 7));
        startDate = weekStart.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      default:
        startDate = endDate = new Date().toISOString().split('T')[0];
    }
    
    fetchDashboard(user.companyId, startDate, endDate);
  };

  // Prepare chart data for leads by stage
  const leadsByStageData = dashboardData ? {
    labels: dashboardData.leadsByStage.map(stage => stage.status),
    datasets: [
      {
        label: 'Number of Leads',
        data: dashboardData.leadsByStage.map(stage => stage.count),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
          '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
        ],
        borderColor: [
          '#1E40AF', '#059669', '#D97706', '#DC2626',
          '#7C3AED', '#0891B2', '#65A30D', '#EA580C'
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  } : { labels: [], datasets: [] };

  // Get status color helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-green-100 text-green-700 border-green-200';
      case 'follow up scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'interested': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'qualified': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'converted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'not interested': return 'bg-red-100 text-red-700 border-red-200';
      case 'unreachable': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'disqualified': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'urgent': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mx-8 mt-8">
          Error: {error}
        </div>
      )}
      
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">CRM Dashboard</h1>
            <p className="text-slate-600 text-base font-medium">
              Welcome back, {user?.name}! Here's your activity overview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="text-slate-700 font-medium">Refresh</span>
            </button>
            <select
              value={selectedTimeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 font-medium shadow-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
              onClick={exportDashboard}
            >
              <Download className="h-4 w-4" />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Content Loader or Dashboard Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <span className="text-lg text-blue-700 font-semibold">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-8 w-8 text-blue-100" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{dashboardData?.counts.totalLeads || 0}</p>
                      <p className="text-blue-100 text-sm font-medium">Total Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <Phone className="h-8 w-8 text-green-100" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{dashboardData?.counts.calls || 0}</p>
                      <p className="text-green-100 text-sm font-medium">Calls</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="h-8 w-8 text-purple-100" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{dashboardData?.counts.meetings || 0}</p>
                      <p className="text-purple-100 text-sm font-medium">Meetings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckSquare className="h-8 w-8 text-orange-100" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{dashboardData?.counts.tasks || 0}</p>
                      <p className="text-orange-100 text-sm font-medium">Tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="h-8 w-8 text-indigo-100" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{dashboardData?.convertedLeads.length || 0}</p>
                      <p className="text-indigo-100 text-sm font-medium">Converted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Leads by Stage Chart */}
              <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-slate-800">Leads by Stage</h3>
                  <div className="h-80">
                    <Bar 
                      data={leadsByStageData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            backgroundColor: "#1F2937",
                            titleColor: "#F9FAFB",
                            bodyColor: "#F9FAFB",
                            borderColor: "#3B82F6",
                            borderWidth: 1,
                            cornerRadius: 8,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: '#E5E7EB',
                            },
                            ticks: {
                              color: '#6B7280',
                              font: {
                                size: 12,
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: '#6B7280',
                              font: {
                                size: 12,
                              },
                              maxRotation: 45,
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Leads */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-slate-800">Follow-up Required</h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {dashboardData?.followLeads.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No follow-ups pending</p>
                      </div>
                    ) : (
                      dashboardData?.followLeads.map((lead) => (
                        <div key={lead.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-800">{lead.fullName}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{lead.phone}</span>
                            </div>
                            {lead.followUpDate && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(lead.followUpDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Tasks */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-orange-500" />
                    Recent Tasks
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {dashboardData?.activities.tasks.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No tasks found</p>
                      </div>
                    ) : (
                      dashboardData?.activities.tasks.map((task) => (
                        <div key={task._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-800 text-sm">{task.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Calls */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-500" />
                    Recent Calls
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {dashboardData?.activities.calls.length === 0 ? (
                      <div className="text-center py-8">
                        <Phone className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No calls found</p>
                      </div>
                    ) : (
                      dashboardData?.activities.calls.map((call) => (
                        <div key={call._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-800 text-sm">{call.callPurpose}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(call.outgoingCallStatus)}`}>
                              {call.outgoingCallStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-3">{call.callAgenda}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 capitalize">{call.callType}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(call.callStartTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Meetings */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Recent Meetings
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {dashboardData?.activities.meetings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No meetings found</p>
                      </div>
                    ) : (
                      dashboardData?.activities.meetings.map((meeting) => (
                        <div key={meeting._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-800 text-sm">{meeting.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(meeting.status)}`}>
                              {meeting.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-3 w-3" />
                              <span>{meeting.meetingVenue}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>{meeting.participants.length} participants</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(meeting.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Overview */}
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  Team Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Display Managers */}
                  {dashboardData?.managers.map((manager) => (
                    <div key={manager._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 font-semibold text-sm">
                            {manager.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{manager.name}</h4>
                          <p className="text-xs text-slate-600">{manager.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{manager.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${manager.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-slate-600">
                            {manager.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Display Users */}
                  {dashboardData?.users.map((user) => (
                    <div key={user._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-700 font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{user.name}</h4>
                          <p className="text-xs text-slate-600">{user.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-slate-600">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
