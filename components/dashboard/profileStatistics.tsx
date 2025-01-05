import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileStatistics() {
  const { queryDocuments } = useFirestore();
  const { user, status } = useAuth();
  const [userData, setUserData] = useState<any>(12);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.uid) {
        try {
          const users = await queryDocuments("users", "uid", user.uid);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUsers();
  }, [status, user?.uid]);

  return (
    <div className="flex w-full h-1/4 gap-2">
      <Card className="flex-grow flex items-center justify-center ">
        Chart 1
      </Card>
      <Card className="flex-grow flex items-center justify-center ">
        Chart 2
      </Card>
    </div>
  );
}
