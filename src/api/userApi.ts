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
  statusCode: number;
  status: string;
  message: string;
  data: {
    users: User[];
  };
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
    _id: string;
    email: string;
    name: string;
    role: string;
    company: string;
    isActive: boolean;
  }[];
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

// Add User or Manager by Admin
export async function addUserOrManager(companyId: string, userData: AddUserOrManagerRequest): Promise<User> {
  const response = await axiosInstance.post<AddUserOrManagerResponse>(`/admin/addUserOrManager/${companyId}`, userData);
  return response.data.data.user;
}

// Get Users by Manager
export async function getUsersByManager(managerId: string): Promise<User[]> {
  const response = await axiosInstance.get<GetUsersByManagerResponse>(`/admin/getUsersByManager/${managerId}`);
  return response.data.data.users;
}

// Manager Add User
export async function managerAddUser(companyId: string, userData: AddUserOrManagerRequest): Promise<User> {
  const response = await axiosInstance.post<AddUserOrManagerResponse>(`/admin/managerAddUser/${companyId}`, userData);
  return response.data.data.user;
}

// Get All Users by Company
export async function getAllUsers(companyId: string): Promise<GetAllUsersResponse['result']> {
  const response = await axiosInstance.get<GetAllUsersResponse>(`/admin/getAllUsers/${companyId}`);
  return response.data.result;
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

