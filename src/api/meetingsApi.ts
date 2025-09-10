import axiosInstance from '@/utils/axios';

export interface Meeting {
  _id: string;
  id?: string;
  meetingId?: string;
  meetingOwner: {
    _id: string;
    email: string;
    name: string;
  } | string;
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
  companyId: string;
  title: string;
  meetingVenue: string;
  location: string;
  status: string;
  allDay: boolean;
  fromDateTime: string;
  toDateTime: string;
  host: string;
  notes: string | null;
  attachment: string[];
  attachments?: string[]; // For backward compatibility
  participants: string[];
  participantsReminder: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateMeetingRequest {
  meetingVenue: string;
  location: string;
  allDay: boolean;
  leadId?: string;  // Updated from lead to leadId based on backend model
  companyId?: string; // Added company ID
  fromDateTime: string;
  toDateTime: string;
  host: string;
  participants: string[];
  participantsReminder: boolean;
  title?: string; // Title field
  status?: string; // Added status field
  notes?: string | null; // Notes field
}

interface GetAllMeetingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    currentPage: number;
    totalPages: number;
    meetings: Meeting[];
  };
}

interface GetMeetingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    _id: string;
    meetingOwner: {
      _id: string;
      email: string;
      name: string;
    };
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
    companyId: string;
    title: string;
    meetingVenue: string;
    location: string;
    allDay: boolean;
    fromDateTime: string;
    toDateTime: string;
    host: string;
    status: string;
    notes: string | null;
    attachment: string[];
    participants: string[];
    participantsReminder: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface MeetingFilters {
  meetingVenue?: string;
  location?: string;
  host?: string;
  fromDate?: string;
  toDate?: string;
  status?: string; // Added status filter
  search?: string; // Added search parameter for general text search
  page?: number;
  limit?: number;
  companyId?: string;
  leadId?: string;
}

export interface AddNoteRequest {
  note: string;
}

export interface AddNoteResponse extends BaseResponse {
  data: {
    note: string;
  };
}

export interface UploadFileResponse extends BaseResponse {
  data: {
    fileName: string;
    fileUrl: string;
  };
}

export const createMeeting = async (data: CreateMeetingRequest): Promise<GetMeetingResponse> => {
  if (!data.leadId || !data.companyId) {
    throw new Error('Lead ID and Company ID are required');
  }
  const response = await axiosInstance.post<GetMeetingResponse>(
    `/meeting/createMeeting/${data.leadId}/${data.companyId}`, 
    data
  );
  return response.data;
};

