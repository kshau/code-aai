"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRightIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Challenge, cn } from "@/lib/utils";
import Link from "next/link";

const dashboardChartData = [
	{ month: "January", desktop: 186 },
	{ month: "February", desktop: 305 },
	{ month: "March", desktop: 237 },
	{ month: "April", desktop: 73 },
	{ month: "May", desktop: 209 },
	{ month: "June", desktop: 214 },
]

const dashboardChartConfig = {
	desktop: {
		label: "Desktop",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig

export default function Dashboard() {

	return (

		<div className="w-screen flex justify-center">

			<div className="flex flex-wrap gap-6 justify-center m-4">

				<div className="flex flex-col gap-6">

					<DashboardChart />

					<DashboardChallengeSelection />

				</div>

				<DashboardLeaderboard />

			</div>

		</div>

	)

}

function DashboardLeaderboard() {

	return (
		<Card className="lg:w-fit lg:max-w-[50rem]">

			<CardHeader>

				<CardTitle>
					Leaderboard
				</CardTitle>

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
						<TableRow>
							<TableCell>1</TableCell>
							<TableCell className="text-left">Shaurya Kumar</TableCell>
							<TableCell>25</TableCell>
							<TableCell>69,420</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>2</TableCell>
							<TableCell className="text-left">Keshav Shah</TableCell>
							<TableCell>23</TableCell>
							<TableCell>69,200</TableCell>
						</TableRow>
					</TableBody>
				</Table>

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
			difficulty: "easy"
		}, 
		{
			id: "mango",
			title: "Summation", 
			description: "Are you smart enough to be able to add two integers together? Prove it by solving!", 
			difficulty: "medium"
		}, 
		{
			id: "strawberry",
			title: "Integration", 
			description: "What do you still remember from your calculus class in high school or college?", 
			difficulty: "hard"
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

function DashboardChart() {

	return (
		<Card className="max-h-80">

			<CardHeader>
				<CardTitle>
					Points
				</CardTitle>
			</CardHeader>

			<CardContent>

				<ChartContainer config={dashboardChartConfig} className="max-h-60 w-full mt-2">
					<AreaChart
						accessibilityLayer
						data={dashboardChartData}
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
	)

}