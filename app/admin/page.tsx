"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar/Navbar";
import { Editor } from "@monaco-editor/react";
import { AdminSignupRequestApproval } from "@/components/admin/AdminSignupRequestApproval";
import { AdminChallengeEditor } from "@/components/admin/AdminChallengeEditor";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminUserManager } from "@/components/admin/AdminUserManager";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [challengeTemplate, setChallengeTemplate] = useState("");
  const [initialSignupRequests, setInitalSignupRequests] = useState<any[]>([]);

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
      } catch (error) {
        router.push("/dashboard");
      }
    };

    getAdminResources();
  }, [user]);

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
        <div className="h-96 w-[55vw]">
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
