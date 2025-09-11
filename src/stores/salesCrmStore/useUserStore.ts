import { create } from 'zustand';
import { 
  User, 
  AddUserOrManagerRequest, 
  UpdateUserRequest,
  AssignUserToManagerRequest,
  addUserOrManager, 
  getUsersByManager, 
  managerAddUser, 
  getAllUsers, 
  getUserById,
  updateUser,
  toggleUserActive,
  deleteUser,
  assignUserToManager,
  GetAllUsersResponse 
} from '@/api/userApi';

interface UserState {
  users: User[];
  allUsers: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsersByManager: (managerId: string) => Promise<void>;
  fetchAllUsers: (companyId: string) => Promise<void>;
  getUserById: (userId: string, companyId: string) => Promise<User>;
  addUserOrManagerByAdmin: (companyId: string, userData: AddUserOrManagerRequest) => Promise<void>;
  addUserByManager: (companyId: string, userData: AddUserOrManagerRequest) => Promise<void>;
  updateUser: (userId: string, companyId: string, userData: UpdateUserRequest) => Promise<void>;
  toggleUserActive: (userId: string, companyId: string) => Promise<void>;
  deleteUser: (userId: string, companyId: string) => Promise<void>;
  assignUserToManager: (data: AssignUserToManagerRequest) => Promise<void>;
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
      console.log('Store: Starting fetchUsersByManager for managerId:', managerId);
      
      const users = await getUsersByManager(managerId);
      console.log('Store: Received users from API:', users);
      console.log('Store: Users array length:', users.length);
      
      // Ensure users is an array
      const validUsers = Array.isArray(users) ? users : [];
      console.log('Store: Setting users to:', validUsers);
      console.log('Store: Valid users length:', validUsers.length);
      
      set({ users: validUsers, loading: false });
      
      // Log final state
      console.log('Store: Final state set with users count:', validUsers.length);
    } catch (error) {
      console.error('Store: Error fetching users by manager:', error);
      set({ error: (error as Error).message || 'Unknown error occurred', loading: false });
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

  getUserById: async (userId: string, companyId: string) => {
    try {
      set({ loading: true, error: null });
      const user = await getUserById(userId, companyId);
      set({ currentUser: user, loading: false });
      return user;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateUser: async (userId: string, companyId: string, userData: UpdateUserRequest) => {
    try {
      set({ loading: true, error: null });
      const updatedUser = await updateUser(userId, companyId, userData);
      
      // Update in users array
      set((state) => ({
        users: state.users.map(user => 
          user._id === userId ? updatedUser : user
        ),
        allUsers: state.allUsers.map(user => 
          user._id === userId 
            ? { ...user, ...userData, _id: userId }
            : user
        ),
        currentUser: state.currentUser?._id === userId ? updatedUser : state.currentUser,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  toggleUserActive: async (userId: string, companyId: string) => {
    try {
      set({ loading: true, error: null });
      const updatedUser = await toggleUserActive(userId, companyId);
      
      // Update in users array
      set((state) => ({
        users: state.users.map(user => 
          user._id === userId ? updatedUser : user
        ),
        allUsers: state.allUsers.map(user => 
          user._id === userId 
            ? { ...user, isActive: updatedUser.isActive }
            : user
        ),
        currentUser: state.currentUser?._id === userId ? updatedUser : state.currentUser,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteUser: async (userId: string, companyId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteUser(userId, companyId);
      
      // Remove from users array
      set((state) => ({
        users: state.users.filter(user => user._id !== userId),
        allUsers: state.allUsers.filter(user => user._id !== userId),
        currentUser: state.currentUser?._id === userId ? null : state.currentUser,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  assignUserToManager: async (data: AssignUserToManagerRequest) => {
    try {
      set({ loading: true, error: null });
      await assignUserToManager(data);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  setCurrentUser: (user: User | null) => set({ currentUser: user }),
  clearError: () => set({ error: null }),
}));

export default useUserStore;
