import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/lib/utils";
import { Loading } from "../loading";

export default function ProfileStatistics() {
  const { user, status } = useAuth();
  const { getUserData } = useFirestore();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserData(user.uid);
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUser();
  }, [status, user?.uid]);

  return (
    <div className="flex w-full h-60 gap-2">
      <Card className="flex-grow flex items-center justify-center ">
        {userData ? userData.points : <Loading />}
      </Card>
      <Card className="flex-grow flex items-center justify-center ">
        {userData ? userData.username : <Loading />}
      </Card>
    </div>
  );
}
