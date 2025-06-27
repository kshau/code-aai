"use client";

import DashboardChallenges from "@/components/dashboard/DashboardChallenges";
import DashboardLeaderboard from "@/components/dashboard/DashboardLeaderboard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { sendEmailVerification } from "firebase/auth";
import { LoadingPage } from "@/components/loading";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await sendEmailVerification(user!);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setMessage("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (<LoadingPage />)
  }
  return (
    <Navbar className="flex justify-center items-center px-2" protectedRoute>
      <div className="flex justify-center gap-4 flex-wrap h-[80vh] p-8">
        <div className="flex flex-col gap-4 lg:m-0 m-4">
          {user && user?.emailVerified ? (
            <>
              <DashboardCharts />
              <DashboardChallenges />
            </>
          ) : (
            <Card className="h-full w-[50vw] flex flex-col items-center justify-center text-center p-8 bg-blue-50 border border-blue-300">
              <h2 className="text-xl font-semibold">Verify Your Email</h2>
              <p className="text-sm max-w-72 mb-4">
                Please check both your inbox and SPAM folder for a verification link.
              </p>
              <Button
                variant="default"
                className="font-semibold"
                onClick={handleSendVerification}
                disabled={loading}
              >
                Send Verification Email <Mail className="ml-2" />
              </Button>
              {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
            </Card>
          )}
        </div>
        <div className="w-fit">
          <DashboardLeaderboard />
        </div>
      </div>
    </Navbar>
  );
}
