import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardHeader,
} from "../ui/card";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { User, SolvedChallenge, isSameDay } from "@/lib/utils";
import { Loading } from "../loading";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

  interface PointsOverTimeDataPoint {
    date: string;
    points: number;
  }

  const [pointsOverTimeChartData, setPointsOverTimeChartData] = useState<
    Array<PointsOverTimeDataPoint>
  >([]);

  const pointsOverTimeChartConfig = {
    desktop: {
      label: "Points",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const createPointsOverTimeData = (userData: User) => {
    const newPointsOverTimeChartData = [];
    const today = new Date();

    for (let i = 7; i >= 0; i--) {

      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);

      const formattedDate = `${pastDate.getMonth() + 1}/${pastDate.getDate()}`;

      newPointsOverTimeChartData.push({
        date: formattedDate,
        points: userData.solvedChallenges.reduce(
          (totalPointsOnDay: number, solvedChallenge: SolvedChallenge) => {
            if (isSameDay(pastDate.getTime(), solvedChallenge.timestamp)) {
              return totalPointsOnDay + solvedChallenge.points;
            }
            return 0;
          },
          0
        ),
      });
    }
    setPointsOverTimeChartData(newPointsOverTimeChartData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserData(user.uid);
          setUserData(userData);
          createPointsOverTimeData(userData);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUser();
  }, [status, user?.uid]);

  return (
    <div className="flex w-full h-60 gap-2 lg:animate-flyInFromTopLeft">
      <Card className="flex-grow justify-center lg:pb-0 pb-4">
        <CardHeader>
          <CardTitle>Points Over Time</CardTitle>
          <CardDescription>
            The number of points you earned everyday in the past week!
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full h-3/4 p-4 pb-8">
          {userData ? (
            <ChartContainer
              config={pointsOverTimeChartConfig}
              className="w-full h-full"
            >
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
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="points"
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
        </CardContent>
      </Card>
    </div>
  );
}
