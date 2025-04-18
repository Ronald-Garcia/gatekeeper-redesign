"use client"

import { Clock, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import useQueryChart from "@/hooks/use-query-chart-data"
import DatePickerWithRange from "../financialStatements/datepicker"

const timeChartConfig = {
  totalTime: {
    icon: Clock,
    color: "#002d72",
    label: "Minutes",
  },

} satisfies ChartConfig

export function UserDashboardStats() {

  const { filteredChartData, precision } = useQueryChart();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Linear</CardTitle>
        <CardDescription>{precision}</CardDescription>

        <DatePickerWithRange></DatePickerWithRange>
      </CardHeader>
      <CardContent>
        <ChartContainer config={timeChartConfig}>
          <BarChart
            accessibilityLayer
            data={filteredChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dateAdded"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value: Date) => value.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric"})}
            />
            <ChartTooltip
              cursor
              content={<ChartTooltipContent
              />}
            />

            {/* <ChartLegend content={<ChartLegendContent/>}></ChartLegend> */}
            <Bar
              dataKey="totalTime"
              fill="#002d72"
              strokeWidth={2}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="w-4 h-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}


export default UserDashboardStats;