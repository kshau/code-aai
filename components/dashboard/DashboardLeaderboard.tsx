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
import { useFirestore } from "@/hooks/useFirestore";
import { User } from "@/lib/utils";

export default function DashboardLeaderboard() {
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
		<Card className="max-w-[40rem] h-full flex-grow flex-col lg:animate-flyInFromRight">
			<CardHeader>
				<CardTitle>Leaderboard</CardTitle>
				<CardDescription>
					See the users with the most points!
				</CardDescription>
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
								<TableCell className="text-left">
									{user.username}
								</TableCell>
								<TableCell>
									{user.solvedChallengeIds.length}
								</TableCell>
								<TableCell>
									{user.points.toLocaleString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
