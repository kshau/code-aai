"use client";

import DashboardChallenges from "@/components/dashboard/DashboardChallenges";
import DashboardLeaderboard from "@/components/dashboard/DashboardLeaderboard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Navbar from "@/components/navbar/Navbar";

export default function Dashboard() {
  return (
    <Navbar className="flex justify-center items-center" protectedRoute>
      <div className="flex justify-center gap-4 flex-wrap h-[80vh]">
        <div className="flex flex-col gap-4">
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
