"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Users,
  Phone,
  Calendar as CalendarComponent,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
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
  Area,
  AreaChart,
  Pie,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
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
    if (filter !== "custom") {
      setFilter(filter);
    } else {
      setFilter(filter);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customDateRange.from && customDateRange.to) {
      setDateRange({
        from: format(customDateRange.from, "yyyy-MM-dd"),
        to: format(customDateRange.to, "yyyy-MM-dd"),
      });
    }
  };

  const formatTimeSeries = (
    timeseries: Array<{ ts: string; count: number }>
  ) => {
    if (!timeseries || timeseries.length === 0) {
      // Generate empty data points for better chart display
      const now = new Date();
      const emptyData = [];
      for (let i = 0; i < 24; i++) {
        const date = new Date(now);
        date.setHours(i, 0, 0, 0);
        emptyData.push({
          date: format(
            date,
            analytics?.dateRange.bucket === "hour" ? "HH:mm" : "MMM dd"
          ),
          count: 0,
          timestamp: date.toISOString(),
        });
      }
      return emptyData;
    }

    return timeseries.map((item) => ({
      date: format(
        new Date(item.ts),
        analytics?.dateRange.bucket === "hour" ? "HH:mm" : "MMM dd"
      ),
      count: item.count,
      timestamp: item.ts,
    }));
  };

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
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your sales performance and metrics
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            {(["daily", "weekly", "monthly", "custom"] as const).map(
              (filter) => (
                <Button
                  key={filter}
                  variant={currentFilter === filter ? "default" : "outline"}
                  onClick={() => handleFilterChange(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              )
            )}
          </div>

          {/* Clear Filter Button */}
          {(currentFilter !== "daily" || dateRange) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilter('daily');
                setCustomDateRange({ from: undefined, to: undefined });
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {currentFilter === "custom" && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Select Custom Date Range</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Choose a specific date range to analyze your data
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* From Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  From Date
                </label>
                {/* Fallback HTML Date Input for Testing */}
                <input
                  type="date"
                  value={customDateRange.from ? format(customDateRange.from, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    console.log('HTML input from date:', date);
                    setCustomDateRange(prev => ({ ...prev, from: date }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={new Date().toISOString().split('T')[0]}
                />
                
                {/* Original Popover Calendar */}
                {/* <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customDateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDateRange.from ? (
                          format(customDateRange.from, "PPP")
                        ) : (
                          <span>Or use calendar picker</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateRange.from}
                        onSelect={(date) => {
                          console.log("From date selected via calendar:", date);
                          setCustomDateRange((prev) => ({
                            ...prev,
                            from: date,
                          }));
                        }}
                        disabled={(date) => {
                          if (date > new Date()) return true;
                          if (customDateRange.to && date > customDateRange.to)
                            return true;
                          return false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div> */}
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  To Date
                </label>
                {/* Fallback HTML Date Input for Testing */}
                <input
                  type="date"
                  value={customDateRange.to ? format(customDateRange.to, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    console.log('HTML input to date:', date);
                    setCustomDateRange(prev => ({ ...prev, to: date }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={new Date().toISOString().split('T')[0]}
                  min={customDateRange.from ? format(customDateRange.from, 'yyyy-MM-dd') : ''}
                />
                
                {/* Original Popover Calendar */}
                {/* <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customDateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDateRange.to ? (
                          format(customDateRange.to, "PPP")
                        ) : (
                          <span>Or use calendar picker</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateRange.to}
                        onSelect={(date) => {
                          console.log("To date selected via calendar:", date);
                          setCustomDateRange((prev) => ({ ...prev, to: date }));
                        }}
                        disabled={(date) => {
                          if (date > new Date()) return true;
                          if (customDateRange.from && date < customDateRange.from)
                            return true;
                          return false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleCustomDateSubmit}
                  disabled={
                    !customDateRange.from || !customDateRange.to || isLoading
                  }
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2 h-4 w-4" />
                      Apply Filter
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setCustomDateRange({ from: undefined, to: undefined });
                    setFilter("daily");
                  }}
                  className="flex-shrink-0"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Quick Presets:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = subDays(today, 7);
                    setCustomDateRange({ from: lastWeek, to: today });
                  }}
                  className="text-xs"
                >
                  Last 7 Days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = subDays(today, 30);
                    setCustomDateRange({ from: lastMonth, to: today });
                  }}
                  className="text-xs"
                >
                  Last 30 Days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const thisWeekStart = startOfWeek(today);
                    setCustomDateRange({ from: thisWeekStart, to: today });
                  }}
                  className="text-xs"
                >
                  This Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const thisMonthStart = startOfMonth(today);
                    setCustomDateRange({ from: thisMonthStart, to: today });
                  }}
                  className="text-xs"
                >
                  This Month
                </Button>
              </div>
            </div>

            {/* Selected Range Display */}
            {customDateRange.from && customDateRange.to && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Range:</strong>{" "}
                  {format(customDateRange.from, "PPP")} to{" "}
                  {format(customDateRange.to, "PPP")}
                  <span className="ml-2 text-blue-600">
                    (
                    {Math.ceil(
                      (customDateRange.to.getTime() -
                        customDateRange.from.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days)
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {analytics && (
        <>
          {/* Date Range Info */}
          <Card
            className={
              currentFilter === "custom" ? "border-blue-200 bg-blue-50/30" : ""
            }
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Showing data from{" "}
                  {format(new Date(analytics.dateRange.start), "PPP p")} to{" "}
                  {format(new Date(analytics.dateRange.end), "PPP p")}
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-1">
                  <span>
                    Role:{" "}
                    <span className="font-medium capitalize">
                      {analytics.role}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    Bucket:{" "}
                    <span className="font-medium">
                      {analytics.dateRange.bucket}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    Filter:{" "}
                    <span className="font-medium capitalize">
                      {currentFilter}
                    </span>
                  </span>
                  {currentFilter === "custom" && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">
                        Custom Range Applied
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  UTC Range: {analytics.dateRange.start} to{" "}
                  {analytics.dateRange.end}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Empty State Check */}
          {analytics.leads.created === 0 &&
          analytics.calls.byType.length === 0 &&
          analytics.meetings.byStatus.length === 0 &&
          analytics.tasks.completion.total === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Data Available
                  </h3>
                  <p className="text-gray-600 mb-2">
                    No analytics data found for the selected time period.
                  </p>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>
                      Current filter:{" "}
                      <span className="font-medium capitalize">
                        {currentFilter}
                      </span>
                    </p>
                    <p>
                      Date range:{" "}
                      {format(
                        new Date(analytics.dateRange.start),
                        "MMM dd, yyyy HH:mm"
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(analytics.dateRange.end),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                    <p>
                      Role:{" "}
                      <span className="font-medium capitalize">
                        {analytics.role}
                      </span>
                    </p>
                  </div>
                  <div className="space-x-2">
                    {currentFilter !== "weekly" && (
                      <Button
                        onClick={() => setFilter("weekly")}
                        variant="outline"
                        size="sm"
                      >
                        View Weekly Data
                      </Button>
                    )}
                    {currentFilter !== "monthly" && (
                      <Button
                        onClick={() => setFilter("monthly")}
                        variant="outline"
                        size="sm"
                      >
                        View Monthly Data
                      </Button>
                    )}
                    {currentFilter !== "custom" && (
                      <Button
                        onClick={() => setFilter("custom")}
                        variant="outline"
                        size="sm"
                      >
                        Custom Range
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Leads Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Leads
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.leads.created}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.leads.converted} converted (
                      {analytics.leads.conversionRate}%)
                    </p>
                  </CardContent>
                </Card>

                {/* Calls Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Calls
                    </CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.calls.byType.reduce(
                        (sum, item) => sum + item.count,
                        0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all call types
                    </p>
                  </CardContent>
                </Card>

                {/* Meetings Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Meetings
                    </CardTitle>
                    <CalendarComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.meetings.byStatus.reduce(
                        (sum, item) => sum + item.count,
                        0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All meeting statuses
                    </p>
                  </CardContent>
                </Card>

                {/* Tasks Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Task Completion
                    </CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.tasks.completion.completionRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.tasks.completion.done} of{" "}
                      {analytics.tasks.completion.total} tasks
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leads Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leads Over Time</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {analytics.leads.timeseries.length === 0
                        ? "No lead data in this time period"
                        : `${analytics.leads.timeseries.length} data points`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={formatTimeSeries(analytics.leads.timeseries)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `Time: ${label}`;
                            }
                            return label;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Lead Status Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Status Breakdown</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {analytics.leads.statusBreakdown.length === 0
                        ? "No leads in this period"
                        : `${analytics.leads.statusBreakdown.length} different statuses`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {analytics.leads.statusBreakdown.length === 0 ? (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        <div className="text-center">
                          <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No lead status data available</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Tooltip />
                          <Pie
                            data={analytics.leads.statusBreakdown}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ _id, count }: any) => `${_id}: ${count}`}
                          >
                            {analytics.leads.statusBreakdown.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Calls Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle>Calls Over Time</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {analytics.calls.timeseries.length === 0
                        ? "No call data in this time period"
                        : `${analytics.calls.timeseries.length} data points`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={formatTimeSeries(analytics.calls.timeseries)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#00C49F"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Call Types Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Call Types</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {analytics.calls.byType.length === 0
                        ? "No call types data"
                        : `${analytics.calls.byType.length} types`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {analytics.calls.byType.length === 0 ? (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        <div className="text-center">
                          <Phone className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No call types data available</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.calls.byType}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="_id" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#FFBB28" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Meetings Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle>Meetings Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={formatTimeSeries(analytics.meetings.timeseries)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#FF8042"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Tasks Time Series */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tasks Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={formatTimeSeries(analytics.tasks.timeseries)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884D8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Lead Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.leads.sourceBreakdown.map((source, index) => (
                        <div
                          key={source._id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {source._id || "Unknown"}
                          </span>
                          <span className="text-sm font-medium">
                            {source.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Call Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Call Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.calls.byStatus.map((status, index) => (
                        <div
                          key={status._id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {status._id || "Unknown"}
                          </span>
                          <span className="text-sm font-medium">
                            {status.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Task Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Task Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.tasks.byStatus.map((status, index) => (
                        <div
                          key={status._id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {status._id || "Unknown"}
                          </span>
                          <span className="text-sm font-medium">
                            {status.count}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Source: {analytics.tasks.source}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.leads.conversionRate}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Conversion Rate
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.leads.avgTimeToConvertDays
                          ? `${analytics.leads.avgTimeToConvertDays.toFixed(
                              1
                            )} days`
                          : "N/A"}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Avg. Time to Convert
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.tasks.completion.completionRate.toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Task Completion Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Debug Information - Remove in production */}
              <Card className="border-dashed border-gray-300">
                <CardHeader>
                  <CardTitle className="text-sm">Debug Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Data Summary:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Leads created: {analytics.leads.created}</li>
                          <li>Leads converted: {analytics.leads.converted}</li>
                          <li>Call types: {analytics.calls.byType.length}</li>
                          <li>
                            Meeting statuses:{" "}
                            {analytics.meetings.byStatus.length}
                          </li>
                          <li>
                            Task statuses: {analytics.tasks.byStatus.length}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Time Series Data Points:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Leads: {analytics.leads.timeseries.length}</li>
                          <li>Calls: {analytics.calls.timeseries.length}</li>
                          <li>
                            Meetings: {analytics.meetings.timeseries.length}
                          </li>
                          <li>Tasks: {analytics.tasks.timeseries.length}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="font-medium">API Response Structure:</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(
                          {
                            dateRange: analytics.dateRange,
                            role: analytics.role,
                            companyId: analytics.companyId,
                            dataPoints: {
                              leads: {
                                created: analytics.leads.created,
                                statusBreakdown:
                                  analytics.leads.statusBreakdown.length,
                                sourceBreakdown:
                                  analytics.leads.sourceBreakdown.length,
                                timeseries: analytics.leads.timeseries.length,
                              },
                              calls: {
                                byType: analytics.calls.byType.length,
                                byStatus: analytics.calls.byStatus.length,
                                timeseries: analytics.calls.timeseries.length,
                              },
                              meetings: {
                                byStatus: analytics.meetings.byStatus.length,
                                timeseries:
                                  analytics.meetings.timeseries.length,
                              },
                              tasks: {
                                byStatus: analytics.tasks.byStatus.length,
                                timeseries: analytics.tasks.timeseries.length,
                                source: analytics.tasks.source,
                              },
                            },
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
