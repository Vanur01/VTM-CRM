import { create } from "zustand";
import {
  UserProfile,
  UpdateProfileRequest,
  getManagerById,
  updateManagerProfile as updateManagerProfileAPI,
} from "@/api/profileApi";

interface ManagerProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  managerId: string | null;
  companyId: string | null;
}

interface ManagerProfileActions {
  fetchManagerProfile: (managerId: string, companyId: string) => Promise<void>;
  updateManagerProfile: (data: UpdateProfileRequest) => Promise<void>;
  clearError: () => void;
  setManagerProfile: (profile: UserProfile | null) => void;
  setManagerIds: (managerId: string, companyId: string) => void;
}

export const useManagerProfileStore = create<ManagerProfileState & ManagerProfileActions>((set, get) => ({
  // State
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  managerId: null,
  companyId: null,

  // Actions
  setManagerIds: (managerId: string, companyId: string) => {
    set({ managerId, companyId });
  },

  fetchManagerProfile: async (managerId: string, companyId: string) => {
    set({ isLoading: true, error: null, managerId, companyId });
    try {
      const response = await getManagerById(managerId, companyId);
      set({ 
        profile: response.result, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch manager profile", 
        isLoading: false 
      });
    }
  },

  updateManagerProfile: async (data: UpdateProfileRequest) => {
    const { managerId, companyId } = get();
    if (!managerId || !companyId) {
      set({ error: "Manager ID and Company ID are required" });
      throw new Error("Manager ID and Company ID are required");
    }

    set({ isUpdating: true, error: null });
    try {
      const response = await updateManagerProfileAPI(managerId, companyId, data);
      set({ 
        profile: response.result, 
        isUpdating: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to update manager profile", 
        isUpdating: false 
      });
      throw error; // Re-throw to handle in component
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setManagerProfile: (profile: UserProfile | null) => {
    set({ profile });
  },
}));