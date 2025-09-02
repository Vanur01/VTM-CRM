'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Users, TrendingUp, ArrowUpRight, ArrowDownRight, Target, Filter } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface LeadsProps {
  data: {
    created: number;
    converted: number;
    conversionRate: number;
    avgTimeToConvertDays: number | null;
    statusBreakdown: Array<{ _id: string; count: number }>;
    sourceBreakdown: Array<{ _id: string; count: number }>;
    timeseries: Array<{ ts: string; count: number }>;
  };
}

const Leads = ({ data }: LeadsProps) => {
  // Add safety checks for data
  if (!data) {
    return <div className="p-8 text-center text-gray-500">No lead data available</div>;
  }

  // Calculate key metrics from the new data structure
  const totalLeadsCreated = data.created || 0;
  const totalConverted = data.converted || 0;
  const conversionRate = data.conversionRate || 0;
  const avgConvertTime = data.avgTimeToConvertDays;

  // Safety checks for arrays
  const timeseries = data.timeseries || [];
  const statusBreakdown = data.statusBreakdown || [];
  const sourceBreakdown = data.sourceBreakdown || [];

  // Prepare chart data
  const sourceBreakdownData = {
    labels: sourceBreakdown.map(item => item._id || 'Unknown'),
    datasets: [{
      data: sourceBreakdown.map(item => item.count),
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)',
      ],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const statusBreakdownData = {
    labels: statusBreakdown.map(item => item._id || 'Unknown'),
    datasets: [{
      label: 'Lead Status',
      data: statusBreakdown.map(item => item.count),
      backgroundColor: 'rgba(79, 70, 229, 0.8)',
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const timeseriesData = {
    labels: timeseries.map(item => {
      const date = new Date(item.ts);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [{
      label: 'Leads Over Time',
      data: timeseries.map(item => item.count),
      borderColor: 'rgba(79, 70, 229, 1)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(79, 70, 229, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
    }],
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">TOTAL LEADS</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{totalLeadsCreated}</p>
                <p className="text-sm text-blue-600 mt-1">Created in period</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">CONVERTED LEADS</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{totalConverted}</p>
                <p className="text-sm text-green-600 mt-1">Successfully converted</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <Target className="w-8 h-8 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">CONVERSION RATE</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-purple-600 mt-1">Lead to customer</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <TrendingUp className="w-8 h-8 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">AVG. CONVERT TIME</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">
                  {avgConvertTime ? `${Math.round(avgConvertTime)}d` : 'N/A'}
                </p>
                <p className="text-sm text-amber-600 mt-1">Days to convert</p>
              </div>
              <div className="p-3 bg-amber-200 rounded-full">
                <Filter className="w-8 h-8 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Generation Trend */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">Lead Generation Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            {timeseries.length > 0 ? (
              <Line
                data={{
                  labels: timeseries.map(item => new Date(item.ts).toLocaleDateString()),
                  datasets: [
                    {
                      label: 'Leads Created',
                      data: timeseries.map(item => item.count),
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#f3f4f6',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No trend data available</p>
                  <p className="text-sm">Data will appear as leads are created</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Status Distribution */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-900">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              {statusBreakdown.length > 0 ? (
                <Bar
                  data={{
                    labels: statusBreakdown.map(item => item._id || 'Unknown'),
                    datasets: [
                      {
                        label: 'Number of Leads',
                        data: statusBreakdown.map(item => item.count),
                        backgroundColor: [
                          '#3B82F6',
                          '#10B981',
                          '#F59E0B',
                          '#EF4444',
                          '#8B5CF6',
                          '#EC4899',
                          '#06B6D4',
                        ],
                        borderColor: [
                          '#2563EB',
                          '#059669',
                          '#D97706',
                          '#DC2626',
                          '#7C3AED',
                          '#DB2777',
                          '#0891B2',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: '#f3f4f6',
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No status data available</p>
                    <p className="text-sm">Status breakdown will appear as leads are created</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-900">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              {sourceBreakdown.length > 0 ? (
                <Doughnut
                  data={{
                    labels: sourceBreakdown.map(item => item._id || 'Unknown'),
                    datasets: [{
                      data: sourceBreakdown.map(item => item.count),
                      backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#8B5CF6',
                        '#EC4899',
                        '#06B6D4',
                        '#F97316',
                        '#84CC16',
                        '#06B6D4',
                      ],
                      borderColor: '#ffffff',
                      borderWidth: 2,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No source data available</p>
                    <p className="text-sm">Lead sources will appear as leads are created</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-900">Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {statusBreakdown.length > 0 ? (
                statusBreakdown.map((status, index) => (
                  <div key={status._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
                            '#8B5CF6', '#EC4899', '#06B6D4'
                          ][index % 7]
                        }}
                      ></div>
                      <span className="font-medium text-gray-700">{status._id || 'Unknown'}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{status.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No status data available</p>
                  <p className="text-sm">Status breakdown will appear as leads are created</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-900">Source Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {sourceBreakdown.length > 0 ? (
                sourceBreakdown.slice(0, 6).map((source, index) => (
                  <div key={source._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
                            '#8B5CF6', '#EC4899'
                          ][index % 6]
                        }}
                      ></div>
                      <span className="font-medium text-gray-700">{source._id || 'Unknown'}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{source.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No source data available</p>
                  <p className="text-sm">Lead sources will appear as leads are created</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leads;
