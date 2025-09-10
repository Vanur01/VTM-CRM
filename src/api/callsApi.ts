import axiosInstance from '@/utils/axios';

// Types
export interface Call {
  _id: string;
  callId: string;
  callOwner: {
    _id: string;
    email: string;
    name: string;
  } | string;
  companyId: string;
  leadId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    fullName: string;
    address: {
      full: string;
    };
    id: string;
  } | string;
  callType: "outbound" | "inbound";
  outgoingCallStatus: "scheduled" | "completed" | "missed" | "cancel";
  callStartTime: string;
  callPurpose: string;
  callAgenda: string;
  callResult: string | null;
  notes: string | null;
  description: string | null;
  reminder?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CallUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  fullName: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
  address: {
    full: string;
  };
  id: string;
}

export interface CallDeal {
  _id: string;
  dealName: string;
  amount: number;
  stage: string;
  probability: number;
  expectedRevenue: number;
  dealOwner: string;
  accountName: string;
  type: string;
  nextStep: string;
  leadSource: string;
  closingDate: string;
}

export interface CallCounts {
  tasks: number;
  calls: number;
  meetings: number;
}

export interface CallDetails {
  _id: string;
  callId: string;
  callOwner: {
    _id: string;
    email: string;
    name: string;
  };
  companyId: string;
  leadId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    fullName: string;
    address: {
      full: string;
    };
    id: string;
  };
  callType: "outbound" | "inbound";
  outgoingCallStatus: "scheduled" | "completed" | "missed" | "cancel";
  callStartTime: string;
  callPurpose: string;
  callAgenda: string;
  callResult: string | null;
  notes: string | null;
  description: string | null;
  reminder?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCallRequest {
  callType: "outbound" | "inbound";
  outgoingCallStatus: "scheduled" | "completed" | "missed" | "cancel";
  callStartTime: string;
  callPurpose: string;
  callAgenda: string;
  callResult?: string;
  notes?: string;
  description?: string;
  reminder?: boolean;
}

export interface UpdateCallRequest {
  callType?: "outbound" | "inbound";
  outgoingCallStatus?: "scheduled" | "completed" | "missed" | "cancel";
  callStartTime?: string;
  callPurpose?: string;
  callAgenda?: string;
  callResult?: string;
  notes?: string;
  description?: string;
  reminder?: boolean;
}

export interface CallsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    currentPage: number;
    totalPages: number;
    calls: Call[];
  };
}

export interface CallResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: CallDetails;
}

export interface CreateCallResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Call;
}

export interface BulkDeleteCallRequest {
  callIds: string[];
}

export interface CallFilters {
  page?: number;
  limit?: number;
  search?: string;
  callType?: "outgoing" | "incoming"; 
}

export interface AddNoteRequest {
  note: string;
}

export const getAllCalls = async (companyId: string, filters?: CallFilters): Promise<CallsResponse> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.callType) params.append('callType', filters.callType);
  
  const queryString = params.toString();
  const url = `/call/getAllCall/${companyId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getUserCalls = async (companyId: string, filters?: CallFilters): Promise<CallsResponse> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.callType) params.append('callType', filters.callType);
  
  const queryString = params.toString();
  const url = `/call/getUserCalls/${companyId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getCalls = async (companyId: string, filters?: CallFilters): Promise<CallsResponse> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.callType) params.append('callType', filters.callType);
  
  const queryString = params.toString();
  const url = `/call/getAllCall/${companyId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getCallById = async (callId: string): Promise<CallResponse> => {
  const response = await axiosInstance.get(`/call/getCallbById/${callId}`);
  return response.data;
};

export const createCall = async (leadId: string, companyId: string, callData: CreateCallRequest): Promise<CreateCallResponse> => {
  const response = await axiosInstance.post(`/call/addCall/${leadId}/${companyId}`, callData);
  return response.data;
};

export const updateCall = async (callId: string, callData: UpdateCallRequest): Promise<CreateCallResponse> => {
  const response = await axiosInstance.put(`/call/updateCall/${callId}`, callData);
  return response.data;
};

export const deleteCall = async (callId: string): Promise<{ success: boolean }> => {
  const response = await axiosInstance.delete(`/call/deleteCall/${callId}`);
  return { success: true };
};

export const bulkCallDelete = async (data: { callIds: string[] }): Promise<{ success: boolean }> => {
  const response = await axiosInstance.delete('/call/bulkDeleteCalls', { data });
  return { success: true };
};

export const getLeadForAllCalls = async (leadId: string, companyId: string, filters?: CallFilters): Promise<CallsResponse> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const queryString = params.toString();
  const url = `/call/getLeadForAllCalls/${leadId}/${companyId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getLeadForAllCloseCalls = async (leadId: string, companyId: string, filters?: CallFilters): Promise<CallsResponse> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const queryString = params.toString();
  const url = `/call/getLeadForAllCloseCalls/${leadId}/${companyId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await axiosInstance.get(url);
  return response.data;
};

export const addCallNote = async (callId: string, noteData: AddNoteRequest): Promise<{ data: Call }> => {
  const response = await axiosInstance.put(`/call/addNotes/${callId}`, noteData);
  return response.data;
};

export const rescheduleCall = async (callId: string, rescheduledDate: string): Promise<{ success: boolean; data: Call }> => {
  try {
    console.log('Rescheduling call with ID:', callId, 'to date:', rescheduledDate);
    const response = await axiosInstance.post(`/call/callRescheduled/${callId}`, {
      rescheduledDate
    });
    console.log('Reschedule call response:', response.data);
    return { success: true, data: response.data.result };
  } catch (error: any) {
    console.error('Reschedule call error:', error);
    console.error('Error response:', error.response);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while rescheduling call. Please try again.');
    } else if (error.response?.status === 404) {
      throw new Error('Call not found or may have already been rescheduled.');
    } else {
      throw new Error('Failed to reschedule call. Please check your connection and try again.');
    }
  }
};

export const completeOrCancelCall = async (callId: string, status: 'completed' | 'cancel'): Promise<{ success: boolean; data: Call }> => {
  try {
    console.log('Updating call status with ID:', callId, 'to status:', status);
    const response = await axiosInstance.patch(`/call/callCompleteOrCancel/${callId}/${status}`);
    console.log('Complete/Cancel call response:', response.data);
    return { success: true, data: response.data.result };
  } catch (error: any) {
    console.error('Complete/Cancel call error:', error);
    console.error('Error response:', error.response);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while updating call status. Please try again.');
    } else if (error.response?.status === 404) {
      throw new Error('Call not found or may have already been updated.');
    } else {
      throw new Error('Failed to update call status. Please check your connection and try again.');
    }
  }
};


