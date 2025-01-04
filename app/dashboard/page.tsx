"use client";

import ChallengeSection from "@/components/dashboard/challengeSelection";
import Leaderboard from "@/components/dashboard/leaderboard";
import Navbar from "@/components/navbar";

export default function Dashboard() {
  return (
    <Navbar protectedRoute={true}>
      <div className="flex items-center flex-grow flex-wrap gap-6 justify-center m-4">
        <div className="flex flex-col gap-6">
          <ChallengeSection />
        </div>
        <Leaderboard />
      </div>
    </Navbar>
  );
}
