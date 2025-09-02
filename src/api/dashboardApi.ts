import axiosInstance from '@/utils/axios';

// Fetch admin dashboard data
export const getAdminDashboard = async () => {
  const response = await axiosInstance.get('/dashboard/getAdminDashboard');
  return response.data;
};

// Fetch general dashboard data
export const getUserDashboard = async () => {
  const response = await axiosInstance.get('/dashboard/getDashboard');
  return response.data;
};
