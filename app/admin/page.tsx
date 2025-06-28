"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import { AdminChallengeEditor } from "@/components/admin/AdminChallengeEditor";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AdminUserManager } from "@/components/admin/AdminUserManager";
import { LoadingPage } from "@/components/loading";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [challengeTemplate, setChallengeTemplate] = useState("");
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
    <Navbar className="flex flex-wrap lg:flex-row gap-4 items-center justify-center w-full mt-28 mb-16 p-2" protectedRoute>
      <AdminChallengeEditor challengeTemplate={challengeTemplate} />
      <AdminUserManager />
    </Navbar>
  );
}
