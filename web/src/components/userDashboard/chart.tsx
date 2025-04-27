import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type UserChartProps = {
    title: string;
    config: ChartConfig,
    data: any[]
    xDataKey: string,
    yDataKey: string,
}

const UserChart = ({
    title,
    config,
    data,
    xDataKey,
    yDataKey
}: UserChartProps) => {

    return (
        <Card data-cy={`stats-${title}`}>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>

      </CardHeader>
        <CardContent>

        <ChartContainer config={config} className="min-h-fit min-w-fit">
  <BarChart
    accessibilityLayer
    data={data}
    margin={{
      left: 12,
      right: 12,
    }}
  >
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey={xDataKey}
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
      dataKey={yDataKey}
      fill="#002d72"
      strokeWidth={2}
    />
  </BarChart>
</ChartContainer>
    </CardContent>


</Card>
    )
}

export default UserChart;