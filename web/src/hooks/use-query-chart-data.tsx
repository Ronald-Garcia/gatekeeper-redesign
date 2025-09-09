import { getUserStatistics } from "@/data/api";
import { $userChart, $date_range, setChartData, $filtered_chart, clearFilteredChart, $date, $userBudgetFilter, $machineTypeFilter, $currentUser, addFunctionToChart } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect, useState } from "react";
import { PrecisionType } from "@/data/types/precision-type";
import { userBudgetStats, userMachinesStats, userStats } from "@/data/types/user-stats";
import useQueryMachines from "./use-query-machines";
import useQueryBudgets from "./use-query-budgetCodes";


export function useQueryChart() {

    const { getTrainingsOfUser } = useQueryMachines(false);
    const { getBudgetsOfUser } = useQueryBudgets(false);
    const dateRange = useStore($date_range);
    const dateChoice = useStore($date);
    const chartData = useStore($userChart);
    const filteredChartData = useStore($filtered_chart);
    const machineTypeFilter = useStore($machineTypeFilter);
    const budgetCodeFilter = useStore($userBudgetFilter);
    const [precision, setPrecision] = useState<PrecisionType>("d");

    const curUser = useStore($currentUser);
    
    const fetchChartDataMinute = async () => {
      let newXAxis: Date[] = [];

      if (!dateChoice) {
        return;
      }

      const localChartDatas = await getUserChartData(1, 100, "m");

      if (!localChartDatas) {
        return;
      }
      let date: Date = new Date(dateChoice);

      date.setMinutes(0);
      date.setSeconds(0);
      
      let endDate: Date = new Date(dateChoice);
      endDate.setHours(endDate.getHours() + 1);
      endDate.setMinutes(0);
      endDate.setSeconds(0);


      while (date <= endDate) {
          newXAxis = newXAxis.concat(new Date(date));
          date.setMinutes(date.getMinutes() + 1);
      }

      for (let j = 0; j < localChartDatas.length; j++) {
        const localChartData = localChartDatas[j].data; 
        const chartDataLength = localChartData.length;

        let i = 0;

        const newChartData: userStats[] = newXAxis.map(date => {

          const defaultData = { dateAdded: date, totalTime: 0};
          if (i >= chartDataLength) {
            return defaultData;
          }

          const chartDate = new Date(localChartData[i].dateAdded);
          const check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear() && date.getDate() === chartDate.getDate()) && date.getHours() === chartDate.getHours() && date.getMinutes() >= chartDate.getMinutes()
          if (check) {
            return { dateAdded: new Date(localChartData[i].dateAdded), totalTime: localChartData[i++].totalTime }; 
          } else {
            return defaultData;
          }
        })

        addFunctionToChart({ ...localChartDatas[j], data: newChartData });
    }

  }


    const fetchChartDataHour = async () => {
      let newXAxis: Date[] = [];

      if (!dateChoice) {
        return;
      }

      const localChartDatas = await getUserChartData(1, 100, "h");

      if (!localChartDatas) {
        return;
      }
      let date: Date = new Date(dateChoice);

      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      
      let endDate: Date = new Date(dateChoice);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);


      while (date <= endDate) {
          newXAxis = newXAxis.concat(new Date(date));
          date.setHours(date.getHours() + 1);
      }
          

      for (let j = 0; j < localChartDatas.length; j++) {
        const localChartData = localChartDatas[j].data;
        const chartDataLength = localChartData.length;

        let i = 0;
  
        const newChartData: userStats[] = newXAxis.map(date => {
  
          const defaultData = { dateAdded: date, totalTime: 0};
          if (i >= chartDataLength) {
            return defaultData;
          }
  
          const chartDate = new Date(localChartData[i].dateAdded);
          const check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear() && date.getDate() === chartDate.getDate()) && date.getHours() >= chartDate.getHours()
          if (check) {
            return { dateAdded: new Date(localChartData[i].dateAdded), totalTime: localChartData[i++].totalTime }; 
          } else {
            return defaultData;
          }
        })
        addFunctionToChart({ ...localChartDatas[j], data: newChartData });
      }


    }

    const fetchChartDataDay = async () => {

      let newXAxis: Date[] = [];

      if (!dateRange || !dateRange.to || !dateRange.from) {
        return;
      }

      const localChartDatas = await getUserChartData()

      if (!localChartDatas) {
        return;
      }
      let date: Date = new Date(dateRange.from);


      while (date <= dateRange.to) {
          newXAxis = newXAxis.concat(new Date(date));
          date.setDate(date.getDate() + 1);
      }
          



      for (let j = 0; j < localChartDatas.length; j++) {
        const localChartData = localChartDatas[j].data; 
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
  
        addFunctionToChart({...localChartDatas[j], data: newChartData });
      }


    }

    const fetchChartData = async () => {
      clearFilteredChart()
      switch(precision) {
        case "d":
          await fetchChartDataDay();
          break;
        case "h":
          await fetchChartDataHour();
          break;
        case "m":
          await fetchChartDataMinute();
          break;
        
      }
    }

    // use Effect should update when user stats change
    useEffect(() => {
      
      fetchChartData().then(() => {

      })
      
    }, [precision, dateRange, dateChoice])

    useEffect(() => {

      getTrainingsOfUser(curUser.id)
      clearFilteredChart()

      getBudgetsOfUser(curUser.id)
    }, [])


    // getting & adding time for each day for all days within range
    const getUserChartData = async (
      page: number = 1,
      limit: number = 100,
      precision: PrecisionType = "d",
    ): Promise<(userBudgetStats | userMachinesStats)[] | undefined> => {
      try {
        const now = new Date();
        const past = new Date();
        
        let to;
        let from;
        
        if (precision === "d") {
          past.setMonth(now.getMonth() - 1);
          to = dateRange && dateRange.to ? dateRange.to : now;
          from = dateRange && dateRange.from ? dateRange.from : past;  
        }

        if (precision === "h") {

          const toDate = dateChoice ? new Date(dateChoice.getTime()) : new Date();

          toDate.setHours(23);
          toDate.setMinutes(59);
          toDate.setSeconds(59);

          const fromDate = new Date(toDate.getTime());
          fromDate.setHours(0);
          fromDate.setMinutes(0);
          fromDate.setSeconds(0);

          to = toDate;
          from = fromDate;
        }

        if (precision === "m") {
          const toDate = dateChoice ? new Date(dateChoice.getTime()) : new Date();
          toDate.setHours(toDate.getHours() + 1);
          toDate.setMinutes(0);
          toDate.setSeconds(0);

          const fromDate = new Date(toDate.getTime());
          fromDate.setHours(toDate.getHours() - 1);
          fromDate.setMinutes(0);
          fromDate.setSeconds(0);

          to = toDate;
          from = fromDate;
        }





        // setting chart data
        const { data } = await getUserStatistics(page, limit, to as Date, from as Date, precision, budgetCodeFilter, machineTypeFilter)
        await setChartData(data)

        console.log(data)
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

    return { filteredChartData, precision, setPrecision, chartData, getUserChartData, dateChoice }
}

export default useQueryChart;