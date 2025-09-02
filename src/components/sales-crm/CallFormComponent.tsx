import React, { useState } from 'react';

interface CallFormComponentProps {
  onSubmit: (data: CallFormData) => void;
  leadId: string;
  companyId: string;
}

export interface CallFormData {
  callType: "outbound" | "inbound";
  outgoingCallStatus: "scheduled" | "completed" | "missed" | "cancel";
  callStartTime: string;
  callPurpose: string;
  callAgenda: string;
  callResult?: string;
  notes?: string;
  description?: string;
  reminder?: boolean;
}

const CALL_TYPES = ["outbound", "inbound"] as const;
const CALL_STATUSES = ["scheduled", "completed", "missed", "cancel"] as const;

const CallFormComponent: React.FC<CallFormComponentProps> = ({ onSubmit, leadId, companyId }) => {
  const [formData, setFormData] = useState<CallFormData>({
    callType: 'outbound',
    outgoingCallStatus: 'scheduled',
    callStartTime: '',
    callPurpose: '',
    callAgenda: '',
    callResult: '',
    notes: '',
    description: '',
    reminder: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(null); // Clear error when user makes changes
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.callPurpose.trim()) {
        throw new Error("Call purpose is required");
      }
      
      if (!formData.callAgenda.trim()) {
        throw new Error("Call agenda is required");
      }
      
      if (!formData.callStartTime) {
        throw new Error("Call start time is required");
      }
      
      if (!leadId) {
        throw new Error("Lead ID is required");
      }
      
      if (!companyId) {
        throw new Error("Company ID is required");
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to create call:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "An unexpected error occurred while creating the call"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white">
          <div className="px-1 py-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
                <select
                  name="callType"
                  value={formData.callType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  required
                >
                  {CALL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="outgoingCallStatus"
                  value={formData.outgoingCallStatus}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  required
                >
                  {CALL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Start Time</label>
                <input
                  type="datetime-local"
                  name="callStartTime"
                  value={formData.callStartTime}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Purpose</label>
                <input
                  type="text"
                  name="callPurpose"
                  value={formData.callPurpose}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="e.g. Follow-up on product demo"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Agenda</label>
                <textarea
                  name="callAgenda"
                  value={formData.callAgenda}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter the agenda for the call"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Result</label>
                <textarea
                  name="callResult"
                  value={formData.callResult || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter the result of the call (optional)"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Add any additional notes"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="reminder"
                    checked={formData.reminder || false}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Set Reminder
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-8 py-3 bg-indigo-600 text-white rounded-md font-medium shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed bg-indigo-500" : ""
          }`}
        >
          {isSubmitting ? "Scheduling Call..." : "Schedule Call"}
        </button>
      </form>
    </div>
  );
};

export default CallFormComponent;
