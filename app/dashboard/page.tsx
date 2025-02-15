"use client";

import DashboardChallenges from "@/components/dashboard/DashboardChallenges";
import DashboardLeaderboard from "@/components/dashboard/DashboardLeaderboard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Navbar from "@/components/navbar/Navbar";

export default function Dashboard() {
  return (
    <Navbar className="flex justify-center items-center px-2" protectedRoute>
      <div className="flex justify-center gap-4 flex-wrap h-[80vh] p-8">
        <div className="flex flex-col gap-4 lg:m-0 m-4">
          <DashboardCharts />
          <DashboardChallenges />
        </div>
        <div className="w-fit">
          <DashboardLeaderboard />
        </div>
      </div>
    </Navbar>
  );
}
