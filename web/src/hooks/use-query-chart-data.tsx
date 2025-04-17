import { getUserStatistics } from "@/data/api";
import { $userChart, $date_range, resetDateRange, setChartData, setDateRange } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect, useState } from "react";
import { PrecisionType } from "@/data/types/precision-type";
import { userStats } from "@/data/types/user-stats";


export function useQueryChart() {

    const dateRange = useStore($date_range);
    const chartData = useStore($userChart);
    const [precision, setPrecision] = useState<PrecisionType>("d");
    const [filteredChartData, setFilteredChartData] = useState<{dateAdded: Date, timeSpent: number}[]>([]);


    // use Effect should update when user stats change
    useEffect(() => {
      let newXAxis: Date[] = [];


      if (!dateRange || !dateRange.to || !dateRange.from) {
        return;
      }
      let date = new Date(dateRange.from);

      while (date <= dateRange.to) {
          newXAxis = newXAxis.concat(new Date(date));
          switch (precision) {
            case "m":
              date.setMinutes(date.getMinutes() + 1);
              break;
            case "d":
              date.setDate(date.getDate() + 1);
              break;
            case "h":
              date.setHours(date.getHours() + 1);
              break;
            case "mo":
              date.setMonth(date.getMonth() + 1);
              break;
            case "w":
              date.setDate(date.getDate() + 7);
              break;
            case "y":
              date.setFullYear(date.getFullYear() + 1);
              break;
          }
      }


      const newChartData: {dateAdded: Date, timeSpent: number}[] = newXAxis.map(x => {
        
        let cur_y: userStats | undefined = chartData.find(d => {
          if (d.dateAdded === x) {
            return d;
          }
        });        

        
        return  { timeSpent: cur_y ? cur_y.timeSpent : 0, dateAdded: x }; 
      });

      setFilteredChartData(newChartData);

      


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

    return { filteredChartData, precision, setPrecision, chartData, getUserChartData }
}

export default useQueryChart;