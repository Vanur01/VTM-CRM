"use client";
import React, { useState } from "react";
import { useLeadsStore } from "@/stores/salesCrmStore/useLeadsStore";
import { useTasksStore } from "@/stores/salesCrmStore/useTasksStore";
import { useAuthStore } from "@/stores/salesCrmStore/useAuthStore";
import { useCallsStore } from "@/stores/salesCrmStore/useCallsStore";
import { useMeetingsStore } from "@/stores/salesCrmStore/useMeetingsStore";
import { useDealsStore } from "@/stores/salesCrmStore/useDealsStore";
import { usePathname } from "next/navigation";
import { Button, Checkbox, Collapse, FormControlLabel, TextField, MenuItem } from "@mui/material";
import FilterIcon from '@mui/icons-material/FilterList';

interface FilterValue {
  field: string;
  value: string;
}

interface LeadFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  companyName?: string;
  leadSource?: string;
  source?: string;
  leadStatus?: string;
  status?: string;
  priority?: string;
  temperature?: string;
  industry?: string;
  followUpDate?: string;
  searchText?: string;
  'address.city'?: string;
  'address.state'?: string;
  'address.street'?: string;
  'address.country'?: string;
  'address.postalCode'?: string;
  website?: string;
  title?: string;
  mobile?: string;
  leadOwner?: string;
  createdAt?: string;
  updatedAt?: string;
  convertedDate?: string;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  rating?: number;
  tags?: string[];
  isConverted?: boolean;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export default function FilterSidebar() {
  const pathname = usePathname();
  const { fetchLeads } = useLeadsStore();
  const { fetchTasksWithFilters } = useTasksStore();
  const { fetchAllCalls } = useCallsStore();
  const { fetchMeetings } = useMeetingsStore();
  const { setFilters: setDealsFilters, clearFilters: clearDealsFilters } = useDealsStore();
  const { user } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);
  const [filterByFieldsOpen, setFilterByFieldsOpen] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{
    fields: string[];
  }>({
    fields: [],
  });

  // New function to check if any filter is active
  const hasActiveFilters = (): boolean => {
    return (
      !!searchText ||
      selectedFilters.fields.length > 0 ||
      filterValues.some((filter) => !!filter.value)
    );
  };

  const handleToggle = () => {
    setFilterByFieldsOpen(!filterByFieldsOpen);
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) => {
      const wasSelected = prev.fields.includes(value);
      const updatedFields = wasSelected
        ? prev.fields.filter((item) => item !== value)
        : [...prev.fields, value];

      if (wasSelected) {
        setFilterValues((prev) => prev.filter((f) => f.field !== value));
      } else {
        setFilterValues((prev) => [...prev, { field: value, value: "" }]);
      }

      return { ...prev, fields: updatedFields };
    });
  };

  const handleFilterValueChange = (field: string, value: string) => {
    setFilterValues((prev) =>
      prev.map((f) => (f.field === field ? { ...f, value } : f))
    );
  };

  // Get the filter fields based on the current page
  const getFilterFields = () => {
    if (pathname.includes('/tasks')) {
      return [
        "Priority",
        "Status"
      ];
    }
    if (pathname.includes('/deals')) {
      return [
        "Industry",
        "Source",
        "Status",
        "Priority",
        "Temperature",
        "Follow Up Date",
        "Sort By",
        "Sort Order"
      ];
    }
    if (pathname.includes('/calls')) {
      return [
        "Call Type"
      ];
    }
    if (pathname.includes('/meetings')) {
      return [
        "Meeting Venue",
        "Status"
      ];
    }
    // Updated leads filter fields - only the specific ones you requested
    return [
      "Industry",
      "Source", 
      "Status",
      "Priority",
      "Temperature",
      "Follow Up Date",
      "Sort Order"
    ];
  };

  const getFilterValue = (field: string): string => {
    if (pathname.includes('/tasks')) {
      switch (field) {
        case "Priority":
          return "priority";
        case "Status":
          return "status";
        default:
          return field.toLowerCase();
      }
    }
    
    if (pathname.includes('/deals')) {
      switch (field) {
        case "Industry":
          return "industry";
        case "Source":
          return "source";
        case "Status":
          return "status";
        case "Priority":
          return "priority";
        case "Temperature":
          return "temperature";
        case "Follow Up Date":
          return "followUpDate";
        case "Sort By":
          return "sortBy";
        case "Sort Order":
          return "sortOrder";
        default:
          return field.toLowerCase();
      }
    }
    
    if (pathname.includes('/calls')) {
      switch (field) {
        case "Call Type":
          return "callType";
        default:
          return field.toLowerCase();
      }
    }

    if (pathname.includes('/meetings')) {
      switch (field) {
        case "Meeting Venue":
          return "meetingVenue";
        case "Status":
          return "status";
        default:
          return field.toLowerCase();
      }
    }
    
    // Updated mapping for leads - only the specific fields
    switch (field) {
      case "Industry":
        return "industry";
      case "Source":
        return "source";
      case "Status":
        return "status";
      case "Priority":
        return "priority";
      case "Temperature":
        return "temperature";
      case "Follow Up Date":
        return "followUpDate";
      case "Sort By":
        return "sortBy";
      case "Sort Order":
        return "sortOrder";
      default:
        return field.toLowerCase();
    }
  };

  const formatDateForApi = (dateStr: string, field: string): string => {
    const date = new Date(dateStr);
    
    // For createdAt and completionDate, send in MM/DD/YYYY format
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;  // Returns MM/DD/YYYY
  };

  const getFieldType = (field: string): string => {
    if (pathname.includes('/deals')) {
      if (['Follow Up Date'].includes(field)) {
        return 'date';
      }
    }
    
    // Updated field types for leads - only the specific fields
    if (['Follow Up Date'].includes(field)) {
      return 'date';
    }
    
    return 'text';
  };

  const applyFilters = () => {
    if (pathname.includes('/tasks')) {
      const filters: any = {
        page: 1,
        limit: 10
      };
      
      // Add search text for general search
      if (searchText) {
        filters.search = searchText;
      }

      // Add selected field filters with their values
      filterValues.forEach(({ field, value }) => {
        if (value) {
          const filterKey = getFilterValue(field);
          if (filterKey) {
            filters[filterKey] = value;
          }
        }
      });

      fetchTasksWithFilters(filters);
    } else if (pathname.includes('/deals')) {
      const filters: any = {};

      // Add search text if present
      if (searchText) {
        filters.searchText = searchText;
      }

      // Add selected field filters with their values
      filterValues.forEach(({ field, value }) => {
        if (value) {
          const filterKey = getFilterValue(field);
          if (filterKey) {
            // Handle date fields specially
            if (['followUpDate'].includes(filterKey)) {
              filters[filterKey] = formatDateForApi(value, field);
            } else {
              filters[filterKey] = value;
            }
          }
        }
      });

      setDealsFilters(filters);
    } else if (pathname.includes('/calls')) {
      const filters: any = {
        page: 1,
        limit: 10
      };
      
      // Add search text if present
      if (searchText) {
        filters.search = searchText;
      }

      // Add selected field filters with their values
      filterValues.forEach(({ field, value }) => {
        if (value) {
          const filterKey = getFilterValue(field);
          if (filterKey) {
            filters[filterKey] = value;
          }
        }
      });

      fetchAllCalls(filters);
    } else if (pathname.includes('/meetings')) {
      const filters: any = {
        page: 1,
        limit: 10
      };
      
      // Add companyId - required for meetings API
      if (!user?.companyId) {
        console.error('Company ID not found');
        return;
      }
      filters.companyId = user.companyId;
      
      // Add search text if present
      if (searchText) {
        filters.search = searchText;
      }

      // Add selected field filters with their values
      filterValues.forEach(({ field, value }) => {
        if (value) {
          const filterKey = getFilterValue(field);
          if (filterKey) {
            filters[filterKey] = value;
          }
        }
      });

      fetchMeetings(filters);
    } else {
      // Default leads/contacts filtering - updated for specific fields only
      const filters: any = {};

      if (searchText) {
        filters.searchText = searchText;
      }

      filterValues.forEach(({ field, value }) => {
        if (value) {
          const filterKey = getFilterValue(field);
          if (filterKey) {
            // Handle date fields
            if (['followUpDate'].includes(filterKey)) {
              filters[filterKey] = formatDateForApi(value, field);
            }
            // Handle string fields
            else {
              filters[filterKey] = value;
            }
          }
        }
      });

      if (!user?.companyId) {
        console.error('Company ID not found');
        return;
      }
      fetchLeads(user.companyId, filters);
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedFilters({
      fields: [],
    });
    setFilterValues([]);
    
    if (pathname.includes('/tasks')) {
      fetchTasksWithFilters({ page: 1, limit: 10 });
    } else if (pathname.includes('/deals')) {
      clearDealsFilters();
    } else if (pathname.includes('/calls')) {
      fetchAllCalls({ page: 1, limit: 10 });
    } else if (pathname.includes('/meetings')) {
      if (user?.companyId) {
        fetchMeetings({ page: 1, limit: 10, companyId: user.companyId });
      }
    } else {
      if (user?.companyId) {
        fetchLeads(user.companyId, {});
      }
    }
  };

  const sectionHeader =
    "flex items-center justify-between cursor-pointer py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200";

  const getFilterLabel = () => {
    if (pathname.includes("/tasks")) return "Filter Tasks";
    if (pathname.includes("/leads")) return "Filter Leads";
    if (pathname.includes("/contacts")) return "Filter Contacts";
    if (pathname.includes("/deals")) return "Filter Deals";
    if (pathname.includes("/accounts")) return "Filter Accounts";
    if (pathname.includes("/calls")) return "Filter Calls";
    if (pathname.includes("/meetings")) return "Filter Meetings";
    return "Filter"; // fallback
  };

  const getSearchPlaceholder = () => {
    if (pathname.includes("/tasks")) return "Search tasks...";
    if (pathname.includes("/calls")) return "Search calls...";
    if (pathname.includes("/meetings")) return "Search meetings...";
    if (pathname.includes("/deals")) return "Search deals...";
    return "Search leads..."; // fallback for leads/contacts
  };

  // Enum options for dropdowns based on backend models
  const LEAD_STATUS_OPTIONS = [
    "new",
    "contacted",
    "follow_up_scheduled",
    "interested",
    "qualified",
    "converted",
    "not_interested",
    "unreachable",
    "disqualified",
  ];

  const LEAD_STATUS_LABELS: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    follow_up_scheduled: "Follow Up Scheduled",
    interested: "Interested",
    qualified: "Qualified",
    converted: "Converted",
    not_interested: "Not Interested",
    unreachable: "Unreachable",
    disqualified: "Disqualified",
  };

  const LEAD_STATUS_SIMPLE_OPTIONS = ["Hot", "Warm", "Cold", "New"];
  const LEAD_STATUS_SIMPLE_LABELS: Record<string, string> = {
    Hot: "Hot",
    Warm: "Warm",
    Cold: "Cold",
    New: "New",
  };

  // Updated Task Status Options as requested
  const TASK_STATUS_OPTIONS = [
    "open",
    "progress", 
    "done",
    "cancel"
  ];

  const TASK_STATUS_LABELS: Record<string, string> = {
    open: "Open",
    progress: "Progress",
    done: "Done",
    cancel: "Cancel"
  };

  // Task Priority Options as requested
  const TASK_PRIORITY_OPTIONS = [
    "low",
    "medium", 
    "high",
    "urgent"
  ];

  const TASK_PRIORITY_LABELS: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent"
  };

  const DEAL_STAGE_OPTIONS = [
    "Qualification",
    "Needs Analysis",
    "Value Proposition",
    "Identify Decision Makers",
    "Proposal/Price Quote",
    "Negotiation/Review",
    "Closed Won",
    "Closed Lost",
  ];

  // Updated Call Type Options to match API
  const CALL_TYPE_OPTIONS = [
    "inbound",
    "outbound"
    ];

  const CALL_TYPE_LABELS: Record<string, string> = {
    inbound: "Incoming",
    outbound: "Outgoing"
  };

  // Updated Call Status Options to match API
  const CALL_STATUS_OPTIONS = [
    "scheduled",
    "completed",
    "missed",
    "cancelled"
  ];

  const CALL_STATUS_LABELS: Record<string, string> = {
    scheduled: "Scheduled",
    completed: "Completed", 
    missed: "Missed",
    cancelled: "Cancelled"
  };

  // Updated Meeting Status Options to match API
  const MEETING_STATUS_OPTIONS = [
    "scheduled",
    "completed",
    "missed",
    "cancelled",
    "rescheduled",
  ];

  const MEETING_STATUS_LABELS: Record<string, string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    missed: "Missed", 
    cancelled: "Cancelled",
    rescheduled: "Rescheduled"
  };


  
  // Updated Meeting Venue Options
  const MEETING_VENUE_OPTIONS = [
    "In-office",
    "Client location",
    "Online",
  ];

  // Updated Priority Options to match API
  const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];
  const PRIORITY_LABELS: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };
  
  const TEMPERATURE_OPTIONS = ["Hot", "Warm", "Cold"];
  const TEMPERATURE_LABELS: Record<string, string> = {
    Hot: "Hot",
    Warm: "Warm", 
    Cold: "Cold",
  };
  
  const INDUSTRY_OPTIONS = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Consulting",
    "Media",
    "Non-Profit",
    "Government",
    "IT",
    "Other"
  ];

  const SOURCE_OPTIONS = [
    "Website",
    "Social Media",
    "Email Campaign",
    "Cold Call",
    "Referral",
    "Event",
    "Advertisement",
    "Partner",
    "Other"
  ];
  
  const BOOLEAN_OPTIONS = ["true", "false"];
  const BOOLEAN_LABELS: Record<string, string> = {
    true: "Yes",
    false: "No",
  };

  const SORT_BY_OPTIONS = [
    "createdAt",
    "updatedAt",
    "firstName",
    "lastName",
    "companyName",
    "followUpDate",
    "priority"
  ];
  const SORT_BY_LABELS: Record<string, string> = {
    createdAt: "Created Date",
    updatedAt: "Updated Date",
    firstName: "First Name",
    lastName: "Last Name",
    companyName: "Company Name",
    followUpDate: "Follow Up Date",
    priority: "Priority",
  };

  const SORT_ORDER_OPTIONS = ["asc", "desc"];
  const SORT_ORDER_LABELS: Record<string, string> = {
    asc: "Ascending",
    desc: "Descending",
  };

  return (
    <div className="h-full max-w-70 overflow-y-auto py-4 ml-2 my-2 px-4 bg-white custom-scrollbar space-y-4 border-r border-gray-200">
      {/* Search Text Input - Now visible for all sections */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Search</label>
        <TextField
          size="small"
          fullWidth
          placeholder={getSearchPlaceholder()}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div>
        <div className={sectionHeader} onClick={handleToggle}>
          <div className="flex items-center gap-2">
            <FilterIcon fontSize="small" />
            {getFilterLabel()}
          </div>
          <span>{filterByFieldsOpen ? "−" : "+"}</span>
        </div>
        <Collapse in={filterByFieldsOpen}>
          <div className="space-y-1 pl-3 mt-2 max-h-96 overflow-y-auto custom-scrollbar">
            {getFilterFields().map((option) => (
              <div key={option} className="space-y-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedFilters.fields.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                  }
                  label={<span className="text-sm text-gray-700">{option}</span>}
                />
                {selectedFilters.fields.includes(option) && (
                  (() => {
                    // Determine if this field should be a dropdown and which options to use
                    let dropdownOptions: string[] | null = null;
                    let optionLabels: Record<string, string> | null = null;
                    
                    // Tasks filtering
                    if (pathname.includes('/tasks')) {
                      if (option === 'Status') {
                        dropdownOptions = TASK_STATUS_OPTIONS;
                        optionLabels = TASK_STATUS_LABELS;
                      } else if (option === 'Priority') {
                        dropdownOptions = TASK_PRIORITY_OPTIONS;
                        optionLabels = TASK_PRIORITY_LABELS;
                      }
                    }
                    // Calls filtering  
                    else if (pathname.includes('/calls')) {
                      if (option === 'Call Type') {
                        dropdownOptions = CALL_TYPE_OPTIONS;
                        optionLabels = CALL_TYPE_LABELS;
                      }
                    }
                    // Meetings filtering
                    else if (pathname.includes('/meetings')) {
                      if (option === 'Status') {
                        dropdownOptions = MEETING_STATUS_OPTIONS;
                        optionLabels = MEETING_STATUS_LABELS;
                      } else if (option === 'Meeting Venue') {
                        dropdownOptions = MEETING_VENUE_OPTIONS;
                      }
                    }
                    // Deals filtering
                    else if (pathname.includes('/deals')) {
                      if (option === 'Status') {
                        dropdownOptions = LEAD_STATUS_SIMPLE_OPTIONS;
                        optionLabels = LEAD_STATUS_SIMPLE_LABELS;
                      } else if (option === 'Priority') {
                        dropdownOptions = PRIORITY_OPTIONS;
                        optionLabels = PRIORITY_LABELS;
                      } else if (option === 'Temperature') {
                        dropdownOptions = TEMPERATURE_OPTIONS;
                        optionLabels = TEMPERATURE_LABELS;
                      } else if (option === 'Industry') {
                        dropdownOptions = INDUSTRY_OPTIONS;
                      } else if (option === 'Source') {
                        dropdownOptions = SOURCE_OPTIONS;
                      } else if (option === 'Sort By') {
                        dropdownOptions = SORT_BY_OPTIONS;
                        optionLabels = SORT_BY_LABELS;
                      } else if (option === 'Sort Order') {
                        dropdownOptions = SORT_ORDER_OPTIONS;
                        optionLabels = SORT_ORDER_LABELS;
                      } else if (option === 'Stage') {
                        dropdownOptions = DEAL_STAGE_OPTIONS;
                      }
                    }
                    // Leads/Contacts filtering
                    else if (pathname.includes('/leads') || pathname.includes('/contacts') || !pathname.includes('/')) {
                      if (option === 'Status') {
                        dropdownOptions = LEAD_STATUS_SIMPLE_OPTIONS;
                        optionLabels = LEAD_STATUS_SIMPLE_LABELS;
                      } else if (option === 'Priority') {
                        dropdownOptions = PRIORITY_OPTIONS;
                        optionLabels = PRIORITY_LABELS;
                      } else if (option === 'Temperature') {
                        dropdownOptions = TEMPERATURE_OPTIONS;
                        optionLabels = TEMPERATURE_LABELS;
                      } else if (option === 'Industry') {
                        dropdownOptions = INDUSTRY_OPTIONS;
                      } else if (option === 'Source') {
                        dropdownOptions = SOURCE_OPTIONS;
                      } else if (option === 'Sort By') {
                        dropdownOptions = SORT_BY_OPTIONS;
                        optionLabels = SORT_BY_LABELS;
                      } else if (option === 'Sort Order') {
                        dropdownOptions = SORT_ORDER_OPTIONS;
                        optionLabels = SORT_ORDER_LABELS;
                      }
                    }
                    
                    if (dropdownOptions) {
                      return (
                        <TextField
                          select
                          size="small"
                          fullWidth
                          value={filterValues.find((f) => f.field === option)?.value || ""}
                          onChange={(e) => handleFilterValueChange(option, e.target.value)}
                          className="ml-6 mb-2"
                        >
                          <MenuItem value="" disabled>
                            Select {option}
                          </MenuItem>
                          {dropdownOptions.map((val) => (
                            <MenuItem key={val} value={val}>
                              {optionLabels ? optionLabels[val] : val}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }
                    // fallback to text/date/number field
                    return (
                      <TextField
                        size="small"
                        fullWidth
                        type={getFieldType(option)}
                        placeholder={`Enter ${option.toLowerCase()}`}
                        value={filterValues.find((f) => f.field === option)?.value || ""}
                        onChange={(e) => handleFilterValueChange(option, e.target.value)}
                        inputProps={{
                          max: ['Follow Up Date', 'From Date Time', 'To Date Time'].includes(option) 
                            ? new Date().toISOString().split('T')[0] 
                            : undefined,
                        }}
                        className="ml-6 mb-2"
                      />
                    );
                  })()
                )}
              </div>
            ))}
          </div>
        </Collapse>
      </div>

      {hasActiveFilters() && (
        <div className="flex justify-between flex-wrap gap-3 mt-6">
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#0099F6", color: "white" }}
            onClick={applyFilters}
            className="w-full"
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}