import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/lib/utils";
import { Loading } from "../loading";

import { Pie, PieChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashboardCharts() {
	const { user, status } = useAuth();
	const { getUserData } = useFirestore();
	const [userData, setUserData] = useState<User | null>(null);

	const completionChartData = [
		{ browser: "chrome", visitors: 275 },
		{ browser: "safari", visitors: 200 },
		{ browser: "firefox", visitors: 187 },
		{ browser: "edge", visitors: 173 },
		{ browser: "other", visitors: 90 },
	];

	const completionChartConfig = {
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
		},
		firefox: {
			label: "Firefox",
			color: "hsl(var(--chart-3))",
		},
		edge: {
			label: "Edge",
			color: "hsl(var(--chart-4))",
		},
		other: {
			label: "Other",
			color: "hsl(var(--chart-5))",
		},
	} satisfies ChartConfig;

	const pointsOverTimeChartData = [
		{ month: "January", desktop: 186 },
		{ month: "February", desktop: 305 },
		{ month: "March", desktop: 237 },
		{ month: "April", desktop: 73 },
		{ month: "May", desktop: 209 },
		{ month: "June", desktop: 214 },
	];
	const pointsOverTimeChartConfig = {
		desktop: {
			label: "Desktop",
			color: "hsl(var(--chart-1))",
		},
	} satisfies ChartConfig;

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
		<div className="flex w-full h-60 gap-2 lg:animate-flyInFromTopLeft">
			<Card className="flex-grow flex items-center justify-center ">
				{userData ? (
					<ChartContainer
						config={completionChartConfig}
						className="mx-auto aspect-square max-h-[250px]"
					>
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Pie
								data={completionChartData}
								dataKey="visitors"
								nameKey="browser"
							/>
						</PieChart>
					</ChartContainer>
				) : (
					<Loading />
				)}
			</Card>
			<Card className="flex-grow flex items-center justify-center ">
				{userData ? (
					<ChartContainer config={pointsOverTimeChartConfig}>
						<LineChart
							accessibilityLayer
							data={pointsOverTimeChartData}
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
								content={<ChartTooltipContent hideLabel />}
							/>
							<Line
								dataKey="desktop"
								type="linear"
								stroke="var(--color-desktop)"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				) : (
					<Loading />
				)}
			</Card>
		</div>
	);
}
