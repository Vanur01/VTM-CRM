import axiosInstance from "@/utils/axios";

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
  isActive: boolean;
  manager?: string | null;
  company?: string;
  deviceTokens?: string[];
  profilePic?: string | null;
  lastLoginDate?: string;
  tempTokens?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface GetProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: UserProfile;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  mobile: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: UserProfile;
}

// Type aliases for backward compatibility
export type AdminProfile = UserProfile;
export type GetAdminProfileResponse = GetProfileResponse;
export type UpdateAdminProfileRequest = UpdateProfileRequest;
export type UpdateAdminProfileResponse = UpdateProfileResponse;

// Get profile based on user role (currently admin only, can be extended)
export const getProfile = async (): Promise<GetProfileResponse> => {
  try {
    // For now, using admin endpoint. Can be made role-based later
    const response = await axiosInstance.get("/admin/getAdminProfile");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

// Update profile based on user role (currently admin only, can be extended)
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  try {
    // For now, using admin endpoint. Can be made role-based later
    const response = await axiosInstance.put("/admin/updateAdminProfile", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
};

// Manager Profile Functions
export const getManagerById = async (managerId: string, companyId: string): Promise<GetProfileResponse> => {
  try {
    const response = await axiosInstance.get(`/admin/getManagerById/${managerId}/${companyId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch manager profile");
  }
};

export const updateManagerProfile = async (
  managerId: string,
  companyId: string,
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  try {
    const response = await axiosInstance.put(`/admin/updateManager/${managerId}/${companyId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update manager profile");
  }
};

// Legacy functions for backward compatibility
export const getAdminProfile = getProfile;
export const updateAdminProfile = updateProfile;
