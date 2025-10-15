import { create } from "zustand";
import {
  UserProfile,
  UpdateProfileRequest,
  getProfile,
  updateProfile as updateProfileAPI,
} from "@/api/profileApi";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface ProfileActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  clearError: () => void;
  setProfile: (profile: UserProfile | null) => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
  // State
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  // Actions
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getProfile();
      set({ 
        profile: response.result, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to fetch profile", 
        isLoading: false 
      });
    }
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await updateProfileAPI(data);
      set({ 
        profile: response.result, 
        isUpdating: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || "Failed to update profile", 
        isUpdating: false 
      });
      throw error; // Re-throw to handle in component
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setProfile: (profile: UserProfile | null) => {
    set({ profile });
  },
}));
