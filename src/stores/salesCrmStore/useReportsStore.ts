import { create } from "zustand";
import {
  UserReportData,
  AdminReportData,
  ManagerReportData,
  getUserReports,
  getAdminReports,
  getManagerReports,
} from "@/api/reportsApi";

interface ReportsState {
  userReport: UserReportData | null;
  adminReport: AdminReportData | null;
  managerReport: ManagerReportData | null;
  isLoading: boolean;
  error: string | null;
}

interface ReportsActions {
  fetchUserReports: () => Promise<void>;
  fetchAdminReports: (companyId: string) => Promise<void>;
  fetchManagerReports: () => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
}

const initialState: ReportsState = {
  userReport: null,
  adminReport: null,
  managerReport: null,
  isLoading: false,
  error: null,
};

export const useReportsStore = create<ReportsState & ReportsActions>(
  (set, get) => ({
    ...initialState,

    fetchUserReports: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await getUserReports();
        set({ userReport: data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch user reports",
          isLoading: false,
        });
      }
    },

    fetchAdminReports: async (companyId: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await getAdminReports(companyId);
        set({ adminReport: data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch admin reports",
          isLoading: false,
        });
      }
    },

    fetchManagerReports: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await getManagerReports();
        set({ managerReport: data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch manager reports",
          isLoading: false,
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },

    resetStore: () => {
      set(initialState);
    },
  })
);