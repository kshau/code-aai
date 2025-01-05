"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFirestore } from "@/hooks/useFirestore";
import { User } from "@/lib/utils";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<User[] | null>(null);
  const { getDocuments } = useFirestore();

  const getLeaderboard = async () => {
    const users: User[] = await getDocuments<User>("users");
    setLeaderboardData(users);
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
    <Card className="w-[400px] h-full flex-grow flex-col">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
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
            {leaderboardData?.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-left">{user.username}</TableCell>
                <TableCell>{user.solvedChallengeIds.length}</TableCell>
                <TableCell>{user.points.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
