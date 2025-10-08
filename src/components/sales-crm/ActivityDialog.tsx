"use client";

import React, { useEffect } from "react";
import { useLeadsStore } from "@/stores/salesCrmStore/useLeadsStore";
import { useTasksStore } from "@/stores/salesCrmStore/useTasksStore";
import { useMeetingsStore } from "@/stores/salesCrmStore/useMeetingsStore";
import { useCallsStore } from "@/stores/salesCrmStore/useCallsStore";
import { useAuthStore } from "@/stores/salesCrmStore/useAuthStore";
import CallFormComponent, { CallFormData } from "./CallFormComponent";
import MeetingFormComponent, { MeetingFormData } from "./MeetingFormComponent";
import TaskFormComponent, { TaskFormData } from "./TaskFormComponent";


interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
  type: "Task" | "Meeting" | "Call" | null;
  leadId: string;
}

const ActivityDialog: React.FC<ActivityDialogProps> = ({ open, onClose, type, leadId }) => {
  const { isLoading, error } = useLeadsStore();
  const { addTask } = useTasksStore();
  const { addMeeting } = useMeetingsStore();
  const { addCall } = useCallsStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof document === "undefined") return;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const handleSubmit = async (data: CallFormData | MeetingFormData | TaskFormData) => {
    try {
      const companyId = user?.companyId;
      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Handle different types of submissions
      switch (type) {
        case "Task":
          if ('title' in data && 'priority' in data && 'status' in data) {
            await addTask(leadId, companyId, {
              title: data.title,
              description: data.description,
              priority: data.priority,
              status: data.status,
            });
          }
          break;
        case "Call":
          if ('callType' in data) {
            await addCall(leadId, {
              callType: data.callType,
              outgoingCallStatus: data.outgoingCallStatus,
              callStartTime: data.callStartTime,
              callPurpose: data.callPurpose,
              callAgenda: data.callAgenda,
              callResult: data.callResult,
              reminder: data.reminder,
              notes: data.notes,
              description: data.description
            });
          }
          break;
        case "Meeting":
          if ('meetingVenue' in data) {
            await addMeeting({
              leadId: leadId,
              companyId: companyId,
              meetingVenue: data.meetingVenue,
              location: data.location,
              allDay: data.allDay,
              fromDateTime: data.fromDateTime,
              toDateTime: data.toDateTime,
              host: data.host,
              title: data.title,
              status: data.status,
              participants: data.participants,
              participantsReminder: data.participantsReminder,
              notes: data.notes
            });
          }
          break;
      }
      onClose();
      window.location.reload(); // Reload the page after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (show error message, etc.)
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 bg-opacity-40 flex items-start justify-center pt-4 pb-4">
      <div className="bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg relative max-h-[90vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4 p-6 pb-0 flex-shrink-0">
          <h2 className="text-xl font-bold">Create New {type}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dynamic form based on activity type - Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-1">
          {type === "Call" && (
            <CallFormComponent 
              onSubmit={handleSubmit} 
              leadId={leadId} 
              companyId={user?.companyId || ''} 
            />
          )}
          {type === "Meeting" && (
            <MeetingFormComponent 
              onSubmit={handleSubmit} 
              leadId={leadId} 
              companyId={user?.companyId || ''} 
            />
          )}
          {type === "Task" && (
            <TaskFormComponent 
              onSubmit={handleSubmit} 
              leadId={leadId} 
              companyId={user?.companyId || ''} 
            />
          )}
        </div>
        </div>

      </div>
    </div>
  );
};

export default ActivityDialog;