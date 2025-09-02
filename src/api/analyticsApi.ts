import axiosInstance from '@/utils/axios';

export interface DateRange {
  start: string;
  end: string;
  bucket: string;
}

export interface LeadAnalytics {
  created: number;
  converted: number;
  conversionRate: number;
  avgTimeToConvertDays: number | null;
  statusBreakdown: Array<{ _id: string; count: number }>;
  sourceBreakdown: Array<{ _id: string; count: number }>;
  timeseries: Array<{ ts: string; count: number }>;
}

interface CallAnalytics {
  byType: Array<{ _id: string; count: number }>;
  byStatus: Array<{ _id: string; count: number }>;
  timeseries: Array<{ ts: string; count: number }>;
}

interface MeetingAnalytics {
  byStatus: Array<{ _id: string; count: number }>;
  timeseries: Array<{ ts: string; count: number }>;
}

interface TaskCompletion {
  total: number;
  done: number;
  completionRate: number;
}

interface TaskAnalytics {
  byStatus: Array<{ _id: string; count: number }>;
  completion: TaskCompletion;
  timeseries: Array<{ ts: string; count: number }>;
  source: 'personal' | 'team/company';
}

export interface AnalyticsData {
  dateRange: DateRange;
  role: string;
  companyId: string;
  leads: LeadAnalytics;
  calls: CallAnalytics;
  meetings: MeetingAnalytics;
  tasks: TaskAnalytics;
}

interface AnalyticsParams {
  companyId: string;
  filter?: 'daily' | 'weekly' | 'monthly' | 'custom';
  from?: string;
  to?: string;
}

interface AnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    success: boolean;
    filter: string;
    data: AnalyticsData;
  };
}

export async function getallanalytics(params: AnalyticsParams): Promise<{
  success: boolean;
  filter: string;
  data: AnalyticsData;
}> {
  const response = await axiosInstance.get<AnalyticsResponse>("/dashboard/getAnalytics", { 
    params: {
      companyId: params.companyId,
      fillter: params.filter || 'daily', // API expects 'fillter' instead of 'filter'
      ...(params.from && { from: params.from }),
      ...(params.to && { to: params.to })
    }
  });
  return response.data.result;
}

// User Analytics Types
export interface KPI {
  title: string;
  value: number | string;
  icon: string;
  change: string;
}

export interface ConversionFunnel {
  labels: string[];
  data: number[];
}

export interface ActivityDataset {
  label: string;
  data: number[];
}

export interface ActivityOverTime {
  labels: string[];
  datasets: ActivityDataset[];
}

export interface DealProgress {
  labels: string[];
  data: number[];
}

export interface SmartInsight {
  type: string;
  message: string;
}

export interface UserAnalyticsData {
  kpis: KPI[];
  conversionFunnel: ConversionFunnel;
  activityOverTime: ActivityOverTime;
  dealProgress: DealProgress;
  pendingTasks: any[];
  smartInsights: SmartInsight[];
}

export interface UserAnalyticsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: UserAnalyticsData;
}

export async function getUserAnalytics(): Promise<UserAnalyticsResponse> {
  const response = await axiosInstance.get<UserAnalyticsResponse>("/dashboard/getUserAnalytics");
  return response.data;
}