"use client";

import { useEffect, useState } from "react";
import Table from "@/components/sales-crm/Table";
import ConfirmationDialog from "@/components/sales-crm/ConfirmationDialog";
import { MoreHorizontal, RefreshCw, RotateCcw, Trash2, AlertCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { useRecycleBinStore } from "@/stores/salesCrmStore/userecyclebinStore";
import { toast } from "sonner";

export default function RecycleBinPage() {
  const { 
    deletedLeads, 
    isLoading, 
    error, 
    totalLeads,
    fetchDeletedLeads, 
    restoreLead, 
    permanentlyDeleteLead, 
    bulkDeleteLeads, 
    clearError 
  } = useRecycleBinStore();
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkRestoring, setIsBulkRestoring] = useState(false);

  useEffect(() => {
    fetchDeletedLeads();
  }, [fetchDeletedLeads]);

  // Clear error when component mounts or when error changes
  useEffect(() => {
    if (error && deletedLeads.length > 0) {
      // If we have data but also have an error, clear the error
      clearError();
    }
  }, [error, deletedLeads.length, clearError]);

  const handleRestore = async (id: string) => {
    try {
      setIsRestoring(true);
      await restoreLead(id);
      toast.success("Lead restored successfully");
    } catch (error) {
      toast.error("Failed to restore lead");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to restore");
      return;
    }

    try {
      setIsBulkRestoring(true);
      await Promise.all(selectedLeads.map(id => restoreLead(id)));
      toast.success("Leads restored successfully");
      setSelectedLeads([]);
    } catch (error) {
      toast.error("Failed to restore leads");
    } finally {
      setIsBulkRestoring(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await permanentlyDeleteLead(id);
      toast.success("Lead permanently deleted");
      setLeadToDelete(null);
    } catch (error) {
      toast.error("Failed to permanently delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to delete");
      return;
    }

    try {
      setIsBulkDeleting(true);
      await bulkDeleteLeads(selectedLeads);
      toast.success("Leads permanently deleted");
      setSelectedLeads([]);
    } catch (error) {
      toast.error("Failed to permanently delete leads");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === deletedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(deletedLeads.map(lead => lead._id));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const renderErrorState = () => (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Unable to Load Recycle Bin</h2>
          <p className="text-gray-600 max-w-md">
            We're having trouble loading the recycle bin. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => {
              clearError();
              fetchDeletedLeads();
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className=" flex flex-col items-center justify-center text-gray-500 space-y-2 mt-20">
      <p className="text-lg">No deleted leads found</p>
      <p className="text-sm">Deleted leads will appear here for 60 days before being permanently removed.</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="h-24 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-gray-500" />
        <span className="text-gray-500">Loading deleted leads...</span>
      </div>
    </div>
  );

  if (error && !isLoading && deletedLeads.length === 0) {
    return renderErrorState();
  }
  if (!isLoading && !error && deletedLeads.length === 0) {
    return renderEmptyState();
  }

  const columns = [
    { 
      header: (
        <input
          type="checkbox"
          checked={selectedLeads.length === deletedLeads.length && deletedLeads.length > 0}
          onChange={toggleSelectAll}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          aria-label="Select all leads"
        />
      ), 
      accessor: 'select' 
    },
    { header: 'Name', accessor: 'name' },
    { header: 'Company', accessor: 'company' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Status', accessor: 'status' },
    { header: 'Source', accessor: 'source' },
    { header: 'Deleted At', accessor: 'deletedAt' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const renderRow = (lead: any) => (
    <tr key={lead._id} className="border-b hover:bg-gray-50">
      <td className="p-2">
        <input
          type="checkbox"
          checked={selectedLeads.includes(lead._id)}
          onChange={() => toggleSelectLead(lead._id)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          aria-label={`Select ${lead.firstName} ${lead.lastName}`}
        />
      </td>
      <td className="p-2 font-medium">
        <div className="flex flex-col">
          <span>{lead.firstName} {lead.lastName}</span>
          {lead.title && <span className="text-sm text-gray-500">{lead.title}</span>}
        </div>
      </td>
      <td className="p-2">{lead.companyName || lead.company || 'N/A'}</td>
      <td className="p-2">
        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
          {lead.email}
        </a>
      </td>
      <td className="p-2">
        <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
          {lead.phone}
        </a>
      </td>
      <td className="p-2">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          lead.status === 'New' ? 'bg-green-100 text-green-800' :
          lead.status === 'Qualified' ? 'bg-blue-100 text-blue-800' :
          lead.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
          lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {lead.status}
        </span>
      </td>
      <td className="p-2">
        <span className="text-sm text-gray-600">{lead.source || 'N/A'}</span>
      </td>
      <td className="p-2 text-sm text-gray-600">
        {format(new Date(lead.updatedAt), "MMM dd, yyyy HH:mm")}
      </td>
      <td className="p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => handleRestore(lead._id)}
            disabled={isRestoring}
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
            title="Restore lead"
          >
            <RotateCcw className={`h-4 w-4 ${isRestoring ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setLeadToDelete(lead._id)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Permanently delete lead"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto py-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-2">Recycle Bin</h1>
          <div className="space-y-2 text-gray-600">
            <p>
              The Recycle Bin displays all the leads that have been deleted in your Caishen CRM account.
            </p>
            <p>
              After leads are deleted, they will be stored in the Recycle Bin for 60 days. After that, they will be deleted permanently.
            </p>
            <p>
              Only users with an administrator profile can delete records in the Recycle Bin.
            </p>
            <p>
              Non-admin users can restore their own records from the Recycle Bin. Depending on their permissions, they may also be able to restore other users' records as well.
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Section */}
          {!isLoading && deletedLeads.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Circle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Total Deleted Leads: {totalLeads}
                    </span>
                  </div>
                  {selectedLeads.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Circle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">
                        Selected: {selectedLeads.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={handleBulkRestore}
                disabled={isBulkRestoring || selectedLeads.length === 0}
                className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${isBulkRestoring ? 'animate-spin' : ''}`} />
                Restore Selected ({selectedLeads.length})
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting || selectedLeads.length === 0}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className={`h-4 w-4 mr-2 ${isBulkDeleting ? 'animate-spin' : ''}`} />
                Delete Selected ({selectedLeads.length})
              </button>
            </div>
            <button
              onClick={() => {
                clearError();
                fetchDeletedLeads();
              }}
              disabled={isLoading}
              className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="rounded-md border">
            {isLoading ? (
              renderLoadingState()
            ) : deletedLeads.length === 0 ? (
              renderEmptyState()
            ) : (
              <Table
                columns={columns}
                data={deletedLeads}
                renderRow={renderRow}
              />
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        show={!!leadToDelete}
        title="Are you absolutely sure?"
        message={
          <div className="space-y-2">
            <p>This action cannot be undone. This will permanently delete the lead and remove it from our servers.</p>
            {leadToDelete && (
              <div className="p-3 bg-red-50 rounded-md">
                <p className="text-sm text-red-800">
                  Lead: <strong>{deletedLeads.find(l => l._id === leadToDelete)?.firstName} {deletedLeads.find(l => l._id === leadToDelete)?.lastName}</strong>
                </p>
                <p className="text-xs text-red-600">
                  Email: {deletedLeads.find(l => l._id === leadToDelete)?.email}
                </p>
              </div>
            )}
          </div>
        }
        onConfirm={() => leadToDelete && handlePermanentDelete(leadToDelete)}
        onCancel={() => setLeadToDelete(null)}
        confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
        cancelText="Cancel"
        type="danger"
        disableConfirm={isDeleting}
      />
    </div>
  );
}
