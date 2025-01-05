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
import { LeaderboardUser } from "@/lib/utils";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardUser[] | null
  >(null);

  const getLeaderboard = async () => {
    setLeaderboardData([
      {
        name: "Shaurya Kumar",
        solves: 25,
        points: 69420,
      },
      {
        name: "Keshav Shah",
        solves: 23,
        points: 68420,
      },
    ]);
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
                <TableCell className="text-left">{user.name}</TableCell>
                <TableCell>{user.solves}</TableCell>
                <TableCell>{user.points.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
