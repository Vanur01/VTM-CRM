import axiosInstance from '@/utils/axios';

// New API Response Structure
export interface TimelineLeads {
  _id: {
    date: string;
  };
  count: number;
  converted: number;
  contacted: number;
  qualified: number;
  formattedDate: string;
}

export interface ConversionRateData {
  _id: {
    date: string;
  };
  total: number;
  converted: number;
  contacted: number;
  date: string;
  conversionRate: number;
  contactRate: number;
  formattedDate: string;
}

export interface Timeline {
  leads: TimelineLeads[];
  conversionRate: ConversionRateData[];
  groupBy: 'day' | 'week' | 'month';
}

export interface DistributionByStatus {
  count: number;
  status: string;
}

export interface DistributionByOwner {
  _id: string;
  ownerName: string;
  ownerEmail: string;
  totalLeads: number;
  convertedLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  contactRate: number;
  qualificationRate: number;
}

export interface Distribution {
  byStatus: DistributionByStatus[];
  byOwner: DistributionByOwner[];
}

export interface ActivityData {
  _id: {
    date: string;
  };
  count: number;
  completed: number;
}

export interface Activities {
  calls: ActivityData[];
  meetings: ActivityData[];
  tasks: ActivityData[];
}

export interface LeadSourcePerformance {
  _id: string;
  total: number;
  converted: number;
  source: string;
  conversionRate: number;
}

export interface Performance {
  averageConversionTime: number;
  leadSourcePerformance: LeadSourcePerformance[];
  statusTransitionTimes: any[];
}

export interface Summary {
  totalLeads: number;
  totalConverted: number;
  totalContacted: number;
  totalQualified: number;
  overallConversionRate: number;
  overallContactRate: number;
}

export interface AnalyticsData {
  timeline: Timeline;
  distribution: Distribution;
  activities: Activities;
  performance: Performance;
  summary: Summary;
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
  result: AnalyticsData;
}

export async function getallanalytics(params: AnalyticsParams): Promise<AnalyticsData> {
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