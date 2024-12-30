"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRightIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Challenge, cn, LeaderboardUser } from "@/lib/utils";
import Link from "next/link";
import axios from "axios";
import { Pie, PieChart } from "recharts"

export default function Dashboard() {

	return (

		<div className="w-screen flex justify-center">

			<div className="flex flex-wrap gap-6 justify-center m-4">

				<div className="flex flex-col gap-6">

					<DashboardGraphics />

					<DashboardChallengeSelection />

				</div>

				<DashboardLeaderboard />

			</div>

		</div>

	)

}

function DashboardLeaderboard() {

	const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[] | null>(null);

	const getLeaderboard = async () => {

		setLeaderboardData([
			{
				name: "Shaurya Kumar",
				solves: 25,
				points: 69420
			},
			{
				name: "Keshav Shah",
				solves: 23,
				points: 68420
			}
		]);

	}

	useEffect(() => {

		getLeaderboard();

	}, [])

	return (
		<Card className="lg:w-fit lg:max-w-[50rem]">

			<CardHeader>

				<CardTitle>
					Leaderboard
				</CardTitle>

			</CardHeader>

			<CardContent>

				{leaderboardData ? (
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
							{leaderboardData.map((user, index) => (
								<TableRow key={index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell className="text-left">{user.name}</TableCell>
									<TableCell>{user.solves}</TableCell>
									<TableCell>{user.points.toLocaleString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="w-80">

					</div>
				)}

			</CardContent>

		</Card>
	)

}

function DashboardChallengeSelection() {

	const [challengesData, setChallengesData] = useState<Challenge[]>([
		{
			id: "banana",
			title: "Fizz Buzz",
			description: "A very nice description for a very nice challenges that you should totally solve!",
			difficulty: "easy",
			testCases: []
		},
		{
			id: "mango",
			title: "Summation",
			description: "Are you smart enough to be able to add two integers together? Prove it by solving!",
			difficulty: "medium",
			testCases: []
		},
		{
			id: "strawberry",
			title: "Integration",
			description: "What do you still remember from your calculus class in high school or college?",
			difficulty: "hard",
			testCases: []
		}
	]);

	return (

		<ScrollArea className="pr-4">

			<div className="grid lg:grid-cols-2 gap-4 max-h-[23rem]">

				{challengesData.map((challenge: Challenge, index) => (

					<Card className="min-w-64 lg:max-w-96" key={index}>

						<CardHeader className="flex flex-row gap-4">

							<CardTitle>
								{challenge.title}
							</CardTitle>

							<Badge className="my-auto relative bottom-1" difficulty={challenge.difficulty}>
								{challenge.difficulty.toUpperCase()}
							</Badge>

						</CardHeader>

						<CardContent className="text-lg flex flex-row gap-x-4">

							<span className="font-thin">
								{challenge.description}
							</span>

							<Link href={`/solve?c=${challenge.id}`}>
								<Button variant="outline" className="my-auto rounded-full aspect-square h-12">
									<ArrowRightIcon strokeWidth={3} />
								</Button>
							</Link>

						</CardContent>

					</Card>

				))}

			</div>

		</ScrollArea>
	)

}

function DashboardGraphics() {

	const pointsGraphData = [
		{ month: "January", desktop: 186 },
		{ month: "February", desktop: 305 },
		{ month: "March", desktop: 237 },
		{ month: "April", desktop: 73 },
		{ month: "May", desktop: 209 },
		{ month: "June", desktop: 214 },
	]

	const pointsGraphConfig = {
		desktop: {
			label: "Desktop",
			color: "hsl(var(--chart-1))",
		},
	} satisfies ChartConfig

	const completionPieChartData = [
		{ browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
		{ browser: "safari", visitors: 200, fill: "var(--color-safari)" },
		{ browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
		{ browser: "edge", visitors: 173, fill: "var(--color-edge)" },
		{ browser: "other", visitors: 90, fill: "var(--color-other)" },
	]

	const completionPieChartConfig = {
		visitors: {
			label: "Visitors",
		},
		chrome: {
			label: "Chrome",
			color: "hsl(var(--chart-1))",
		},
		safari: {
			label: "Safari",
			color: "hsl(var(--chart-2))",
		}
	} satisfies ChartConfig

	return (
		<div className="flex flex-wrap gap-4">

			<Card className="w-full max-w-64">

				<CardHeader>
					<CardTitle>
						Completion
					</CardTitle>
				</CardHeader>

				<CardContent>

					<ChartContainer
						config={completionPieChartConfig}
						className="m-auto aspect-square max-h-[250px]"
					>
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Pie data={completionPieChartData} dataKey="visitors" nameKey="browser" />
						</PieChart>
					</ChartContainer>

				</CardContent>

			</Card>

			<Card className="">

				<CardHeader>
					<CardTitle>
						Points
					</CardTitle>
				</CardHeader>

				<CardContent>

					<ChartContainer config={pointsGraphConfig} className="max-h-60 w-full mt-2">
						<AreaChart
							accessibilityLayer
							data={pointsGraphData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator="dot" hideLabel />}
							/>
							<Area
								dataKey="desktop"
								type="linear"
								fill="var(--color-desktop)"
								fillOpacity={0.4}
								stroke="var(--color-desktop)"
							/>
						</AreaChart>
					</ChartContainer>

				</CardContent>
			</Card>

		</div>
	)

}