export const getAllMeetings = async (filters?: MeetingFilters): Promise<GetAllMeetingsResponse> => {
  if (!filters?.companyId) {
    throw new Error('Company ID is required');
  }
  
  const queryParams = new URLSearchParams();
  
  if (filters) {
    // Handle pagination parameters
    if (filters.page) queryParams.append('page', String(filters.page));
    if (filters.limit) queryParams.append('limit', String(filters.limit));
    
    // Handle other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'companyId' && key !== 'page' && key !== 'limit') {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `/meeting/getAllMeetings/${filters.companyId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  try {
    const response = await axiosInstance.get<GetAllMeetingsResponse>(url);
    
    // Add debugging to see the actual response structure
    console.log("API Response:", response.data);
    
    // Format checking to ensure we have valid data
    if (!response.data) {
      console.error("Empty response from API");
    } else if (!response.data.result) {
      console.error("Missing result property in API response");
    } else if (!Array.isArray(response.data.result.meetings)) {
      console.error("result.meetings is not an array:", response.data.result.meetings);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in getAllMeetings:", error);
    throw error;
  }
};

export const getMeetingById = async (id: string): Promise<GetMeetingResponse> => {
  try {
    console.log(`Fetching meeting with ID: ${id}`);
    const response = await axiosInstance.get<GetMeetingResponse>(`/meeting/getMeetingById/${id}`);
    
    if (!response.data) {
      console.error("Empty response when fetching meeting details");
      throw new Error("Failed to fetch meeting details");
    }
    
    console.log("Meeting details fetched successfully:", response.data.message);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching meeting with ID ${id}:`, 
      error?.response?.status, 
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};

export const updateMeeting = async (id: string, data: CreateMeetingRequest): Promise<GetMeetingResponse> => {
  try {
    console.log(`Updating meeting with ID: ${id}, company ID: ${data.companyId}`);
    if (!data.companyId) {
      console.warn('Warning: No companyId provided for meeting update');
    }
    
    const response = await axiosInstance.put<GetMeetingResponse>(`/meeting/updateMeeting/${id}`, data);
    console.log("Meeting updated successfully:", response.data.message);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating meeting with ID ${id}:`,
      error?.response?.status,
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};

export const deleteMeeting = async (meetingId: string): Promise<BaseResponse> => {
  const response = await axiosInstance.delete<BaseResponse>(`/meeting/deleteMeeting/${meetingId}`);
  return response.data;
};

export const deleteAllMeetings = async (): Promise<BaseResponse> => {
  try {
    console.log('Sending request to delete all meetings...');
    const response = await axiosInstance.delete<BaseResponse>('/meeting/deleteAllMeetings');
    console.log('Delete all meetings API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in deleteAllMeetings API call:', error);
    throw error;
  }
};

export const bulkDeleteMeetings = async (meetingIds: string[]): Promise<BaseResponse> => {
  try {
    console.log('Sending request to bulk delete meetings:', meetingIds);
    const response = await axiosInstance.delete<BaseResponse>('/meeting/bulkDeleteMeetings', {
      data: { meetingIds }
    });
    console.log('Bulk delete meetings API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in bulkDeleteMeetings API call:', error);
    throw error;
  }
};

export const getUserMeetings = async (filters?: MeetingFilters): Promise<GetAllMeetingsResponse> => {
  if (!filters?.companyId) {
    throw new Error('Company ID is required');
  }
  
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.meetingVenue) queryParams.append('meetingVenue', filters.meetingVenue);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.host) queryParams.append('host', filters.host);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
  }

  const url = `/meeting/getUserMeetings/${filters.companyId}${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  try {
    const response = await axiosInstance.get<GetAllMeetingsResponse>(url);
    
    // Add debugging to see the actual response structure
    console.log("API Response:", response.data);
    
    // Format checking to ensure we have valid data
    if (!response.data) {
      console.error("Empty response from API");
    } else if (!response.data.result) {
      console.error("Missing result property in API response");
    } else if (!Array.isArray(response.data.result.meetings)) {
      console.error("result.meetings is not an array:", response.data.result.meetings);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in getUserMeetings:", error);
    throw error;
  }
};

export const getCloseLeadforMeetings = async (leadId: string, companyId: string, filters?: MeetingFilters): Promise<GetAllMeetingsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    // Handle pagination parameters
    if (filters.page) queryParams.append('page', String(filters.page));
    if (filters.limit) queryParams.append('limit', String(filters.limit));
    
    // Handle other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'leadId' && key !== 'companyId' && key !== 'page' && key !== 'limit' && value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `/meeting/getCloseLeadforMeetings/${leadId}/${companyId}${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;
  
  try {
    const response = await axiosInstance.get<GetAllMeetingsResponse>(url);
    console.log("Closed meetings API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching closed meetings:", error);
    throw error;
  }
};

export const addNote = async (meetingId: string, data: AddNoteRequest): Promise<AddNoteResponse> => {
  const response = await axiosInstance.put(`/meeting/addNotes/${meetingId}`, data);
  return response.data;
};

export const addNotes = async (meetingId: string, data: AddNoteRequest): Promise<AddNoteResponse> => {
  const response = await axiosInstance.post<AddNoteResponse>(`/meeting/addNotes/${meetingId}`, { note: data.note });
  return response.data;
};

export const uploadFile = async (meetingId: string, file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(`/meeting/uploadFile/${meetingId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const completedMeeting = async (meetingId: string): Promise<BaseResponse> => {
  try {
    console.log('Marking meeting as completed with ID:', meetingId);
    const response = await axiosInstance.patch<BaseResponse>(`/meeting/completedMeeting/${meetingId}`);
    console.log('Complete meeting response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Complete meeting error:', error);
    console.error('Error response:', error.response);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while completing meeting. Please try again.');
    } else if (error.response?.status === 404) {
      throw new Error('Meeting not found or may have already been completed.');
    } else {
      throw new Error('Failed to complete meeting. Please check your connection and try again.');
    }
  }
};
