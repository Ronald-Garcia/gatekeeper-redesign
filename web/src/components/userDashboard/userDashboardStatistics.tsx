"use client"

import { Clock } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import useQueryChart from "@/hooks/use-query-chart-data"
import DatePickerWithRange from "../financialStatements/datepicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { PrecisionType } from "@/data/types/precision-type"
import { DatePicker } from "../financialStatements/datepick"
import GeneralizedFilter from "../general/filtering"

const timeChartConfig = {
  totalTime: {
    icon: Clock,
    color: "#002d72",
    label: "Minutes",
  },

} satisfies ChartConfig

export function UserDashboardStats() {

  const setPrecisionValue = (value: PrecisionType) => {
    setPrecision(value);
  }
  const { filteredChartData, precision, setPrecision } = useQueryChart();
  return (
    <Card className="h-screen">
      <CardHeader className="flex flex-row items-center gap-2 py-5 space-y-0 ">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>

        </div>
        <GeneralizedFilter filters={["userMachineType", "userBudgetType"]}></GeneralizedFilter>
        {/* {precision === "m" && <TimePickerInput date={dateChoice} setDate={setDate} picker="hours"></TimePickerInput>} */}
        {precision === "d" && <DatePickerWithRange></DatePickerWithRange>}
        { (precision === "h" || precision === "m") && <DatePicker></DatePicker>}
        <Select value={precision} onValueChange={setPrecisionValue}>
          <SelectTrigger>
            <SelectValue placeholder="Days" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="m">
              Minutes
            </SelectItem> */}
            <SelectItem value="h">
              Hours
            </SelectItem>
            <SelectItem value="d">
              Days
            </SelectItem>
            <SelectItem value="w">
              Weeks
            </SelectItem>
            <SelectItem value="mo">
              Months
            </SelectItem>
            <SelectItem value="y">
              Years
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={timeChartConfig} className="min-h-fit min-w-fit">
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
        {/* <div className="flex gap-2 font-medium leading-none">
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total machine use
        </div>
      </CardFooter>
    </Card>
  )
}


export default UserDashboardStats;