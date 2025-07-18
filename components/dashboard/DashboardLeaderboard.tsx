"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/hooks/useFirestore";
import { User } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<User[] | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);

  const [filter, setFilter] = useState<"top" | "around" | "school">("top");
  const { getDocuments, getUserData } = useFirestore();
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserData(user.uid);
          setUserData(userData);
        } catch (error) {
          console.error(error)
        }
      }
    };

    fetchUser();
  }, [status, user?.uid]);

  const getLeaderboard = async () => {
    const users: User[] = await getDocuments<User>("users");

    const sortedUsers = users?.sort((a, b) => b.points - a.points) || [];
    setLeaderboardData(sortedUsers);
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  useEffect(() => {
    const getFilteredUsers = async () => {
      if (!user || !leaderboardData) {
        return [];
      }

      if (filter == "top" || filter == "school") {
        setFilteredUsers(leaderboardData.slice(0, 10));
      } else {
        const currentUser = await getUserData(user.uid);
        if (!currentUser) setFilteredUsers(leaderboardData.slice(0, 10));

        const currentUserIndex = leaderboardData.findIndex(
          (u) => u.uid === currentUser.uid
        );
        const start = Math.max(0, currentUserIndex - 4);
        const end = Math.min(leaderboardData.length, start + 9);
        setFilteredUsers(leaderboardData.slice(start, end));
      }
    };

    getFilteredUsers();
  }, [filter, user, leaderboardData]);

  return (
    <Card className="lg:max-w-[40rem] h-full flex-grow flex-col lg:animate-flyInFromRight">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>

        {userData ? (
          <CardDescription>
            You have earned{" "}
            <span className="text-primary font-semibold">{userData.points}</span>{" "}
            points from{" "}
            <span className="text-primary font-semibold">
              {userData.solvedChallenges.length}
            </span>{" "}
            challenge{userData.solvedChallenges.length !== 1 && "s"}!
          </CardDescription>
        ) : (
          <CardDescription className="text-muted-foreground">
            Your profile is still loading or unavailable.
          </CardDescription>
        )}

        <div className="flex flex-row gap-x-2 mt-2">
          <Button
            variant={filter === "top" ? "default" : "outline"}
            onClick={() => setFilter("top")}
            className="text-xs"
            size={"sm"}
          >
            Top Users
          </Button>
          <Button
            variant={filter === "around" ? "default" : "outline"}
            onClick={() => setFilter("around")}
            className="text-xs"
            size={"sm"}
            disabled={!userData}
          >
            Around You
          </Button>
          <Button
            variant={filter === "school" ? "default" : "outline"}
            onClick={() => setFilter("school")}
            className="text-xs"
            size={"sm"}
            disabled={!userData}
          >
            Your School
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredUsers?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Solves</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((leaderboardUser, index) => (
                <TableRow
                  key={leaderboardUser.uid}
                  className={
                    leaderboardUser.uid === user?.uid ? "bg-muted" : ""
                  }
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-left">
                    {leaderboardUser.email}
                  </TableCell>
                  <TableCell>
                    {leaderboardUser.solvedChallenges.length}
                  </TableCell>
                  <TableCell>
                    {leaderboardUser.points.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            No leaderboard data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
