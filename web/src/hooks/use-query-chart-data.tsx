import { getUserStatistics } from "@/data/api";
import { $userChart, $date_range, resetDateRange, setChartData, setDateRange } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect, useState } from "react";


export function useQueryChart() {

    const dateRange = useStore($date_range);
    const chartData = useStore($userChart);
    const [precision, setPrecision] = useState<"m" | "d" | "w" | "mo" | "y">("d");
    const [xAxis, setXAxis] = useState<Date[]>([]);
    const [yAxis, setYAxis] = useState<number[]>([]);


    // use Effect should update when user stats change
    useEffect(() => {
      const newXAxis: Date[] = [];

    }, [chartData, precision, dateRange])


    useEffect(() => {
        resetDateRange();
        getUserChartData();
    }, [])

    // getting & adding time for each day for all days within range
    const getUserChartData = async (
      page: number = 1,
      limit: number = 10,
      precision: "m" | "h" | "d" | "w" = "m",
      budgetCode: number | undefined = undefined,
      machineId: number | undefined = undefined,
    ) => {
      try {

        // getting the date
        const now = new Date();
        const past = new Date();
        past.setFullYear(now.getFullYear() - 1);
        const to = dateRange && dateRange.to ? dateRange.to : now;
        const from = dateRange && dateRange.from ? dateRange.from : past;
        setDateRange({to, from})

        // setting chart data
        const { data } = await getUserStatistics(page, limit, to, from, precision, budgetCode, machineId)
        setChartData(data)
      } catch (e) {
        const errorMessage = (e as Error).message;
        toast({
          variant: "destructive",
          title: "❌ Sorry! There was an error fetching user statistics 🙁",
          description: errorMessage
        });
      }
    }

    return { chartData, getUserChartData }
}

export default useQueryChart;