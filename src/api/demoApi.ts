// src/api/demoApi.ts
import axios from 'axios';

export interface BookDemoRequest {
  name: string;
  email: string;
  mobile: string;
  scheduledAt: string;
}

export interface BookDemoResponse {
  message: string;
  data: BookDemoRequest;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const bookDemo = async (data: BookDemoRequest): Promise<BookDemoResponse> => {
  try {
    const response = await api.post<BookDemoResponse>('/user/createBooking', data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};