import { create } from 'zustand';
import { getRecycleBin, restoreLeads, deleteLead, bulkDeleteLead, Lead } from '../../api/leadsApi';

interface RecycleBinStore {
  deletedLeads: Lead[];
  isLoading: boolean;
  error: string | null;
  totalLeads: number;
  currentPage: number;
  totalPages: number;
  fetchDeletedLeads: () => Promise<void>;
  restoreLead: (id: string) => Promise<void>;
  permanentlyDeleteLead: (id: string) => Promise<void>;
  bulkDeleteLeads: (leadIds: string[]) => Promise<void>;
  clearError: () => void;
}

export const useRecycleBinStore = create<RecycleBinStore>((set, get) => ({
  deletedLeads: [],
  isLoading: false,
  error: null,
  totalLeads: 0,
  currentPage: 1,
  totalPages: 1,

  clearError: () => set({ error: null }),

  fetchDeletedLeads: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getRecycleBin();
      console.log('Recycle Bin API Response:', response);
      
      if (response && response.success && response.result) {
        set({ 
          deletedLeads: response.result.leads || [],
          totalLeads: response.result.total || 0,
          currentPage: response.result.page || 1,
          totalPages: response.result.pages || 1,
          isLoading: false 
        });
      } else {
        console.error('Unexpected response structure:', response);
        set({ error: 'Invalid response structure from server', isLoading: false });
      }
    } catch (error: any) {
      console.error('Error fetching deleted leads:', error);
      set({ 
        error: error?.response?.data?.message || error?.message || 'Failed to fetch deleted leads', 
        isLoading: false 
      });
    }
  },

  restoreLead: async (id: string) => {
    try {
      set({ isLoading: true });
      await restoreLeads({ leadIds: [id] });
      
      // Remove the restored lead from the list
      set((state) => ({
        deletedLeads: state.deletedLeads.filter((lead) => lead._id !== id),
        totalLeads: Math.max(0, state.totalLeads - 1),
        isLoading: false,
      }));
      
      // Refresh the list to get updated data
      await get().fetchDeletedLeads();
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || error?.message || 'Failed to restore lead',
        isLoading: false 
      });
      throw error;
    }
  },

  permanentlyDeleteLead: async (id: string) => {
    try {
      set({ isLoading: true });
      
      // Find the lead to get company ID (assuming we need it for deletion)
      const lead = get().deletedLeads.find(l => l._id === id);
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      await deleteLead(id, lead.companyId || '');
      
      // Remove the deleted lead from the list
      set((state) => ({
        deletedLeads: state.deletedLeads.filter((lead) => lead._id !== id),
        totalLeads: Math.max(0, state.totalLeads - 1),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || error?.message || 'Failed to permanently delete lead',
        isLoading: false 
      });
      throw error;
    }
  },

  bulkDeleteLeads: async (leadIds: string[]) => {
    try {
      set({ isLoading: true });
      
      // Get company ID from the first lead (assuming all leads are from same company)
      const firstLead = get().deletedLeads.find(l => leadIds.includes(l._id));
      if (!firstLead) {
        throw new Error('No leads found to delete');
      }
      
      await bulkDeleteLead({ leadIds }, firstLead.companyId || '');
      
      // Remove the deleted leads from the list
      set((state) => ({
        deletedLeads: state.deletedLeads.filter((lead) => !leadIds.includes(lead._id)),
        totalLeads: Math.max(0, state.totalLeads - leadIds.length),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error?.response?.data?.message || error?.message || 'Failed to permanently delete leads',
        isLoading: false 
      });
      throw error;
    }
  },
}));