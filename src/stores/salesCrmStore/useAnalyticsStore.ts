import { create } from 'zustand';
import { getallanalytics, getUserAnalytics, UserAnalyticsData, AnalyticsData } from '@/api/analyticsApi';
import { useAuthStore } from './useAuthStore';

interface AnalyticsStore {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  userAnalytics: UserAnalyticsData | null;
  isUserAnalyticsLoading: boolean;
  userAnalyticsError: string | null;
  currentFilter: 'daily' | 'weekly' | 'monthly' | 'custom';
  dateRange: { from?: string; to?: string } | null;
  fetchAnalytics: (params?: { 
    filter?: 'daily' | 'weekly' | 'monthly' | 'custom';
    from?: string;
    to?: string;
  }) => Promise<void>;
  fetchUserAnalytics: () => Promise<void>;
  setFilter: (filter: 'daily' | 'weekly' | 'monthly' | 'custom') => void;
  setDateRange: (range: { from?: string; to?: string } | null) => void;
}

// User analytics in this store is fully typed and matches the backend response structure (see UserAnalyticsData in analyticsApi.ts)
// It is used in /user/analytics/page.tsx for the user analytics dashboard UI
const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  analytics: null,
  isLoading: false,
  error: null,
  userAnalytics: null,
  isUserAnalyticsLoading: false,
  userAnalyticsError: null,
  currentFilter: 'daily',
  dateRange: null,

  setFilter: (filter) => {
    set({ currentFilter: filter });
    if (filter !== 'custom') {
      set({ dateRange: null });
      get().fetchAnalytics({ filter });
    }
  },

  setDateRange: (range) => {
    set({ dateRange: range });
    if (range) {
      get().fetchAnalytics({
        filter: 'custom',
        from: range.from,
        to: range.to
      });
    }
  },

  fetchAnalytics: async (params) => {
    try {
      const { user } = useAuthStore.getState();
      const companyId = user?.companyId;
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const { currentFilter, dateRange } = get();
      set({ isLoading: true, error: null });
      
      const queryParams = {
        companyId,
        filter: params?.filter || currentFilter,
        ...(params?.from && params?.to ? { from: params.from, to: params.to } :
          dateRange && { from: dateRange.from, to: dateRange.to })
      };
      
      const data = await getallanalytics(queryParams);
      set({ analytics: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics', 
        isLoading: false 
      });
    }
  },

  fetchUserAnalytics: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user?.companyId) {
        throw new Error('Company ID not found');
      }

      set({ isUserAnalyticsLoading: true, userAnalyticsError: null });
      const response = await getUserAnalytics();
      set({ userAnalytics: response.data, isUserAnalyticsLoading: false });
    } catch (error) {
      set({
        userAnalyticsError: error instanceof Error ? error.message : 'Failed to fetch user analytics',
        isUserAnalyticsLoading: false
      });
    }
  },
}));

export default useAnalyticsStore;
