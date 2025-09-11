import { useEffect, useState } from 'react';
import { getAllUsers } from '@/api/userApi';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';
import useUserStore from '@/stores/salesCrmStore/useUserStore';

interface AssignUsersToManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (userEmails: string[]) => Promise<void>;
  managerId: string;
  managerName: string;
}

export default function AssignUsersToManagerDialog({ 
  isOpen, 
  onClose, 
  onAssign, 
  managerId,
  managerName 
}: AssignUsersToManagerDialogProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigning, setAssigning] = useState(false);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (isOpen && managerId) {
      console.log('AssignUsersToManagerDialog: Dialog opened for manager:', managerId, managerName);
      fetchUsers();
    }
  }, [isOpen, managerId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('AssignUsersToManagerDialog: Fetching users for admin with companyId:', currentUser?.companyId);
      
      if (currentUser?.companyId && currentUser?.role === 'admin') {
        const allUsersData = await getAllUsers(currentUser.companyId);
        // Filter to only include active users with role 'user' (exclude managers and admins)
        const availableUsers = allUsersData.filter(user => 
          user.role === 'user' && 
          user.isActive === true &&
          user._id !== managerId // Don't include the manager being assigned to
        );
        
        console.log('AssignUsersToManagerDialog: getAllUsers returned:', allUsersData.length, 'total users,', availableUsers.length, 'available users');
        setUsers(availableUsers);
      } else {
        console.warn('AssignUsersToManagerDialog: User is not admin or no companyId found');
        setUsers([]);
      }
    } catch (error) {
      console.error('AssignUsersToManagerDialog: Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (user: any) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u._id === user._id);
      if (isSelected) {
        return prev.filter(u => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredUsers]);
    }
  };

  const handleAssign = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to assign');
      return;
    }
    
    try {
      setAssigning(true);
      setError(null);
      
      const userEmails = selectedUsers.map(user => user.email);
      console.log('AssignUsersToManagerDialog: Assigning users to manager:', managerId, 'emails:', userEmails);
      
      await onAssign(userEmails);
      onClose();
      setSelectedUsers([]);
    } catch (error) {
      console.error('AssignUsersToManagerDialog: Error assigning users:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign users to manager');
    } finally {
      setAssigning(false);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user && 
    user.name &&
    user.email &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Assign Users to Manager: {managerName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Select active users to assign to this manager
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {filteredUsers.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedUsers.length} of {filteredUsers.length} users selected
              </div>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md overflow-hidden max-h-96 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some(u => u._id === user._id);
                  return (
                    <div
                      key={user._id}
                      className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleUserToggle(user)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleUserToggle(user)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.name || 'User'}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            (user.name && user.name[0] ? user.name[0].toUpperCase() : '?')
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-800">{user.name || 'Unknown User'}</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                          {user.mobile && (
                            <p className="text-xs text-gray-400">{user.mobile}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No available users found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "Try a different search term"
                      : "No active users with 'user' role available for assignment"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedUsers.length > 0 && (
              <>Selected: {selectedUsers.map(u => u.name).join(', ')}</>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={assigning}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={selectedUsers.length === 0 || assigning}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer ${
                assigning ? 'bg-blue-400 hover:bg-blue-400' : ''
              }`}
            >
              {assigning ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Assigning...
                </span>
              ) : (
                `Assign ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
