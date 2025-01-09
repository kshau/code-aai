"use client";

import ChallengeSection from "@/components/dashboard/challengeSelection";
import Leaderboard from "@/components/dashboard/leaderboard";
import ProfileStatistics from "@/components/dashboard/profileStatistics";
import Navbar from "@/components/navbar/navbar";

export default function Dashboard() {
  return (
    <Navbar className="flex justify-center items-center" protectedRoute={true}>
      <div className="flex justify-center gap-4 flex-wrap h-[80vh] p-2">
        <div className="flex flex-col gap-4">
          <ProfileStatistics />
          <ChallengeSection />
        </div>
        <div className="w-fit">
          <Leaderboard />
        </div>
      </div>
    </Navbar>
  );
}
