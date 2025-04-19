import { getUserStatistics } from "@/data/api";
import { $userChart, $date_range, setChartData, $filtered_chart, setFilteredChart, clearFilteredChart } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect, useState } from "react";
import { PrecisionType } from "@/data/types/precision-type";
import { userStats } from "@/data/types/user-stats";


export function useQueryChart() {

    const dateRange = useStore($date_range);
    const chartData = useStore($userChart);
    const filteredChartData = useStore($filtered_chart)
    const [precision, setPrecision] = useState<PrecisionType>("d");

    const fetchChartDataDay = async () => {

      let newXAxis: Date[] = [];

      if (!dateRange || !dateRange.to || !dateRange.from) {
        return;
      }

      const localChartData = await getUserChartData()

      if (!localChartData) {
        return;
      }
      let date: Date = new Date(dateRange.from);


      while (date <= dateRange.to) {
          newXAxis = newXAxis.concat(new Date(date));
          date.setDate(date.getDate() + 1);
      }
          



      const chartDataLength = localChartData.length;

      let i = 0;

      const newChartData: userStats[] = newXAxis.map(date => {

        const defaultData = { dateAdded: date, totalTime: 0};
        if (i >= chartDataLength) {
          return defaultData;
        }

        const chartDate = new Date(localChartData[i].dateAdded);
        const check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear()) && date.getDate() >= chartDate.getDate()
        if (check) {
          return { dateAdded: new Date(localChartData[i].dateAdded), totalTime: localChartData[i++].totalTime }; 
        } else {
          return defaultData;
        }
      })

      setFilteredChart(newChartData);
    }

    const fetchChartData = async () => {
      switch(precision) {
        case "d":
          await fetchChartDataDay();
          break;
        
      }
    }

    // use Effect should update when user stats change
    useEffect(() => {
      
      fetchChartData().then(() => {

      })
      
    }, [precision, dateRange])

    useEffect(() => {
      clearFilteredChart()
    }, [])

    // getting & adding time for each day for all days within range
    const getUserChartData = async (
      page: number = 1,
      limit: number = 100,
      precision: PrecisionType = "d",
      budgetCode: number | undefined = undefined,
      machineId: number | undefined = undefined,
    ): Promise<userStats[] | undefined> => {
      try {

        // getting the date
        const now = new Date();
        const past = new Date();
        past.setMonth(now.getMonth() - 1);
        const to = dateRange && dateRange.to ? dateRange.to : now;
        const from = dateRange && dateRange.from ? dateRange.from : past;



        // setting chart data
        const { data } = await getUserStatistics(page, limit, to, from, precision, budgetCode, machineId)
        await setChartData(data)

        return data;

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