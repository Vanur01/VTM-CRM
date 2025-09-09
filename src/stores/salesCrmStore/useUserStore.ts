import { create } from 'zustand';
import { User, AddUserOrManagerRequest, addUserOrManager, getUsersByManager, managerAddUser, getAllUsers, GetAllUsersResponse } from '@/api/userApi';

interface UserState {
  users: User[];
  allUsers: GetAllUsersResponse['result'];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsersByManager: (managerId: string) => Promise<void>;
  fetchAllUsers: (companyId: string) => Promise<void>;
  addUserOrManagerByAdmin: (companyId: string, userData: AddUserOrManagerRequest) => Promise<void>;
  addUserByManager: (companyId: string, userData: AddUserOrManagerRequest) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  clearError: () => void;
}

const useUserStore = create<UserState>((set, get) => ({
  users: [],
  allUsers: [],
  currentUser: null,
  loading: false,
  error: null,

  fetchUsersByManager: async (managerId: string) => {
    try {
      set({ loading: true, error: null });
      const users = await getUsersByManager(managerId);
      set({ users, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchAllUsers: async (companyId: string) => {
    try {
      set({ loading: true, error: null });
      const allUsers = await getAllUsers(companyId);
      set({ allUsers, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addUserOrManagerByAdmin: async (companyId: string, userData: AddUserOrManagerRequest) => {
    try {
      set({ loading: true, error: null });
      const newUser = await addUserOrManager(companyId, userData);
      set((state) => ({ users: [...state.users, newUser], loading: false }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addUserByManager: async (companyId: string, userData: AddUserOrManagerRequest) => {
    try {
      set({ loading: true, error: null });
      const newUser = await managerAddUser(companyId, userData);
      set((state) => ({ users: [...state.users, newUser], loading: false }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setCurrentUser: (user: User | null) => set({ currentUser: user }),
  clearError: () => set({ error: null }),
}));

export default useUserStore;
