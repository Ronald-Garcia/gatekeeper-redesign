"use client"

import { Clock } from "lucide-react"
import {
  ChartConfig,
} from "@/components/ui/chart"
import useQueryChart from "@/hooks/use-query-chart-data"
import UserChart from "./chart"

const timeChartConfig = {
  totalTime: {
    icon: Clock,
    color: "#002d72",
    label: "Minutes",
  },

} satisfies ChartConfig

export function UserDashboardStats() {

  const { filteredBudgetChartData, filteredTotalChartData, filteredMachineChartData } = useQueryChart();
  return (

    <div className="grid grid-cols-2">
      <div>
        {filteredTotalChartData.length !== 0 ? <UserChart
          title="Total Summary:"
          data={filteredTotalChartData}
          xDataKey="dateAdded"
          yDataKey="totalTime"
          config={timeChartConfig}
          key="totalTime"
          >

        </UserChart> :
        <p className="text-center">
          Choose a filter/date range!
        </p>
      }

      </div>




        {filteredBudgetChartData.map(chartData => {
          if (chartData.data.length === 0) {
            return (
              <>
              </>
            )
          }

          return (
            <UserChart
          title={chartData.budgetCode}
          data={chartData.data}
          xDataKey="dateAdded"
          yDataKey="totalTime"
          config={timeChartConfig}
          key={chartData.budgetCode}
          >

        </UserChart>
          )
        })}

{filteredMachineChartData.map(chartData => {

if (chartData.data.length === 0) {
  return (
    <>
    </>
  )
}
return (
  <UserChart
          title={chartData.machineType}
          data={chartData.data}
          xDataKey="dateAdded"
          yDataKey="totalTime"
          config={timeChartConfig}
          key={chartData.machineType}
          >

        </UserChart>
)
})}




      
  </div>
    
  )
}

export default UserDashboardStats;