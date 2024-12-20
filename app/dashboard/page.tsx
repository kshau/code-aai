"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRightIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function Dashboard() {

  return (

    <div className="flex flex-row gap-6 w-screen justify-center">

      <div className="flex flex-col gap-6">

        <DashboardChart/>

        <DashboardChallengeSelection/>

      </div>

      <DashboardLeaderboard/>

    </div>

  )

}

function DashboardLeaderboard() {

  return (
    <Card className="w-96">

    </Card>
  )

}

function DashboardChallengeSelection() {

  return (

    <ScrollArea className="pr-4">

      <div className="grid lg:grid-cols-2 gap-4 max-h-[23rem]">

        {[0,0,0,0,0,0].map((challenge, index) => (

          <Card className="min-w-64 max-w-96" key={index}>

            <CardHeader className="flex flex-row gap-4">

              <CardTitle>
                Fizz Buzz
              </CardTitle>

              <Badge className="my-auto relative bottom-1">
                Easy
              </Badge>

            </CardHeader>

            <CardContent className="text-lg flex flex-row gap-x-4">

              <span className="font-thin">
                A very nice description for a very nice challenges that you should totally solve!
              </span>

              <Button variant="outline" className="my-auto rounded-full aspect-square h-12">
                <ArrowRightIcon strokeWidth={3}/>
              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

    </ScrollArea>
  )

}

function DashboardChart() {

  return (
    <Card className="max-h-80 p-6">
      <ChartContainer config={chartConfig} className="max-h-64 max-w-">
          <AreaChart
            accessibilityLayer
            data={chartData}
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
    </Card>
  )

}