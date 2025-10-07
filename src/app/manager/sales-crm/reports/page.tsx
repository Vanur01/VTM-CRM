"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ReportsNavbar from "@/components/sales-crm/ReportsNavbar";
import StatCard from "@/components/sales-crm/StatCard";
import { useReportsStore } from "@/stores/salesCrmStore/useReportsStore";
import { CircularProgress } from "@mui/material";


const ReportsPage = () => {
  const router = useRouter();
  const { managerReport, isLoading, error, fetchManagerReports } = useReportsStore();

  useEffect(() => {
    fetchManagerReports();
  }, [fetchManagerReports]);

  const hasTeamData = managerReport && managerReport.userReports && managerReport.userReports.length > 0;

  return (
    <>
      {/* <ReportsNavbar /> */}
      <div className="h-full overflow-y-auto px-4 py-4 rounded-xl custom-scrollbar space-y-6">
        {/* Manager Report Statistics */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <CircularProgress />
            <p className="ml-3 text-gray-600">Loading manager reports...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error loading reports: {error}</p>
            <button
              onClick={() => fetchManagerReports()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : hasTeamData ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
            <p className="text-gray-600 mb-4">Managing {managerReport!.userReports.length} team members</p>
            
            {/* Team Members Reports */}
            <div className="space-y-6">
              {managerReport!.userReports.map((userReport, index) => (
                <div key={userReport.userId} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800">{userReport.name}</h3>
                    <p className="text-sm text-gray-600">{userReport.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                      title="Total Leads"
                      value={userReport.leads.total}
                      bgColor="bg-blue-50"
                      textColor="text-blue-700"
                    />
                    <StatCard
                      title="Converted"
                      value={userReport.leads.converted}
                      bgColor="bg-green-50"
                      textColor="text-green-700"
                    />
                    <StatCard
                      title="Not Converted"
                      value={userReport.leads.notConverted}
                      bgColor="bg-yellow-50"
                      textColor="text-yellow-700"
                    />
                    <StatCard
                      title="Meetings"
                      value={userReport.meetings.total}
                      bgColor="bg-purple-50"
                      textColor="text-purple-700"
                    />
                    <StatCard
                      title="Calls"
                      value={userReport.calls.total}
                      bgColor="bg-indigo-50"
                      textColor="text-indigo-700"
                    />
                    <StatCard
                      title="Tasks"
                      value={userReport.tasks.total}
                      bgColor="bg-pink-50"
                      textColor="text-pink-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Data Available</h3>
              <p className="text-gray-500">You don't have any team members assigned yet, or your team members haven't started adding data. Assign users to your team to see their reports here.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
