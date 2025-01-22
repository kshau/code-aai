"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar/Navbar";
import { AdminSignupRequestApproval } from "@/components/admin/AdminSignupRequestApproval";
import { AdminChallengeEditor } from "@/components/admin/AdminChallengeEditor";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AdminUserManager } from "@/components/admin/AdminUserManager";
import { LoadingPage } from "@/components/loading";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [challengeTemplate, setChallengeTemplate] = useState("");
  const [initialSignupRequests, setInitalSignupRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAdminResources = async () => {
      try {
        const userToken = await user?.getIdToken();
        const res = await fetch("/api/admin/getResources", {
          method: "POST",
          body: JSON.stringify({ userToken }),
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setChallengeTemplate(data.challengeTemplate);
        setInitalSignupRequests(data.signupRequests);
        setIsLoading(false);
      } catch {
        router.push("/dashboard");
      }
    };

    if (user) {
      getAdminResources();
    }
  }, [router, user]);

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <Navbar className="flex justify-center items-center" protectedRoute>
      <Tabs
        defaultValue="signup-reuqests"
        className="flex flex-col items-center"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="signup-reuqests">Signup Requests</TabsTrigger>
          <TabsTrigger value="create-challenge">Create Challenge</TabsTrigger>
          <TabsTrigger value="delete-users">Delete Users</TabsTrigger>
        </TabsList>
        <div className="h-96 max-w-[70rem]">
          <TabsContent value="signup-reuqests">
            <AdminSignupRequestApproval
              signupRequests={initialSignupRequests}
            />
          </TabsContent>
          <TabsContent value="create-challenge">
            <AdminChallengeEditor challengeTemplate={challengeTemplate} />
          </TabsContent>
          <TabsContent value="delete-users">
            <AdminUserManager />
          </TabsContent>
        </div>
      </Tabs>
    </Navbar>
  );
}
