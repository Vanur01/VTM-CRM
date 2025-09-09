import { create } from 'zustand';
import { getUserDashboard } from '@/api/dashboardApi';

// New API Response Types
export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  followUpDate?: string;
  fullName: string;
  address: {
    full: string;
  };
  id: string;
  ownerId?: string;
  companyId?: string;
  company?: string | null;
  createdAt?: string;
}

export interface LeadsByStage {
  status: string;
  count: number;
  leads: Lead[];
}

export interface DashboardCall {
  _id: string;
  callOwner: string;
  companyId: string;
  leadId: string;
  callType: string;
  outgoingCallStatus: string;
  callStartTime: string;
  callPurpose: string;
  callAgenda: string;
  callResult: string | null;
  notes: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DashboardMeeting {
  _id: string;
  meetingOwner: string;
  leadId: string;
  companyId: string;
  title: string;
  meetingVenue: string;
  status: string;
  notes: string | null;
  attachment: string[];
  participants: string[];
  participantsReminder: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DashboardTask {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  completedAt: string | null;
  taskOwner: string;
  assign: string | null;
  leadId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DashboardActivities {
  calls: DashboardCall[];
  meetings: DashboardMeeting[];
  tasks: DashboardTask[];
}

export interface DashboardUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  isActive: boolean;
}

export interface DashboardCounts {
  totalLeads: number;
  calls: number;
  meetings: number;
  tasks: number;
  users: number;
  managers: number;
}

export interface NewDashboardData {
  followLeads: Lead[];
  leadsByStage: LeadsByStage[];
  convertedLeads: Lead[];
  activities: DashboardActivities;
  users: DashboardUser[];
  managers: DashboardUser[];
  counts: DashboardCounts;
}

// Legacy types for admin dashboard
interface DashboardStore {
  dashboardData: NewDashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: (companyId: string, startDate?: string, endDate?: string) => Promise<void>;
  exportDashboard: () => void;
}

interface DashboardStore {
  dashboardData: NewDashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: (companyId: string, startDate?: string, endDate?: string) => Promise<void>;
  exportDashboard: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,
  fetchDashboard: async (companyId: string, startDate?: string, endDate?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await getUserDashboard(companyId, startDate, endDate);
      set({ dashboardData: res.result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to fetch dashboard', loading: false });
    }
  },
  exportDashboard: () => {
    const { dashboardData } = get();
    if (!dashboardData) return;
    const json = JSON.stringify(dashboardData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));
