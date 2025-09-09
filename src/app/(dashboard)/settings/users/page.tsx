'use client';

import { useState, useEffect, useRef } from 'react';
import ConfirmationDialog from '@/components/sales-crm/ConfirmationDialog';
import useUserStore from '@/stores/salesCrmStore/useUserStore';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';
import { ChevronLeft, ChevronRight, MoreHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export default function UsersPage() {
  const { users, allUsers, loading, error, fetchUsersByManager, fetchAllUsers, addUserOrManagerByAdmin, addUserByManager } = useUserStore();
  const { user: currentUser, company } = useAuthStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'user' as 'manager' | 'user',
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState<string | null>(null);
  const actionPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentUser?.companyId) {
      if (currentUser?.role === 'admin') {
        fetchAllUsers(currentUser.companyId);
      } else if (currentUser?.role === 'manager') {
        fetchUsersByManager(currentUser.companyId);
      }
    }
  }, [fetchAllUsers, fetchUsersByManager, currentUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionPopoverRef.current &&
        !actionPopoverRef.current.contains(event.target as Node)
      ) {
        setActionDropdownOpen(null);
      }
    }
    if (actionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionDropdownOpen]);

  console.log(currentUser?.role)

  const handleAddUser = async () => {
    try {
      if (currentUser?.role === 'admin' && currentUser?.companyId) {
        await addUserOrManagerByAdmin(currentUser.companyId, {
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          password: newUser.password,
          role: newUser.role
        });
      } else if (currentUser?.role === 'manager' && currentUser?.companyId) {
        await addUserByManager(currentUser.companyId, {
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          password: newUser.password,
          role: newUser.role
        });
      }
      
      
      // Refresh the users list
      if (currentUser?.companyId) {
        if (currentUser?.role === 'admin') {
          await fetchAllUsers(currentUser.companyId);
        } else if (currentUser?.role === 'manager') {
          await fetchUsersByManager(currentUser.companyId);
        }
      }
      
      setIsAddDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: 'user',
      });
      toast.success('User added successfully');
    } catch (e) {
      toast.error('Failed to add user');
    }
  };



  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // For now, we'll remove this functionality since it's not in the new API
    toast.info('Status toggle functionality will be available soon');
  };

  const handleDeleteClick = (userId: string) => {
    // For now, we'll remove this functionality since it's not in the new API
    toast.info('Delete functionality will be available soon');
  };

  const handleDeleteConfirm = async () => {
    // For now, we'll remove this functionality since it's not in the new API
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Determine which users to display based on role
  const displayUsers = currentUser?.role === 'admin' ? allUsers : users;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load users</h3>
          <p className="text-gray-500">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  if (!displayUsers || displayUsers.length === 0) {
    return (
      <div className="p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <div className="flex items-center gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add New User
            </button>
          </div>
        </div>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Get started by adding a new user.</p>
        </div>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New User</h2>
                <button 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter mobile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'manager' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    {currentUser?.role === 'admin' && <option value="manager">Manager</option>}
                  </select>
                </div>
                <button
                  onClick={handleAddUser}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', accessor: 'isActive' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const renderRow = (user: any, idx: number) => (
    <tr
      key={user._id}
      className="group hover:bg-gray-50/70 transition-colors duration-150"
    >
      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
      <td className="px-6 py-4 text-gray-700">{user.email}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'admin' 
            ? 'bg-indigo-100 text-indigo-800' 
            : user.role === 'manager' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 relative">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors group-hover:opacity-100"
              aria-label="Actions"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-0" align="end">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => handleToggleStatus(user._id, user.isActive)}
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => handleDeleteClick(user._id)}
            >
              Delete
            </button>
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <div className="flex items-center gap-4">
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Add New User
          </button>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="pb-2 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-2xl">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider first:rounded-tl-xl last:rounded-tr"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                displayUsers.map((user, idx) => renderRow(user, idx))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && displayUsers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Get started by adding a new user.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing page {currentPage} of users
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={displayUsers.length < itemsPerPage}
            className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add User Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button 
                onClick={() => setIsAddDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter mobile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'manager' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  {currentUser?.role === 'admin' && <option value="manager">Manager</option>}
                </select>
              </div>
              <button
                onClick={handleAddUser}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        show={isDeleteDialogOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        disableConfirm={loading}
      />
    </div>
  );
}