import React, { useState } from "react";

interface MeetingFormComponentProps {
  onSubmit: (data: MeetingFormData) => void;
  leadId: string;
  companyId: string;
}

export interface MeetingFormData {
  meetingVenue: string;
  location: string;
  allDay: boolean;
  title: string;
  status: string;
  fromDateTime: string;
  toDateTime: string;
  host: string;
  notes?: string;
  participants: string[];
  participantsReminder: boolean;
}

const MEETING_VENUES = ["In-office", "Client location", "Online"] as const;
const MEETING_STATUSES = ["scheduled", "completed", "missed", "cancel", "rescheduled"] as const;

const MeetingFormComponent: React.FC<MeetingFormComponentProps> = ({
  onSubmit,
  leadId,
  companyId,
}) => {
  const [formData, setFormData] = useState<MeetingFormData>({
    meetingVenue: "In-office",
    location: "",
    allDay: false,
    title: "",
    status: "scheduled",
    fromDateTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)).toISOString().slice(0, 16),
    toDateTime: new Date(new Date().setHours(new Date().getHours() + 2, 0, 0, 0)).toISOString().slice(0, 16),
    host: "",
    notes: "",
    participants: [],
    participantsReminder: true,
  });
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantInput, setParticipantInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setError(null); // Clear error when user makes changes
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddParticipant = (event?: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event && event.key === 'Enter') || !event) {
      if (event) event.preventDefault();
      
      const emailToAdd = participantInput.trim();
      if (emailToAdd === '') return;
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToAdd)) {
        setError("Please enter a valid email address");
        return;
      }
      
      if (participants.includes(emailToAdd)) {
        setError("This participant is already added");
        return;
      }
      
      const updatedParticipants = [...participants, emailToAdd];
      setParticipants(updatedParticipants);
      setFormData(prev => ({
        ...prev,
        participants: updatedParticipants
      }));
      setParticipantInput('');
      setError(null); // Clear any existing errors
    }
  };

  const handleDeleteParticipant = (participantToDelete: string) => {
    const updatedParticipants = participants.filter(
      participant => participant !== participantToDelete
    );
    setParticipants(updatedParticipants);
    setFormData(prev => ({
      ...prev,
      participants: updatedParticipants
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Meeting title is required");
      }
      
      if (!formData.location.trim()) {
        throw new Error("Meeting location is required");
      }
      
      if (!formData.host || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.host)) {
        throw new Error("Please enter a valid host email address");
      }
      
      if (!formData.fromDateTime) {
        throw new Error("From date and time is required");
      }
      
      if (!formData.toDateTime) {
        throw new Error("To date and time is required");
      }
      
      if (!leadId) {
        throw new Error("Lead ID is required");
      }
      
      if (!companyId) {
        throw new Error("Company ID is required");
      }

      // Convert datetime-local values to ISO strings
      const meetingDataToSubmit = {
        ...formData,
        fromDateTime: new Date(formData.fromDateTime).toISOString(),
        toDateTime: new Date(formData.toDateTime).toISOString(),
      };
      
      await onSubmit(meetingDataToSubmit);
    } catch (error) {
      console.error("Failed to create meeting:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "An unexpected error occurred while creating the meeting"
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
        {/* Meeting Details Section */}
        <div className="bg-white">
          {/* <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Meeting Details</h3>
          </div> */}
          <div className="px-1 py-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter meeting title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Venue
                </label>
                <select
                  name="meetingVenue"
                  value={formData.meetingVenue}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  required
                >
                  {MEETING_VENUES.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter specific location e.g., ABC Corp Office"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {MEETING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="fromDateTime"
                  value={formData.fromDateTime}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="toDateTime"
                  value={formData.toDateTime}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host Email
                </label>
                <input
                  type="email"
                  name="host"
                  value={formData.host}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter host email"
                  required
                />
              </div>

              <div >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Participants
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={participantInput}
                        onChange={(e) => setParticipantInput(e.target.value)}
                        onKeyDown={handleAddParticipant}
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter participant email"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddParticipant()}
                      disabled={isSubmitting || !participantInput.trim()}
                      className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                        isSubmitting || !participantInput.trim() 
                          ? "opacity-50 cursor-not-allowed bg-indigo-400" 
                          : ""
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Instructions */}
                  {/* <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Press Enter or click the + button to add participants</span>
                  </div> */}
                </div>
              </div>

              {/* Display participants */}
              {participants.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Participants ({participants.length})
                  </label>
                    <div className="flex flex-wrap gap-2">
                      {participants.map((participant, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                        >
                          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                          <span className="truncate max-w-[200px]">{participant}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteParticipant(participant)}
                            disabled={isSubmitting}
                            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none focus:bg-indigo-200 focus:text-indigo-600 transition-colors"
                            title="Remove participant"
                          >
                            <span className="sr-only">Remove {participant}</span>
                            <svg className="w-2.5 h-2.5" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6-6 6" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* {participants.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Total participants: {participants.length}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setParticipants([]);
                              setFormData(prev => ({ ...prev, participants: [] }));
                            }}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Clear all
                          </button>
                        </div>
                      </div>
                    )} */}
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  placeholder="Add any additional notes for the meeting"
                />
              </div>

              <div className="col-span-2 flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allDay"
                    checked={formData.allDay}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    All Day Meeting
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="participantsReminder"
                    checked={formData.participantsReminder}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Send Participant Reminders
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-8 py-3 bg-indigo-600 text-white rounded-md font-medium  hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed bg-indigo-500" : ""
          }`}
        >
          {isSubmitting ? "Creating Meeting..." : "Create Meeting"}
        </button>
      </form>
    </div>
  );
};

export default MeetingFormComponent;
