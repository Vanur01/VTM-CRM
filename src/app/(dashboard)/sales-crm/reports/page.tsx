"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ReportsNavbar from "@/components/sales-crm/ReportsNavbar";
import StatCard from "@/components/sales-crm/StatCard";
import { useReportsStore } from "@/stores/salesCrmStore/useReportsStore";
import { useAuthStore } from "@/stores/salesCrmStore/useAuthStore";
import { CircularProgress } from "@mui/material";


const ReportsPage = () => {
  const router = useRouter();
  const { adminReport, isLoading, error, fetchAdminReports } = useReportsStore();
  const { company } = useAuthStore();

  useEffect(() => {
    if (company?._id) {
      fetchAdminReports(company._id);
    }
  }, [company?._id, fetchAdminReports]);



  return (
    <>
      {/* <ReportsNavbar /> */}
      <div className="h-full overflow-y-auto px-4 py-4 rounded-xl custom-scrollbar space-y-6">
        {/* Admin Report Statistics */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <CircularProgress />
            <p className="ml-3 text-gray-600">Loading admin reports...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error loading reports: {error}</p>
            <button
              onClick={() => company?._id && fetchAdminReports(company._id)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : adminReport ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Leads"
              value={adminReport.totalLeads}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              title="Converted Leads"
              value={adminReport.convertedLeads}
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <StatCard
              title="Not Converted Leads"
              value={adminReport.notConvertedLeads}
              bgColor="bg-yellow-50"
              textColor="text-yellow-700"
            />
            <StatCard
              title="Total Meetings"
              value={adminReport.totalMeetings}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
            <StatCard
              title="Total Calls"
              value={adminReport.totalCalls}
              bgColor="bg-indigo-50"
              textColor="text-indigo-700"
            />
            <StatCard
              title="Total Tasks"
              value={adminReport.totalTasks}
              bgColor="bg-pink-50"
              textColor="text-pink-700"
            />
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Data Available</h3>
              <p className="text-gray-500">Unable to load report data. Please try again.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
