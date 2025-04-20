import { getUserStatistics } from "@/data/api";
import { $date_range, $date, $userBudgetFilter, $currentUser, setTotalChartData, setBudgetChartData, setMachineChartData, addFunctionToBudgetChart, addFunctionToMachineChart, clearFilteredBudgetChart, clearFilteredMachineChart, clearFilteredTotalChart, $filtered_total_chart, $filtered_budget_chart, $filtered_machine_chart, $userTotalChart, $userMachineChart, setFilteredTotalChartData, $precision, clearMachineChart, clearBudgetChart, clearTotalChart, $userMachineFilter } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect } from "react";
import { PrecisionType } from "@/data/types/precision-type";
import { userBudgetStats, userMachinesStats, userStats } from "@/data/types/user-stats";
import useQueryMachines from "./use-query-machines";
import useQueryBudgets from "./use-query-budgetCodes";


export function useQueryChart() {

    const { getTrainingsOfUser } = useQueryMachines(false);
    const { getBudgetsOfUser } = useQueryBudgets(false);
    const dateRange = useStore($date_range);
    const dateChoice = useStore($date);
    const filteredTotalChartData = useStore($filtered_total_chart);
    const filteredBudgetChartData = useStore($filtered_budget_chart);
    const filteredMachineChartData = useStore($filtered_machine_chart);
    const totalChartData = useStore($userTotalChart);
    const budgetChartData = useStore($userBudgetFilter);
    const machineChartData = useStore($userMachineChart);
    const userMachineFilter = useStore($userMachineFilter);
    const budgetCodeFilter = useStore($userBudgetFilter);
    const precision = useStore($precision);
    
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

      const totalData = localChartDatas.total;
      const budgetCodeData = localChartDatas.budgetCode;
      const machineData = localChartDatas.machine;

      const localChartData = totalData; 
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

        setTotalChartData(newChartData);

        for (let j = 0; j < budgetCodeData.length; j++) {
          const localChartData = budgetCodeData[j].data; 
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
          addFunctionToBudgetChart({...budgetCodeData[j], data: newChartData })
    }

    for (let j = 0; j < machineData.length; j++) {
      const localChartData = machineData[j].data; 
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
      addFunctionToMachineChart({...machineData[j], data: newChartData })
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
          

      const totalData = localChartDatas.total;
      const budgetCodeData = localChartDatas.budgetCode;
      const machineData = localChartDatas.machine;

      const localChartData = totalData; 
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

        setFilteredTotalChartData(newChartData);

        for (let j = 0; j < budgetCodeData.length; j++) {
          const localChartData = budgetCodeData[j].data; 
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
          addFunctionToBudgetChart({...budgetCodeData[j], data: newChartData })
    }

    for (let j = 0; j < machineData.length; j++) {
      const localChartData = machineData[j].data; 
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
      addFunctionToMachineChart({...machineData[j], data: newChartData })
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
          



      const totalData = localChartDatas.total;
      const budgetCodeData = localChartDatas.budgetCode;
      const machineData = localChartDatas.machine;

      const totalChartData = totalData; 
      const chartDataLength = totalChartData.length;

      let i = 0;

      const newTotalChartData: userStats[] = newXAxis.map(date => {

        const defaultData = { dateAdded: date, totalTime: 0};
        if (i >= chartDataLength) {
          return defaultData;
        }

        const chartDate = new Date(totalChartData[i].dateAdded);
        const check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear()) && date.getDate() >= chartDate.getDate()
        if (check) {
          return { dateAdded: new Date(totalChartData[i].dateAdded), totalTime: totalChartData[i++].totalTime }; 
        } else {
          return defaultData;
        }
        })

        setFilteredTotalChartData(newTotalChartData);

        for (let j = 0; j < budgetCodeData.length; j++) {
          const localBudgetChartData = budgetCodeData[j].data; 
          const chartDataLength = localBudgetChartData.length;
  
          let i = 0;
  
          const newBudgetChartData: userStats[] = newXAxis.map(date => {
  
            const defaultData = { dateAdded: date, totalTime: 0};
            if (i >= chartDataLength) {
              return defaultData;
            }
  
            const chartDate = new Date(localBudgetChartData[i].dateAdded);
            const check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear()) && date.getDate() >= chartDate.getDate()
            if (check) {
              return { dateAdded: new Date(localBudgetChartData[i].dateAdded), totalTime: localBudgetChartData[i++].totalTime }; 
            } else {
              return defaultData;
            }
          })

          addFunctionToBudgetChart({...budgetCodeData[j], data: newBudgetChartData })
    }

    for (let j = 0; j < machineData.length; j++) {
      const localMachineData = machineData[j].data; 
      const chartDataLength = localMachineData.length;

      let i = 0;

      const newMachineChartData: userStats[] = newXAxis.map(date => {

        const defaultData = { dateAdded: date, totalTime: 0};
        if (i >= chartDataLength) {
          return defaultData;
        }

        const chartDate = new Date(localMachineData[i].dateAdded);
        const check = (date.getMonth() === chartDate.getMonth() && date.getFullYear() === chartDate.getFullYear()) && date.getDate() >= chartDate.getDate()
        if (check) {
          return { dateAdded: new Date(localMachineData[i].dateAdded), totalTime: localMachineData[i++].totalTime }; 
        } else {
          return defaultData;
        }
      })
      addFunctionToMachineChart({...machineData[j], data: newMachineChartData })
    }
  }

    const fetchChartData = async () => {
      clearFilteredBudgetChart()
      clearFilteredMachineChart()
      clearFilteredTotalChart()
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
      
    }, [precision, dateRange, dateChoice, userMachineFilter, budgetCodeFilter])

    useEffect(() => {
      clearFilteredBudgetChart()
      clearFilteredMachineChart()
      clearFilteredTotalChart()
      clearBudgetChart()
      clearMachineChart()
      clearTotalChart()


    }, [])
    useEffect(() => {
      getTrainingsOfUser($currentUser.get().id).then(() => {
        getBudgetsOfUser($currentUser.get().id).then(() => {
          
        })

      }
      )

    }, [$currentUser])

    // getting & adding time for each day for all days within range
    const getUserChartData = async (
      page: number = 1,
      limit: number = 100,
      precision: PrecisionType = "d",
    ): Promise<{total: userStats[], budgetCode: userBudgetStats[], machine: userMachinesStats[]} | undefined> => {
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
        const { data } = await getUserStatistics(page, limit, to as Date, from as Date, precision, budgetCodeFilter, userMachineFilter)

        await setTotalChartData(data.total);
        await setBudgetChartData(data.budgetCode);
        await setMachineChartData(data.machine);

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

    return { filteredBudgetChartData, filteredMachineChartData, filteredTotalChartData, totalChartData, budgetChartData, machineChartData, getUserChartData, dateChoice }
}

export default useQueryChart;