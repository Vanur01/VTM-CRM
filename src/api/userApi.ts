import axiosInstance from "@/utils/axios";

export interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  userType: string;
  role: string;
  isActive: boolean;
  deviceTokens: string[];
  status: number;
  signupStatus: number;
  tokens: string | null;
  refreshTokens: string | null;
  tempTokens: string | null;
  createdAt: string;
  updatedAt: string;
  profilePic: string | null;
  companyName?: string;
  companyId?: string;
  managerId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface AddUserOrManagerRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'user' | 'manager';
}

export interface GetUsersByManagerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: User[];
}

export interface AddUserOrManagerResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    user: User;
  };
}

export interface GetAllUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    pagination: {
      total: number;
      page: number | null;
      limit: number | null;
      totalPages: number | null;
    };
    users: User[];
  };
}

export interface GetUserByIdResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: User;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  mobile?: string;
  role?: 'user' | 'manager' | 'admin';
  isActive?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: User;
}

export interface ToggleUserActiveResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: User;
}

export interface DeleteUserResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface AssignUserToManagerRequest {
  companyId: string;
  managerId: string;
  userEmails: string[];
}

export interface AssignUserToManagerResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// Add User or Manager by Admin
export async function addUserOrManager(companyId: string, userData: AddUserOrManagerRequest): Promise<User> {
  const response = await axiosInstance.post<AddUserOrManagerResponse>(`/admin/addUserOrManager/${companyId}`, userData);
  return response.data.data.user;
}

// Get Users by Manager
export async function getUsersByManager(managerId: string): Promise<User[]> {
  try {
    console.log('Making API call to getUsersByManager with managerId:', managerId);
    
    // Add cache busting parameter to avoid 304 responses when we need fresh data
    const url = `/admin/getUsersByManager/${managerId}?t=${Date.now()}`;
    const response = await axiosInstance.get<GetUsersByManagerResponse>(url);
    
    console.log('API response status:', response.status);
    console.log('API response data:', response.data);
    
    // Check for success and result array
    if (response.data && response.data.success && response.data.result) {
      // Filter only active users
      const activeUsers = response.data.result.filter(user => user.isActive === true);
      console.log('getUsersByManager: Returning active users:', activeUsers);
      return activeUsers;
    }
    
    // Fallback to empty array if data structure is unexpected
    console.log('Unexpected data structure, returning empty array');
    return [];
  } catch (error) {
    console.error('Error in getUsersByManager:', error);
    throw error;
  }
}

// Manager Add User
export async function managerAddUser(companyId: string, userData: AddUserOrManagerRequest): Promise<User> {
  const response = await axiosInstance.post<AddUserOrManagerResponse>(`/admin/managerAddUser/${companyId}`, userData);
  return response.data.data.user;
}

// Get All Users by Company
export async function getAllUsers(companyId: string): Promise<User[]> {
  try {
    console.log('getAllUsers: Making API call with companyId:', companyId);
    const response = await axiosInstance.get<GetAllUsersResponse>(`/admin/getAllUsers/${companyId}`);
    
    console.log('getAllUsers: API response:', response.data);
    
    // Check for success and users array
    if (response.data && response.data.success && response.data.result && response.data.result.users) {
      // Filter only active users
      const activeUsers = response.data.result.users.filter(user => user.isActive === true);
      console.log('getAllUsers: Returning active users:', activeUsers);
      return activeUsers;
    }
    
    // Fallback to empty array if data structure is unexpected
    console.log('getAllUsers: Unexpected data structure, returning empty array');
    return [];
  } catch (error) {
    console.error('getAllUsers: Error fetching users:', error);
    throw error;
  }
}

// Get User by ID
export async function getUserById(userId: string, companyId: string): Promise<User> {
  const response = await axiosInstance.get<GetUserByIdResponse>(`/admin/getUserById/${userId}/${companyId}`);
  return response.data.result;
}

// Update User
export async function updateUser(userId: string, companyId: string, userData: UpdateUserRequest): Promise<User> {
  const response = await axiosInstance.put<UpdateUserResponse>(`/admin/updateUser/${userId}/${companyId}`, userData);
  return response.data.result;
}

// Toggle User Active Status
export async function toggleUserActive(userId: string, companyId: string): Promise<User> {
  const response = await axiosInstance.get<ToggleUserActiveResponse>(`/admin/toggleUserActive/${userId}/${companyId}`);
  return response.data.result;
}

// Delete User
export async function deleteUser(userId: string, companyId: string): Promise<void> {
  await axiosInstance.delete<DeleteUserResponse>(`/admin/deleteUser/${userId}/${companyId}`);
}

// Assign User to Manager
export async function assignUserToManager(data: AssignUserToManagerRequest): Promise<void> {
  await axiosInstance.post<AssignUserToManagerResponse>('/admin/assignUserToManager', data);
}

