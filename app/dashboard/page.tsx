"use client";

import ChallengeSection from "@/components/dashboard/challengeSelection";
import Leaderboard from "@/components/dashboard/leaderboard";
import ProfileStatistics from "@/components/dashboard/profileStatistics";
import Navbar from "@/components/navbar";

export default function Dashboard() {
  return (
    <Navbar className="flex justify-center items-center">
      <div className="flex justify-center items-center gap-4 h-[80vh]">
        <div className="flex flex-col gap-4  h-full">
          <ProfileStatistics />
          <ChallengeSection />
        </div>
        <div className="flex flex-col flex-grow h-full">
          <Leaderboard />
        </div>
      </div>
    </Navbar>
  );
}
