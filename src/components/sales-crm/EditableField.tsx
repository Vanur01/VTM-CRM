'use client';

import React, { useState, useEffect } from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { updateLead } from '@/api/leadsApi';
import { useAuthStore } from '@/stores/salesCrmStore/useAuthStore';
import { toast } from 'sonner';

interface EditableFieldProps {
  label: string;
  value?: string | null;
  onSave: (newValue: string) => void;
  fieldName?: string;
  entityId?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value = '', 
  onSave,
  fieldName,
  entityId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const [showButtons, setShowButtons] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  // Reset temp value when the prop value changes
  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  // Check if value has changed
  useEffect(() => {
    if (isEditing) {
      setShowButtons(tempValue !== value);
    }
  }, [tempValue, value, isEditing]);

  const handleSave = async () => {
    if (!entityId || !fieldName || !user?.companyId) {
      console.error('Missing required data for updating lead:', { entityId, fieldName, companyId: user?.companyId });
      toast.error('Unable to update field. Missing required information.');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare the update data with the specific field
      const updateData = {
        [fieldName]: tempValue
      };

      // Call the updateLead API
      const response = await updateLead(entityId, updateData, user.companyId);
      
      if (response.success) {
        // Call the parent onSave function to update local state
        await onSave(tempValue);
        setIsEditing(false);
        setShowButtons(false);
        toast.success(`${label} updated successfully`);
      } else {
        throw new Error(response.message || 'Failed to update lead');
      }
    } catch (error: any) {
      console.error('Error updating lead field:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update field';
      toast.error(errorMessage);
      
      // Reset to original value on error
      setTempValue(value || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value || '');
    setIsEditing(false);
    setShowButtons(false);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      {isEditing ? (
        <>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400"
            placeholder={`Enter ${label}`}
          />

          {showButtons && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                  isSaving 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer"
                }`}
                title={isSaving ? "Saving..." : "Save"}
              >
                {isSaving ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <CheckRoundedIcon style={{ fontSize: 15 }} />
                )}
              </button>
              <button
                onClick={handleCancel}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                title="Cancel"
              >
                <ClearRoundedIcon style={{ fontSize: 15 }} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className="mt-1 px-4 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-blue-50 transition text-gray-700"
          onClick={() => setIsEditing(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsEditing(true);
            }
          }}
        >
          {value && value.trim() !== '' ? value : <span className="text-gray-400">-</span>}
        </div>
      )}
    </div>
  );
};

export default EditableField;