import axiosInstance from '@/utils/axios';

// Fetch general dashboard data with new API structure
export const getUserDashboard = async (companyId: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  params.append('companyId', companyId);
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await axiosInstance.get(`/dashboard/getDashboard?${params.toString()}`);
  return response.data;
};
