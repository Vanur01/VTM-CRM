// src/api/reportsApi.ts
import axiosInstance from "@/utils/axios";

// User Report Interface
export interface UserReportData {
  totalLeads: number;
  convertedLeads: number;
  notConvertedLeads: number;
  totalMeetings: number;
  totalCalls: number;
  totalTasks: number;
}

// Admin Report Interface
export interface AdminReportData {
  totalLeads: number;
  convertedLeads: number;
  notConvertedLeads: number;
  totalMeetings: number;
  totalCalls: number;
  totalTasks: number;
}

// Manager Report Interface
export interface UserReport {
  userId: string;
  name: string;
  email: string;
  leads: {
    total: number;
    converted: number;
    notConverted: number;
  };
  meetings: {
    total: number;
  };
  calls: {
    total: number;
  };
  tasks: {
    total: number;
  };
}

export interface ManagerReportData {
  managerId: string;
  userReports: UserReport[];
}

// API Response Interfaces
interface ApiResponse<T> {
  message: string;
  success: boolean;
  statusCode: number;
  data: T;
}

/**
 * Fetch user reports
 */
export const getUserReports = async (): Promise<UserReportData> => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserReportData>>(
      "/report/userReports"
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user reports"
    );
  }
};

/**
 * Fetch admin reports
 * @param companyId - The company ID for admin reports
 */
export const getAdminReports = async (companyId: string): Promise<AdminReportData> => {
  try {
    const response = await axiosInstance.get<ApiResponse<AdminReportData>>(
      `/report/adminReports/${companyId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin reports"
    );
  }
};

/**
 * Fetch manager reports
 */
export const getManagerReports = async (): Promise<ManagerReportData> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ManagerReportData>>(
      "/report/managerReport"
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch manager reports"
    );
  }
};