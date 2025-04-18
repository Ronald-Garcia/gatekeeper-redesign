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


    const fetchChartData = async () => {

      let newXAxis: Date[] = [];

      if (!dateRange || !dateRange.to || !dateRange.from) {
        return;
      }

      await getUserChartData()
      let date: Date = new Date(dateRange.from);

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
          



      const chartDataLength = chartData.length;

      let i = 0;

      const newChartData: userStats[] = newXAxis.map(date => {

        const defaultData = { dateAdded: date, totalTime: 0};
        if (i >= chartDataLength) {
          return defaultData;
        }

        const chartDate = new Date(chartData[i].dateAdded);
        let check;

        switch (precision) {
          case "m":
            check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear() && date.getDate() === chartDate.getDate()) && date.getMinutes() >= chartDate.getMinutes();           
            break;
          case "d":
            check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear()) && date.getDate() >= chartDate.getDate()
            break;
          case "h":
            check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear() && date.getDate() === chartDate.getDate()) && date.getHours() >= chartDate.getHours();           
            break;
          case "mo":
            check = (date.getFullYear() === chartDate.getFullYear()) && date.getMonth() >= chartDate.getMonth();           
            break;
          case "w":
            check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear()) && (Math.floor(date.getDate() / 7) === Math.floor(chartDate.getDate() / 7)) && date.getDay() >= chartDate.getDay();
            break;
          case "y":
            check = date.getFullYear() >= chartDate.getFullYear();
            break;
        }
        if (check) {
          return { dateAdded: new Date(chartData[i].dateAdded), totalTime: chartData[i++].totalTime }; 
        } else {
          return defaultData;
        }
      })

      setFilteredChart(newChartData);
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
    ) => {
      try {

        // getting the date
        const now = new Date();
        const past = new Date();
        past.setMonth(now.getMonth() - 1);
        const to = dateRange && dateRange.to ? dateRange.to : now;
        const from = dateRange && dateRange.from ? dateRange.from : past;

        console.log({to, from});

        // setting chart data
        const { data } = await getUserStatistics(page, limit, to, from, precision, budgetCode, machineId)
        await setChartData(data)
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